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
import axios from "axios"
import { API_URLS } from "@/config/configURL"

type LoginValues = {
    email?: string
    userName?: string
    password: string
}

const LoginSchema = z.object({
    email: z.preprocess((val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string().email({ message: "Invalid email" })
    ).optional(),
    userName: z.preprocess((val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string().min(3, { message: "Username must be 3+ chars" })
    ).optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => {
    const hasEmail = !!data.email;
    const hasUser = !!data.userName;
    return (hasEmail || hasUser) && !(hasEmail && hasUser);
}, {
    message: "Provide exactly one of email or username",
    path: ["email"],
});

const LoginForm = () => {
    const form = useForm<LoginValues>({
        resolver: zodResolver(LoginSchema) as unknown as Resolver<LoginValues>,
        defaultValues: {
            email: "",
            userName: "",
            password: "",
        },
    })

    const onSubmit: SubmitHandler<LoginValues> = async (values) => {
        try {
 //W---------{ Remove empty identifier to satisfy backend XOR }----------
            const payload: { password: string; email?: string; userName?: string } = { password: values.password };
            if (values.email && !values.userName) payload.email = values.email;
            if (values.userName && !values.email) payload.userName = values.userName;
            
            const res = await axios.post<{ access_token: string; user: unknown }>(API_URLS.auth.login, payload);
            
 //W---------{ Store token and user data in localStorage }----------
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem('user_data', JSON.stringify(res.data.user));
            
            console.log("Logged in:", res.data);
            
 //W---------{ Redirect to home page }----------
            window.location.href = '/';
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            console.error(error?.response?.data || error?.message || err);
            alert(error?.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div className="p-2 xs:p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 border rounded-md p-3 xs:p-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Email (or Username)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Username (or Email)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your_username" {...field} />
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
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="reset" onClick={() => form.reset()}>Reset</Button>
                        <Button type="submit">Login</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm


