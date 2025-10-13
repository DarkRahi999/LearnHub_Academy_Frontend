"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/context/reduxSlice/userSlice";
import { loginUser } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

type LoginValues = {
    email: string
    password: string
}

const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const LoginForm = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const form = useForm<LoginValues>({
        resolver: zodResolver(LoginSchema) as unknown as Resolver<LoginValues>,
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit: SubmitHandler<LoginValues> = async (values) => {
        try {
            const payload: { password: string; email: string } = { password: values.password, email: values.email };
            
            const res = await loginUser(payload);
            
            // Dispatch login success to Redux store
            dispatch(loginSuccess({ user: res.user, token: res.access_token }));
            
            
            toast({
                title: "Success",
                description: "Login successful! Welcome back!",
                variant: "default",
            });
            
            // Redirect to home page
            window.location.href = '/';
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            console.error(error?.response?.data || error?.message || err);
            const errorMessage = error?.response?.data?.message || 'Login failed. Please check your credentials.';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    return (
        <div className="p-2 xs:p-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold">Login</h2>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 border rounded-md p-3 xs:p-4">
                    <div className="grid grid-cols-1 gap-3">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between items-center pt-2">
                        <a 
                            href="/forgot-password" 
                            className="text-sm text-primary hover:text-primary/80 underline"
                        >
                            Forgot Password?
                        </a>
                        <div className="flex gap-2">
                            <Button type="reset" onClick={() => form.reset()}>Reset</Button>
                            <Button type="submit">Login</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm