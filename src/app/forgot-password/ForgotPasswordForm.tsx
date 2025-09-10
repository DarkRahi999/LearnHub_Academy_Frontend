"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { useState } from "react"
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
import { forgotPassword } from "@/services/auth.service"
import toast from "react-hot-toast"

type ForgotPasswordValues = {
    email: string
}

const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

const ForgotPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [email, setEmail] = useState('');

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(ForgotPasswordSchema) as unknown as Resolver<ForgotPasswordValues>,
        defaultValues: {
            email: "",
        },
    })

    const onSubmit: SubmitHandler<ForgotPasswordValues> = async (values) => {
        try {
            setIsLoading(true);
            await forgotPassword(values.email);
            setEmail(values.email);
            setIsSuccess(true);
            toast.success("Password reset OTP sent to your email!");
        } catch (error) {
            console.error('Error requesting password reset:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset OTP';
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
                        OTP Sent Successfully!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        We&apos;ve sent a password reset OTP to <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mb-6">
                        Please check your email and click the link below to reset your password.
                    </p>
                    <div className="space-y-3">
                        <Button 
                            onClick={() => window.location.href = `/reset-password?email=${encodeURIComponent(email)}`}
                            className="w-full"
                        >
                            Reset Password
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => window.location.href = '/login'}
                            className="w-full"
                        >
                            Back to Login
                        </Button>
                    </div>
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
                            onClick={() => window.location.href = '/login'}
                        >
                            Back to Login
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ForgotPasswordForm
