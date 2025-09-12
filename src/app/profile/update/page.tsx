"use client"

import Header from "@/components/layouts/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserProfile, Gender } from "@/interface/user";
import { getCurrentUser, getUserProfile, updateUserProfile } from "@/services/auth.service";
import { z } from "zod";

const ProfileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export default function UpdateProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      gender: "male",
      dob: "",
      nationality: "",
      religion: "",
      avatarUrl: "",
    },
  });

  const avatarSrc = (url?: string) => {
    const v = (url || "").trim();
    if (!v || v === "null" || v === "undefined") return "/default-user.svg";
    return v;
  };

  const toInputDate = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setUser(data);
        // Normalize nullish values and format date for input[type=date]
        form.reset({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          gender: (data.gender as "male" | "female" | "other") ?? "male",
          dob: toInputDate(data.dob),
          nationality: data.nationality ?? "",
          religion: data.religion ?? "",
          avatarUrl: data.avatarUrl ?? "",
        });
      } catch {
        const local = getCurrentUser();
        if (local) {
          setUser(local);
          form.reset({
            firstName: local.firstName ?? "",
            lastName: local.lastName ?? "",
            phone: local.phone ?? "",
            email: local.email ?? "",
            gender: (local.gender as "male" | "female" | "other") ?? "male",
            dob: toInputDate(local.dob),
            nationality: local.nationality ?? "",
            religion: local.religion ?? "",
            avatarUrl: local.avatarUrl ?? "",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
    try {
      setSaving(true);
      // Update all profile fields, not just avatar
      const updatedUser = await updateUserProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gender: values.gender as Gender,
        dob: values.dob,
        nationality: values.nationality,
        religion: values.religion,
        avatarUrl: values.avatarUrl,
      });
      setUser(updatedUser);
      setSuccessMsg("Profile updated successfully");
      setErrorMsg("");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 800);
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to update profile");
      setSuccessMsg("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Update Profile</h1>
        {successMsg && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorMsg}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-40">Loading...</div>
        ) : !user ? (
          <div className="flex justify-center items-center h-40 text-red-500">Profile not found</div>
        ) : (
          <div className="max-w-3xl mx-auto border rounded-md p-4">
            <div className="flex flex-col items-center mb-4">
              <Image
                src={avatarSrc(user.avatarUrl)}
                alt="Avatar"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.src.includes('/default-user.svg')) {
                    img.src = '/default-user.svg';
                  }
                }}
                unoptimized
              />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                  <FormField name="firstName" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="lastName" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="gender" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
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
                  )} />
                  <FormField name="dob" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} placeholder="DOB" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                  <FormField name="nationality" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Nationality</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nationality" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="religion" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Religion</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Religion" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="avatarUrl" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Avatar URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/avatar.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => history.back()}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}


