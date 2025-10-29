//W---------={ User Interface }=----------
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserSignup {
  id?: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  password: string;
  dob?: string;
  gender: Gender;
  role?: UserRole;
  nationality?: string;
  religion?: string;
  acceptTerms: boolean;
  avatarUrl?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  dob?: string;
  gender: Gender;
  role: UserRole;
  nationality?: string;
  religion?: string;
  avatarUrl: string;
  emailNoticeEnabled?: boolean;
  isBlocked?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserProfile;
}

export interface UpdateAvatarDto {
  avatarUrl: string;
}

// Forgot Password related interfaces
export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}