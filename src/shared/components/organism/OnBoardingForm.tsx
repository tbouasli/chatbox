import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { auth, firestore, storage } from '@/lib/firebase';

import ImagePicker from '@/shared/components/molecule/ImagePicker';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';

import { userMapper } from '@/app/infra/mappers/UserMapper';
import { User } from '@/app/infra/models/User';

const FormSchema = z.object({
    displayName: z.string().min(3, {
        message: 'Please enter a nickname with at least 3 characters.',
    }),
    nickname: z
        .string()
        .min(3, {
            message: 'Please enter a nickname with at least 3 characters.',
        })
        .max(50, {
            message: 'Please enter a nickname with at most 50 characters.',
        }),
});

function OnBoardingForm() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user] = useAuthState(auth);
    const [image, setImage] = React.useState<File | undefined>();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    React.useEffect(() => {
        if (user?.displayName && form.getValues('displayName') === undefined) {
            form.setValue('displayName', user.displayName);
        }
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        if (!user) {
            toast({
                title: 'Error',
                description: 'Please login first.',
            });
            return;
        }

        if (!image && !user?.photoURL) {
            toast({
                title: 'Error',
                description: 'Please upload a profile picture.',
            });
            return;
        }
        const storageRef = ref(storage, `users/profile-picture/${user.uid}`);

        if (image) {
            await uploadBytes(storageRef, image);
        }

        const downloadURL = image ? await getDownloadURL(storageRef) : (user.photoURL as string);

        const userEntity = new User({
            id: user.uid,
            displayName: values.displayName,
            nickname: values.nickname,
            photoURL: downloadURL,
        });

        const userDocRef = doc(firestore, 'users', user.uid);
        const indexDocRef = doc(firestore, 'index', 'user', 'nickname', userEntity.nickname);

        const indexDoc = await getDoc(indexDocRef);

        if (indexDoc.exists()) {
            toast({
                title: 'Error',
                description: 'Nickname already taken.',
            });
            return;
        }

        const batch = writeBatch(firestore);

        batch.set(userDocRef.withConverter(userMapper), userEntity);

        batch.set(indexDocRef, {
            ref: userDocRef,
        });

        await batch.commit();

        navigate('/app');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="center">
                    <ImagePicker setImage={setImage} defaultImage={user?.photoURL} />
                </div>
                <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Insert Display Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Insert Nickname" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <span className="text-accent">
                    Don’t worry, you can change <br /> your profile anytime!
                </span>
                <Button className="rounded-full absolute bottom-4 right-4 p-3" type="submit">
                    <img className="text-primary-foreground" src="/assets/icon/front.svg" alt="Back" height={16} width={16} />
                </Button>
            </form>
        </Form>
    );
}

export default OnBoardingForm;
