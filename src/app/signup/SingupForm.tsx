"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { UserSignup } from "@/interface/user"
import { createUser } from "@/services/signup.service";
import { z } from "zod"

export const SignupFormSchema = z.object({
    firstName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    userName: z.string().min(3, { message: "Username must be at least 3 characters" }),
    phone: z.string().regex(/^01[0-9]{9}$/, { message: "Invalid phone number" }).optional(),
    email: z.string().email({ message: "Invalid email address" }).regex(/@gmail\.com$/, { message: "Email must be a gmail address" }),
    gender: z.enum(["male", "female", "other"]),
    dob: z.string().optional(),
    avatarUrl: z.string().min(1, { message: "Avatar URL is required" }),
    acceptTerms: z.boolean().refine(v => v === true, { message: "You must accept terms and conditions" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

interface IProps {
    props: UserSignup
}

const page = ({ }: IProps) => {
    const form = useForm<z.infer<typeof SignupFormSchema>>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            phone: "",
            email: "",
            gender: "male",
            dob: "",
            avatarUrl: "",
            acceptTerms: false,
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
        try {
            // DOB convert করা optional
            const payload = {
                ...values,
            };

            const newUser = await createUser(payload as any); // axios POST call
            
            // Store token and user data in localStorage
            localStorage.setItem('access_token', (newUser as any).access_token);
            localStorage.setItem('user_data', JSON.stringify((newUser as any).user));
            
            console.log("User created:", newUser);
            
            // Redirect to home page
            window.location.href = '/';

        } catch (error) {
            console.error("Signup failed:", error);
        }
    }

    return (
        <div className="p-2 xs:p-4">
            <Form {...form}>
                <form action="" onSubmit={form.handleSubmit(onSubmit)} method="post">
                    <div className="grid gap-2 border-2 rounded-md p-3 xs:p-4">
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
                        </div>
                        <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                            <div className="xs:col-span-2">
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
                            </div>
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
                        </div>
                        <div className="grid gap-2 grid-cols-1 xs:grid-cols-3">
                            <div className="xs:col-span-2">
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Password:</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter Your Password..." {...field} />
                                        </FormControl>
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
                        <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="avatarUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Avatar URL:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/avatar.jpg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="acceptTerms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Accept Terms:</FormLabel>
                                        <FormControl>
                                            <div className="h-10 flex items-center">
                                                <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                                                <span className="ml-2 text-sm">I agree to the terms and conditions</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-2 py-4">
                            <Button type="reset" onClick={() => form.reset()} >Reset</Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default page
