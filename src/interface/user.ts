//W---------{ User Interface }----------
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface UserSignup {
  id?: number;
  firstName: string;
  lastName?: string;
  email: string;
  userName: string;
  phone?: string;
  password: string;
  dob?: string;
  gender: Gender;
  nationality?: string;
  religion?: string;
  acceptTerms: boolean;
  avatarUrl?: string;
}

export interface UserLogin {
  email?: string;
  userName?: string;
  password: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  userName: string;
  phone?: string;
  dob?: string;
  gender: Gender;
  nationality?: string;
  religion?: string;
  avatarUrl: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserProfile;
}

export interface UpdateAvatarDto {
  avatarUrl: string;
}
