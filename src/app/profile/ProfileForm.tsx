"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import Image from "next/image"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/interface/user"
import { getUserProfile, updateUserAvatar, getCurrentUser } from "@/services/auth.service";
import { z } from "zod"

export const ProfileFormSchema = z.object({
    firstName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    userName: z.string().min(3, { message: "Username must be at least 3 characters" }),
    phone: z.string().regex(/^01[0-9]{9}$/, { message: "Invalid phone number" }).optional(),
    email: z.string().email({ message: "Invalid email address" }),
    gender: z.enum(["male", "female", "other"]),
    dob: z.string().optional(),
    nationality: z.string().optional(),
    religion: z.string().optional(),
    avatarUrl: z.string().optional(),
});

const ProfileForm = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const form = useForm<z.infer<typeof ProfileFormSchema>>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            phone: "",
            email: "",
            gender: "male",
            dob: "",
            nationality: "",
            religion: "",
            avatarUrl: "",
        },
    })

 //W---------{ Load user profile data }----------
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await getUserProfile();
                setUser(userData);
                
 //W---------{ Populate form with user data }----------
                form.reset({
                    firstName: userData.firstName,
                    lastName: userData.lastName || "",
                    userName: userData.userName,
                    phone: userData.phone || "",
                    email: userData.email,
                    gender: userData.gender,
                    dob: userData.dob || "",
                    nationality: userData.nationality || "",
                    religion: userData.religion || "",
                    avatarUrl: userData.avatarUrl,
                });
            } catch (error) {
                console.error("Error loading profile:", error);
 //W---------{ Try to get user from localStorage as fallback }----------
                const localUser = getCurrentUser();
                if (localUser) {
                    setUser(localUser);
                    form.reset({
                        firstName: localUser.firstName,
                        lastName: localUser.lastName || "",
                        userName: localUser.userName,
                        phone: localUser.phone || "",
                        email: localUser.email,
                        gender: localUser.gender,
                        dob: localUser.dob || "",
                        nationality: localUser.nationality || "",
                        religion: localUser.religion || "",
                        avatarUrl: localUser.avatarUrl,
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [form]);

 //W---------{ Handle avatar update }----------
    const handleAvatarUpdate = async (values: z.infer<typeof ProfileFormSchema>) => {
        try {
            setUpdating(true);
            const updatedUser = await updateUserAvatar({ avatarUrl: values.avatarUrl ?? "" });
            setUser(updatedUser);
            alert("Avatar updated successfully!");
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("Failed to update avatar");
        } finally {
            setUpdating(false);
        }
    };

 //W---------{ Handle form submission }----------
    const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
        try {
            setUpdating(true);
 //W---------{ For now, only update avatar as that's the only endpoint available }----------
 //W---------{ In the future, you can add more update endpoints }----------
            await handleAvatarUpdate(values);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-500">Failed to load profile data</div>
            </div>
        );
    }

    return (
        <div className="p-2 xs:p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-2 border-2 rounded-md p-3 xs:p-4">
                        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                        
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-6">
                            <Image 
                                src={user.avatarUrl || 'https://via.placeholder.com/150'}
                                alt="Profile Avatar" 
                                width={96}
                                height={96}
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                            />
                            <p className="text-sm text-gray-600 mt-2">Current Avatar</p>
                        </div>

                        <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">First Name:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Your First name..." {...field} />
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
                                        <FormLabel className="text-sm font-semibold">Last Name:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Your Last name..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Username:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Choose a username..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Email:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Your Email Address..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Phone Number:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Your Phone Number..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Gender:</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Your Gender" />
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
                                        <FormLabel className="text-sm font-semibold">Date of Birth:</FormLabel>
                                        <FormControl>
                                            <Input type="date" placeholder="Select your DOB" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="nationality"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Nationality:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Your Nationality..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="religion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Religion:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Your Religion..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="avatarUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Avatar URL (Optional):</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/avatar.jpg (optional)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2 py-4">
                            <Button type="reset" onClick={() => form.reset()} disabled={updating}>
                                Reset
                            </Button>
                            <Button type="submit" disabled={updating}>
                                {updating ? "Updating..." : "Update Profile"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ProfileForm
