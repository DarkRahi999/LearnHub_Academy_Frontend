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

export enum Permission {
  // User permissions
  VIEW_PROFILE = 'view_profile',
  UPDATE_PROFILE = 'update_profile',
  VIEW_NOTICES = 'view_notices',
  VIEW_POSTS = 'view_posts',
  
  // Admin permissions
  CREATE_NOTICE = 'create_notice',
  UPDATE_NOTICE = 'update_notice',
  DELETE_NOTICE = 'delete_notice',
  MANAGE_USERS = 'manage_users',
  CREATE_COURSE = 'create_course',
  UPDATE_COURSE = 'update_course',
  DELETE_COURSE = 'delete_course',
  
  // Super Admin permissions
  CREATE_POST = 'create_post',
  UPDATE_POST = 'update_post',
  DELETE_POST = 'delete_post',
  MANAGE_ADMINS = 'manage_admins',
  MANAGE_PERMISSIONS = 'manage_permissions',
  SYSTEM_SETTINGS = 'system_settings',
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