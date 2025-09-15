'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Gender, UserRole, UserProfile } from '@/interface/user';
import { updateUser } from '@/services/user.service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface EditUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user: UserProfile | null;
}

export default function EditUserForm({ open, onOpenChange, onSuccess, user }: EditUserFormProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<Partial<UserProfile>>();

  const watchedGender = watch('gender');

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob ? user.dob.split('T')[0] : undefined, // Convert ISO date to date input format
        nationality: user.nationality,
        religion: user.religion,
        avatarUrl: user.avatarUrl
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      await updateUser(user.id, data);
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob ? user.dob.split('T')[0] : undefined,
        nationality: user.nationality,
        religion: user.religion,
        avatarUrl: user.avatarUrl
      });
    }
    onOpenChange(false);
  };

  // Check if current user can edit this user
  const canEditUser = (): boolean => {
    if (!currentUser || !user) return false;
    if (currentUser.role === UserRole.SUPER_ADMIN) return true;
    if (currentUser.role === UserRole.ADMIN) return user.role === UserRole.USER;
    return false;
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User - {user.firstName} {user.lastName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                disabled={!canEditUser()}
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
                disabled={!canEditUser()}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
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
                disabled={!canEditUser()}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                {...register('phone', { 
                  required: 'Phone is required',
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: 'Invalid phone number'
                  }
                })}
                placeholder="Enter phone number"
                disabled={!canEditUser()}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select 
                value={watchedGender} 
                onValueChange={(value) => setValue('gender', value as Gender)}
                disabled={!canEditUser()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.Male}>Male</SelectItem>
                  <SelectItem value={Gender.Female}>Female</SelectItem>
                  <SelectItem value={Gender.Other}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role - Read Only */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={user.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 
                       user.role === UserRole.ADMIN ? 'Admin' : 'User'}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                Use the role management actions in the table to change user roles
              </p>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                {...register('dob')}
                disabled={!canEditUser()}
              />
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                {...register('nationality')}
                placeholder="Enter nationality"
                disabled={!canEditUser()}
              />
            </div>

            {/* Religion */}
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                {...register('religion')}
                placeholder="Enter religion"
                disabled={!canEditUser()}
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                {...register('avatarUrl')}
                placeholder="Enter avatar URL (optional)"
                disabled={!canEditUser()}
              />
            </div>
          </div>

          {/* User Info Section - Read Only */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">User Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">User ID</Label>
                <p className="font-mono">{user.id}</p>
              </div>
              <div>
                <Label className="text-gray-600">Account Status</Label>
                <p className={`font-medium ${(user as UserProfile & { isBlocked?: boolean }).isBlocked ? 'text-red-600' : 'text-green-600'}`}>
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
                <Label className="text-gray-600">Created At</Label>
                <p>{(user as UserProfile & { createdAt?: string }).createdAt 
                  ? new Date((user as UserProfile & { createdAt: string }).createdAt).toLocaleDateString() 
                  : 'N/A'}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            {canEditUser() && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}