import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/interface/user";

//W---------{ State Type define }----------
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
}

interface UserState {
  users: User[];
  auth: AuthState;
}

//W---------{ Initial State }----------
const initialState: UserState = {
  users: [
    { id: 1, name: "Rahi", email: "rahi@example.com" },
    { id: 2, name: "Sara", email: "sara@example.com" },
    { id: 3, name: "John", email: "john@example.com" },
  ],
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // User management actions
    showUsers: (state) => state,
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const { id, name, email } = action.payload;
      const existingUser = state.users.find((u) => u.id === id);
      if (existingUser) {
        existingUser.name = name;
        existingUser.email = email;
      }
    },
    
    // Authentication actions
    loginSuccess: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      state.auth.isAuthenticated = true;
      state.auth.user = action.payload.user;
      state.auth.token = action.payload.token;
      state.auth.isLoading = false;
    },
    logout: (state) => {
      state.auth.isAuthenticated = false;
      state.auth.user = null;
      state.auth.token = null;
      state.auth.isLoading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.auth.isLoading = action.payload;
    },
    initializeAuth: (state, action: PayloadAction<{ user: UserProfile | null; token: string | null }>) => {
      state.auth.user = action.payload.user;
      state.auth.token = action.payload.token;
      state.auth.isAuthenticated = !!action.payload.user && !!action.payload.token;
      state.auth.isLoading = false;
    },
  },
});

//W---------{ Export actions & reducer }----------
export const { 
  showUsers, 
  addUser, 
  deleteUser, 
  updateUser,
  loginSuccess,
  logout,
  setAuthLoading,
  initializeAuth
} = userSlice.actions;
export default userSlice.reducer;
