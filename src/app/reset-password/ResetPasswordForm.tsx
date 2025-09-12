"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPassword } from "@/services/auth.service";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ResetPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().min(6, { message: "OTP must be 6 digits" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
      email: email,
        },
  });

    useEffect(() => {
    if (email) {
      setValue("email", email);
        }
  }, [email, setValue]);

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        try {
            setIsLoading(true);
      await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
            setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to reset password. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
  };

    if (isSuccess) {
        return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
            <CardTitle className="text-xl">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              You can now log in with your new password.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">
                        Go to Login
              </Link>
                    </Button>
          </CardContent>
        </Card>
                </div>
    );
    }

    return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email, OTP code, and new password to reset your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
                                    <Input 
                id="email"
                                        type="email" 
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                OTP Code
              </label>
                                    <Input 
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                {...register("otp")}
                className={errors.otp ? "border-red-500" : ""}
              />
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
                                    <Input 
                id="newPassword"
                                        type="password" 
                                        placeholder="Enter new password" 
                {...register("newPassword")}
                className={errors.newPassword ? "border-red-500" : ""}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
                                    <Input 
                id="confirmPassword"
                                        type="password" 
                                        placeholder="Confirm new password" 
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>

            <div className="text-center">
              <Button asChild variant="ghost" className="text-sm">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
                        </Button>
                    </div>
                </form>
        </CardContent>
      </Card>
        </div>
  );
}