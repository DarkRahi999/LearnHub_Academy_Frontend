"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSignup } from "@/interface/user";
import { createUser } from "@/services/signup.service";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export const SignupFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .optional(),
  phone: z.string().regex(/^01[0-9]{9}$/, { message: "Invalid phone number" }),
  email: z
    .string({ message: "Invalid email address" })
    .regex(/@gmail\.com$/, { message: "Email must be a gmail address" }),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().optional(),
  avatarUrl: z.string().optional(),
  acceptTerms: z
    .boolean()
    .refine((v) => v === true, {
      message: "You must accept terms and conditions",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

const SignupForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      gender: "male",
      dob: "",
      avatarUrl: "",
      acceptTerms: false,
      password: "",
    },
  });

  //W---------{ 2. Define a submit handler. }----------
  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    try {
      //W---------{ DOB convert করা optional }----------
      const payload = {
        ...values,
      };

      const newUser = await createUser(payload as Omit<UserSignup, "id">); //W---------{ axios POST call }----------

      //W---------{ Store token and user data in localStorage }----------
      localStorage.setItem("access_token", newUser.access_token);
      localStorage.setItem("user_data", JSON.stringify(newUser.user));

      toast({
        title: "Success",
        description:
          "Account created successfully! Welcome to LearnHub Academy!",
        variant: "default",
      });

      //W---------{ Redirect to home page }----------
      window.location.href = "/";
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  const goNext = async () => {
    const fields =
      step === 1
        ? (["firstName", "lastName", "phone"] as const)
        : step === 2
          ? (["email", "password", "acceptTerms"] as const)
          : (["gender", "dob", "avatarUrl"] as const);
    const ok = await form.trigger(fields, { shouldFocus: true });
    if (ok) setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  };

  const goBack = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));

  return (
    <div className="">
      <Form {...form}>
        <form action="" onSubmit={form.handleSubmit(onSubmit)} method="post">
          <div className="grid gap-2 border-2 rounded-md p-3 xs:p-4">
            <div className="flex items-center justify-center gap-2 text-sm mb-2">
              <span
                className={
                  step >= 1 ? "font-semibold" : "text-muted-foreground"
                }
              >
                1. Basic
              </span>
              <span>›</span>
              <span
                className={
                  step >= 2 ? "font-semibold" : "text-muted-foreground"
                }
              >
                2. Account
              </span>
              <span>›</span>
              <span
                className={
                  step >= 3 ? "font-semibold" : "text-muted-foreground"
                }
              >
                3. Optional
              </span>
            </div>
            {step === 1 && (
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        First Name:
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Your First name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Last Name:
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Your Last name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                <div className="xs:col-span-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Phone Number:
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Phone Number..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                <div className="xs:col-span-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Email:
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Email Address..."
                            {...field}
                          />
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
                      <FormLabel className="text-sm font-semibold">
                        Password:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Your Password..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Accept Terms:
                      </FormLabel>
                      <FormControl>
                        <div className="h-10 flex items-center">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          <span className="ml-2 text-sm">
                            I agree to the terms and conditions
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Gender:
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Date of Birth:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="xs:col-span-2">
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Avatar URL:
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Avatar URL..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                variant="outline"
              >
                Back
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={goNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Sign Up</Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
