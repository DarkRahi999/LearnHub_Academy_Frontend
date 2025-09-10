import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//W---------{ State Type define }----------
interface User {
  id: number;
  name: string;
  email: string;
}
interface UserState {
  users: User[];
}

//W---------{ Initial State }----------
const initialState: UserState = {
  users: [
    { id: 1, name: "Rahi", email: "rahi@example.com" },
    { id: 2, name: "Sara", email: "sara@example.com" },
    { id: 3, name: "John", email: "john@example.com" },
  ],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
  },
});

//W---------{ Export actions & reducer }----------
export const { showUsers, addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
