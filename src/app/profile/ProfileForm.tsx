"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/interface/user"
import { getUserProfile, getCurrentUser } from "@/services/auth.service";
import { z } from "zod";

export const ProfileFormSchema = z.object({
    firstName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
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

    const avatarSrc = (url?: string) => {
        const v = (url || "").trim();
        if (!v || v === "null" || v === "undefined") return "/default-user.svg";
        // If backend provided app-relative path, keep it; else return as is
        return v.startsWith("http") ? v : v;
    };

    const formatDateDMY = (value?: string) => {
        if (!value) return "—";
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };


 //W---------{ Load user profile data }----------
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await getUserProfile();
                setUser(userData);
            } catch (error) {
                console.error("Error loading profile:", error);
 //W---------{ Try to get user from localStorage as fallback }----------
                const localUser = getCurrentUser();
                if (localUser) {
                    setUser(localUser);
                }
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, []);


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
            {/* Read-only section (no card/border) */}
            <div className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 sm:gap-6 mb-6">
                            <Image 
                        src={avatarSrc(user.avatarUrl)}
                                alt="Profile Avatar" 
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
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-semibold">{user.firstName} {user.lastName || ""}</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                        </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Removed User ID per request */}
                    <div className="p-1">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{user.phone || "—"}</p>
                        </div>
                    <div className="p-1">
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p className="text-sm font-medium capitalize">{user.gender}</p>
                        </div>
                    <div className="p-1">
                        <p className="text-xs text-muted-foreground">Date of Birth</p>
                        <p className="text-sm font-medium">{formatDateDMY(user.dob)}</p>
                        </div>
                    <div className="p-1">
                        <p className="text-xs text-muted-foreground">Nationality</p>
                        <p className="text-sm font-medium">{user.nationality || "—"}</p>
                        </div>
                    <div className="p-1">
                        <p className="text-xs text-muted-foreground">Religion</p>
                        <p className="text-sm font-medium">{user.religion || "—"}</p>
                    </div>
                </div>

                {/* Floating button moved below */}
            </div>
            <div className="flex justify-end">
                <Button asChild className="shadow-md">
                    <a href="/profile/update">Update Profile</a>
                </Button>
            </div>
        </div>
    )
}

export default ProfileForm
