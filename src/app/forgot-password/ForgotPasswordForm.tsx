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
import { forgotPassword, resetPassword, verifyOtp } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// Schema for email form
const EmailFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Schema for OTP form
const OtpFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 characters"),
});

// Schema for password reset form
const PasswordResetFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  
  // Forms for each step
  const emailForm = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const otpForm = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });
  
  const passwordForm = useForm<z.infer<typeof PasswordResetFormSchema>>({
    resolver: zodResolver(PasswordResetFormSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form values when state changes
  useEffect(() => {
    if (submittedEmail) {
      console.log("Setting email in forms to:", submittedEmail);
      otpForm.setValue("email", submittedEmail);
      passwordForm.setValue("email", submittedEmail);
    }
  }, [submittedEmail, otpForm, passwordForm]);

  useEffect(() => {
    if (verifiedOtp) {
      passwordForm.setValue("otp", verifiedOtp);
    }
  }, [verifiedOtp, passwordForm]);

  // Handle email submission
  async function onEmailSubmit(values: z.infer<typeof EmailFormSchema>) {
    try {
      await forgotPassword(values.email);
      setSubmittedEmail(values.email);
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "We've sent a 6-digit code to your email. Please check your inbox.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Handle OTP verification
  async function onOtpSubmit(values: z.infer<typeof OtpFormSchema>) {
    try {
      // Log the values being sent for debugging
      console.log("Verifying OTP with:", values);
      
      // Also log the form values directly
      const formData = otpForm.getValues();
      console.log("Form data:", formData);
      
      const result = await verifyOtp({
        email: values.email,
        otp: values.otp
      });
      
      console.log("OTP verification result:", result);
      
      // If we get here, OTP is valid
      setVerifiedOtp(values.otp);
      setStep("password");
      toast({
        title: "OTP Verified",
        description: "OTP verified successfully. Please enter your new password.",
        variant: "default",
      });
    } catch (error) {
      console.error("OTP verification failed:", error);
      // Type guard to check if error is an object with message property
      const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  // Handle password reset
  async function onPasswordSubmit(values: z.infer<typeof PasswordResetFormSchema>) {
    try {
      await resetPassword(values);
      toast({
        title: "Success",
        description: "Password reset successfully!",
        variant: "default",
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Failed to reset password:", error);
      // Type guard to check if error is an object with message property
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password. Please try again.";
      
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
        <h2 className="text-xl font-bold">Forgot Password</h2>
        {step === "email" && (
          <p className="text-sm text-gray-600 mt-2">
            Enter your email address and we&apos;ll send you a 6-digit OTP code.
          </p>
        )}
        {step === "otp" && (
          <p className="text-sm text-gray-600 mt-2">
            We&apos;ve sent a code to <strong>{submittedEmail}</strong>. Enter it below.
          </p>
        )}
        {step === "password" && (
          <p className="text-sm text-gray-600 mt-2">
            Enter your new password below.
          </p>
        )}
      </div>
      
      {/* Email Step */}
      {step === "email" && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="grid gap-4 border rounded-md p-4">
            <FormField
              control={emailForm.control}
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
            
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        </Form>
      )}
      
      {/* OTP Step */}
      {step === "otp" && (
        <div className="border rounded-md p-4">
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-center text-blue-800 text-sm">
              Check your email for the 6-digit code. If you don&apos;t see it, check your spam folder.
            </p>
          </div>
          
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="grid gap-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">OTP Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter 6-digit code" 
                        {...field} 
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <input type="hidden" {...otpForm.register("email")} value={submittedEmail} />
              
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
              
              <button 
                type="button"
                onClick={() => setStep("email")}
                className="text-blue-600 hover:underline text-sm text-center"
              >
                Send OTP to a different email
              </button>
            </form>
          </Form>
        </div>
      )}
      
      {/* Password Reset Step */}
      {step === "password" && (
        <div className="border rounded-md p-4">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="grid gap-4">
              <FormField
                control={passwordForm.control}
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
                control={passwordForm.control}
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
              
              <input type="hidden" {...passwordForm.register("email")} value={submittedEmail} />
              <input type="hidden" {...passwordForm.register("otp")} value={verifiedOtp} />
              
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </Form>
        </div>
      )}
      
      <div className="text-center mt-4">
        <a href="/login" className="text-blue-600 hover:underline text-sm">
          Back to Login
        </a>
      </div>
    </div>
  );
}