"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { resetPassword } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const ResetPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get email from query parameters if available
  const emailFromQuery = searchParams.get('email') || "";
  
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    setIsSubmitting(true);
    try {
      await resetPassword(values);
      toast({
        title: "Success",
        description: "Password reset successfully!",
        variant: "default",
      });
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to reset password:", error);
      
      // Show specific error messages based on the error type
      let errorMessage = "Failed to reset password. Please try again.";
      
      if (error.message) {
        if (error.message.includes("OTP not found or already used")) {
          errorMessage = "Invalid OTP or OTP has already been used. Please request a new OTP.";
        } else if (error.message.includes("Invalid OTP")) {
          errorMessage = "Incorrect OTP. Please check your email and try again.";
        } else if (error.message.includes("OTP expired")) {
          errorMessage = "OTP has expired. Please request a new OTP.";
        } else if (error.message.includes("Too many failed attempts")) {
          errorMessage = "Too many failed attempts. Please wait and request a new OTP.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-2 xs:p-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your email, OTP code, and new password below.
        </p>
      </div>
      
      <div className="border rounded-md p-4 mb-4 bg-blue-50">
        <p className="text-center text-blue-800 text-sm">
          <strong>OTP Instructions:</strong> Check your email for the 6-digit code we sent. 
          If you don't see it, check your spam folder.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 border rounded-md p-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email address" 
                    {...field} 
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
                <FormLabel className="text-sm font-semibold">OTP Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter the 6-digit code from your email" 
                    {...field} 
                    maxLength={6}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500 mt-1">
                  Check your email for the 6-digit OTP code we sent. If you didn't receive it, you can{" "}
                  <Link href="/forgot-password" className="text-blue-600 hover:underline">
                    request a new one
                  </Link>
                </p>
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
                    placeholder="Enter your new password" 
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
                <FormLabel className="text-sm font-semibold">Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="Confirm your new password" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </Button>
          
          <div className="text-center text-sm mt-2">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Didn't receive an OTP? Request Again
            </Link>
          </div>
        </form>
      </Form>
      
      <div className="text-center mt-4">
        <Link href="/login" className="text-blue-600 hover:underline text-sm">
          Back to Login
        </Link>
      </div>
    </div>
  );
}