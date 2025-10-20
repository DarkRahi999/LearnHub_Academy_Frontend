"use client";
import { useState, useRef } from "react";
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
import { UserSignup, Gender } from "@/interface/user";
import { createUser } from "@/services/signup.service";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

// Separate schemas for each step
const BasicInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .optional(),
  phone: z.string().regex(/^01[0-9]{9}$/, { message: "Invalid phone number" }),
});

const OptionalInfoSchema = z.object({
  gender: z.enum(["male", "female", "other"]).optional(),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  avatarUrl: z.string().optional(),
});

const AccountInfoSchema = z.object({
  email: z
    .string({ message: "Invalid email address" })
    .regex(/@gmail\.com$/, { message: "Email must be a gmail address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  acceptTerms: z
    .boolean()
    .refine((v) => v === true, {
      message: "You must accept terms and conditions",
    }),
});

// Define the complete form type
type CompleteFormValues = z.infer<typeof BasicInfoSchema> & 
  z.infer<typeof OptionalInfoSchema> & 
  z.infer<typeof AccountInfoSchema>;

const SignupForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Partial<CompleteFormValues>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { uploadImage, uploading: cloudinaryUploading, error: uploadError } = useCloudinaryUpload();
  
  // Create separate form instances for each step
  const basicForm = useForm<z.infer<typeof BasicInfoSchema>>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const optionalForm = useForm<z.infer<typeof OptionalInfoSchema>>({
    resolver: zodResolver(OptionalInfoSchema),
    defaultValues: {
      gender: "male",
      dob: "",
      avatarUrl: "",
    },
  });

  const accountForm = useForm<z.infer<typeof AccountInfoSchema>>({
    resolver: zodResolver(AccountInfoSchema),
    defaultValues: {
      email: "",
      acceptTerms: false,
      password: "",
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file);
      optionalForm.setValue('avatarUrl', result.secure_url);
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  //W---------{ 2. Define a submit handler. }----------
  async function onSubmit(values: z.infer<typeof AccountInfoSchema>) {
    try {
      // Combine all form data
      const completeData: CompleteFormValues = { ...formData, ...values } as CompleteFormValues;
      
      // Map string gender to Gender enum
      let gender: Gender = Gender.Male;
      if (completeData.gender === "male") {
        gender = Gender.Male;
      } else if (completeData.gender === "female") {
        gender = Gender.Female;
      } else if (completeData.gender === "other") {
        gender = Gender.Other;
      }
      
      //W---------{ DOB convert করা optional }----------
      const payload: Omit<UserSignup, "id"> = {
        firstName: completeData.firstName,
        lastName: completeData.lastName || "",
        phone: completeData.phone,
        email: completeData.email,
        password: completeData.password,
        gender: gender,
        acceptTerms: completeData.acceptTerms,
        ...(completeData.dob && { dob: completeData.dob }),
        ...(completeData.avatarUrl && { avatarUrl: completeData.avatarUrl }),
      };

      const newUser = await createUser(payload); //W---------{ axios POST call }----------

      //W---------{ Store token and user data in localStorage }----------
      localStorage.setItem("access_token", newUser.access_token);
      localStorage.setItem("user_data", JSON.stringify(newUser.user));

      toast({
        title: "Success",
        description:
          "Account created successfully! Welcome to LearnHub Academy! You can update your profile information in the profile section.",
        variant: "default",
      });

      // Remove the second toast notification
      // Show profile update notification
      // toast({
      //   title: "Profile Update",
      //   description: "You can update your profile information in the profile section.",
      //   variant: "default",
      // });

      //W---------{ Redirect to home page }----------
      window.location.href = "/";
    } catch (error: unknown) {
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
    let isValid = false;
    
    // Validate only the fields for the current step using the appropriate form instance
    if (step === 1) {
      isValid = await basicForm.trigger();
    } else if (step === 2) {
      isValid = await optionalForm.trigger();
    }
    
    if (isValid) {
      // Save current step data
      if (step === 1) {
        const data = basicForm.getValues();
        setFormData(prev => ({ ...prev, ...data }));
      } else if (step === 2) {
        const data = optionalForm.getValues();
        setFormData(prev => ({ ...prev, ...data }));
      }
      setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
    }
  };

  const goBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  return (
    <div className="">
      {/* Render the appropriate form based on the current step */}
      {step === 1 && (
        <Form {...basicForm}>
          <form action="" onSubmit={(e) => e.preventDefault()} method="post">
            <div className="grid gap-2 border-2 dark:border-gray-600 rounded-md p-3 xs:p-4">
              <div className="flex items-center justify-center gap-2 text-sm mb-2">
                <span className="font-semibold">1. Basic</span>
                <span>›</span>
                <span className="text-muted-foreground">2. Optional</span>
                <span>›</span>
                <span className="text-muted-foreground">3. Account</span>
              </div>
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                <FormField
                  control={basicForm.control}
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
                  control={basicForm.control}
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
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                <div className="xs:col-span-2">
                  <FormField
                    control={basicForm.control}
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
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1}
                  variant="outline"
                >
                  Back
                </Button>
                <Button type="button" onClick={goNext}>
                  Next
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
      
      {step === 2 && (
        <Form {...optionalForm}>
          <form action="" onSubmit={(e) => e.preventDefault()} method="post">
            <div className="grid gap-2 border-2 dark:border-gray-600 rounded-md p-3 xs:p-4">
              <div className="flex items-center justify-center gap-2 text-sm mb-2">
                <span className="font-semibold">1. Basic</span>
                <span>›</span>
                <span className="font-semibold">2. Optional</span>
                <span>›</span>
                <span className="text-muted-foreground">3. Account</span>
              </div>
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                <FormField
                  control={optionalForm.control}
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
                  control={optionalForm.control}
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
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Avatar:
                    </FormLabel>
                    <div className="flex items-center gap-4">
                      <Input
                        value={optionalForm.watch('avatarUrl') || ''}
                        placeholder="Avatar will be uploaded automatically"
                        readOnly
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || cloudinaryUploading}
                      >
                        {uploading || cloudinaryUploading ? 'Uploading...' : 'Upload Avatar'}
                      </Button>
                    </div>
                    {uploadError && (
                      <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  onClick={goBack}
                  variant="outline"
                >
                  Back
                </Button>
                <Button type="button" onClick={goNext}>
                  Next
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
      
      {step === 3 && (
        <Form {...accountForm}>
          <form action="" onSubmit={accountForm.handleSubmit(onSubmit)} method="post">
            <div className="grid gap-2 border-2 dark:border-gray-600 rounded-md p-3 xs:p-4">
              <div className="flex items-center justify-center gap-2 text-sm mb-2">
                <span className="font-semibold">1. Basic</span>
                <span>›</span>
                <span className="font-semibold">2. Optional</span>
                <span>›</span>
                <span className="font-semibold">3. Account</span>
              </div>
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                <div className="xs:col-span-2">
                  <FormField
                    control={accountForm.control}
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
                  control={accountForm.control}
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
              <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                <FormField
                  control={accountForm.control}
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
                            checked={field.value || false}
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
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  onClick={goBack}
                  variant="outline"
                >
                  Back
                </Button>
                <Button type="submit">Sign Up</Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default SignupForm;