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
import { forgotPassword } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ForgotPasswordFormSchema>) {
    try {
      await forgotPassword(values.email);
      toast({
        title: "Success",
        description: "Password reset link sent to your email.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to send reset link:", error);
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-2 xs:p-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your email address and we&apos;ll send you a link to reset your password.
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
          
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </Form>
    </div>
  );
}