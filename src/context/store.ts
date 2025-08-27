// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reduxSlice/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

//W---------{ RootState and AppDispatch Type }----------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
