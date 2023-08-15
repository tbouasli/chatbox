import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { auth } from '@/lib/firebase';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';

const FormSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    password: z.string().min(8, {
        message: 'Please enter a password with at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
        message: 'Please enter a password with at least 8 characters.',
    }),
});

function SignUpForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            if (values.password !== values.confirmPassword) {
                toast({
                    title: 'Error',
                    description: 'Passwords do not match.',
                });

                return;
            }

            await createUserWithEmailAndPassword(auth, values.email, values.password);
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Error',
                    description: error?.message,
                });
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant="secondary" className="w-full">
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}

export default SignUpForm;
