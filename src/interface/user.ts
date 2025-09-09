//W---------{ User Interface }----------
export interface UserSignup {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  dob?: Date;
  gender: string;
}
