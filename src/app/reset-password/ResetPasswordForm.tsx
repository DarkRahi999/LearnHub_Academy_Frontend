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
import { useRouter } from "next/navigation";

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
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
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
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-2 xs:p-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your email, OTP, and new password below.
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
                <FormLabel className="text-sm font-semibold">OTP</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter the 6-digit OTP" 
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
          
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}