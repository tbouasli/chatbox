import { zodResolver } from '@hookform/resolvers/zod';
import { getToken } from 'firebase/messaging';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { auth, messaging, storage } from '@/lib/firebase';

import ImagePicker from '@/shared/components/molecule/ImagePicker';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';

import useUser from '@/app/hooks/useUser';

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
    const { onBoardUser } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user] = useAuthState(auth);
    const [image, setImage] = React.useState<File | undefined>();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    React.useEffect(() => {
        Notification.requestPermission();
    }, []);

    React.useEffect(() => {
        if (user?.displayName && form.getValues('displayName') === undefined) {
            form.setValue('displayName', user.displayName);
        }
    }, [user, form]);

    const onSubmit = React.useCallback(
        async (values: z.infer<typeof FormSchema>) => {
            try {
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

                let fcmToken;

                try {
                    const token = await getToken(messaging, {
                        vapidKey: 'BJvafJPTL1fBaCyiIbi8W2n8FIh5Tr28iZaiEBZGCutGwB2JExrLg8dmVRY-N5hqmROvI2jKC7BDk2LCEr1a668',
                    });

                    fcmToken = token;
                } catch (e) {
                    console.log(e);
                }

                await onBoardUser({
                    displayName: values.displayName,
                    nickname: values.nickname,
                    photoURL: downloadURL,
                    fcmToken,
                });

                navigate('/app');
            } catch (e) {
                console.log(e);
            }
        },
        [image, navigate, onBoardUser, toast, user],
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="center">
                    <ImagePicker setImage={setImage} defaultImage={user?.photoURL ?? '/assets/image/placeholder.png'} />
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
                <Button className="rounded-full absolute bottom-4 right-4 p-3 h-fit" type="submit">
                    <img className="text-primary-foreground" src="/assets/icon/front.svg" alt="Back" height={24} width={24} />
                </Button>
            </form>
        </Form>
    );
}

export default OnBoardingForm;
