"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { UserProfile, Gender } from "@/interface/user";
import { getCurrentUser, getUserProfile, updateUserProfile } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { User, Mail, Phone, Calendar, Globe, Heart } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

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
  emailNoticeEnabled: z.boolean().optional(),
});

export default function UpdateProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { uploading: cloudinaryUploading, error: uploadError } = useCloudinaryUpload();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof ProfileFormSchema>>({
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
      emailNoticeEnabled: true,
    },
  });

  const watchedGender = watch('gender');

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
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setUser(data);
        reset({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          gender: (data.gender as "male" | "female" | "other") ?? "male",
          dob: toInputDate(data.dob),
          nationality: data.nationality ?? "",
          religion: data.religion ?? "",
          avatarUrl: data.avatarUrl ?? "",
          emailNoticeEnabled: data.emailNoticeEnabled ?? true,
        });
      } catch {
        const local = getCurrentUser();
        if (local) {
          setUser(local);
          reset({
            firstName: local.firstName ?? "",
            lastName: local.lastName ?? "",
            phone: local.phone ?? "",
            email: local.email ?? "",
            gender: (local.gender as "male" | "female" | "other") ?? "male",
            dob: toInputDate(local.dob),
            nationality: local.nationality ?? "",
            religion: local.religion ?? "",
            avatarUrl: local.avatarUrl ?? "",
            emailNoticeEnabled: local.emailNoticeEnabled ?? true,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadUserProfile();
  }, [reset]);

  const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
    try {
      setSaving(true);
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
        emailNoticeEnabled: values.emailNoticeEnabled,
      });
      setUser(updatedUser);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setTimeout(() => {
        window.location.href = "/profile";
      }, 800);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/profile";
  };

  if (loading) {
    return (
      <div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-lg text-red-500">Failed to load profile data</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            Update Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Update your personal information and preferences
          </p>
        </div>
      </div>

      <Card className="">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image
              src={avatarSrc(user.avatarUrl)}
              alt="Profile Avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('/default-user.svg')) {
                  img.src = '/default-user.svg';
                }
              }}
              unoptimized
            />
            <div>
              <CardTitle className="text-xl">
                {user.firstName} {user.lastName || ""}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName', { 
                      required: 'First name is required',
                      minLength: { value: 2, message: 'First name must be at least 2 characters' }
                    })}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select 
                    value={watchedGender} 
                    onValueChange={(value) => setValue('gender', value as "male" | "female" | "other")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    {...register('dob')}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nationality */}
                <div className="space-y-2">
                  <Label htmlFor="nationality" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Nationality
                  </Label>
                  <Input
                    id="nationality"
                    {...register('nationality')}
                    placeholder="Enter nationality"
                  />
                </div>

                {/* Religion */}
                <div className="space-y-2">
                  <Label htmlFor="religion" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    Religion
                  </Label>
                  <Input
                    id="religion"
                    {...register('religion')}
                    placeholder="Enter religion"
                  />
                </div>

                {/* Email Notice Preference */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="emailNoticeEnabled"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...register('emailNoticeEnabled')}
                    />
                    <Label htmlFor="emailNoticeEnabled" className="font-medium">
                      Receive Email Notifications for Notices
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enable this to receive email notifications when new notices are posted.
                  </p>
                </div>

                {/* Avatar Upload */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Avatar Upload</Label>
                  <ImageUpload
                    value={watch('avatarUrl') || ''}
                    onChange={(url) => setValue('avatarUrl', url)}
                    placeholder="Click to upload avatar"
                    disabled={saving || cloudinaryUploading}
                  />
                  {uploadError && (
                    <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Upload a new profile image. Leave empty to use default avatar.
                  </p>
                </div>
              </div>
            </div>

            {/* User Info Section - Read Only */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <Label className="text-gray-600">User ID</Label>
                  <p className="font-mono">{user.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Account Status</Label>
                  <p className={`font-medium ${
                    (user as UserProfile & { isBlocked?: boolean }).isBlocked 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {(user as UserProfile & { isBlocked?: boolean }).isBlocked ? 'Blocked' : 'Active'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Last Login</Label>
                  <p>{(user as UserProfile & { lastLoginAt?: string }).lastLoginAt 
                    ? new Date((user as UserProfile & { lastLoginAt: string }).lastLoginAt).toLocaleString() 
                    : 'Never'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Member Since</Label>
                  <p>{(user as UserProfile & { createdAt?: string }).createdAt 
                    ? new Date((user as UserProfile & { createdAt: string }).createdAt).toLocaleDateString() 
                    : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}