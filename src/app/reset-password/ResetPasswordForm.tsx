"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { resetPassword } from "@/services/auth.service"
import toast from "react-hot-toast"

type ResetPasswordValues = {
    email: string
    otp: string
    newPassword: string
    confirmPassword: string
}

const ResetPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otp: z.string().length(6, { message: "OTP must be 6 digits" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ResetPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(ResetPasswordSchema) as unknown as Resolver<ResetPasswordValues>,
        defaultValues: {
            email: emailFromUrl,
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
        if (emailFromUrl) {
            form.setValue('email', emailFromUrl);
        }
    }, [emailFromUrl, form]);

    const onSubmit: SubmitHandler<ResetPasswordValues> = async (values) => {
        try {
            setIsLoading(true);
            await resetPassword(values.email, values.otp, values.newPassword, values.confirmPassword);
            setIsSuccess(true);
            toast.success("Password updated successfully! You can now login with your new password.");
        } catch (error) {
            console.error('Error resetting password:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="p-2 xs:p-4">
                <div className="text-center border rounded-md p-6">
                    <div className="mb-4">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        Password Reset Successful!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Your password has been updated successfully. You can now login with your new password.
                    </p>
                    <Button 
                        onClick={() => window.location.href = '/login'}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-2 xs:p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 border rounded-md p-3 xs:p-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="email" 
                                        placeholder="user@example.com" 
                                        {...field}
                                        disabled={!!emailFromUrl}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">6-Digit OTP</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="123456" 
                                        maxLength={6}
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">New Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="password" 
                                        placeholder="Enter new password" 
                                        {...field} 
                                    />
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
                                <FormLabel className="text-sm font-semibold">Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="password" 
                                        placeholder="Confirm new password" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex justify-between items-center pt-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => window.location.href = '/forgot-password'}
                        >
                            Back
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ResetPasswordForm
