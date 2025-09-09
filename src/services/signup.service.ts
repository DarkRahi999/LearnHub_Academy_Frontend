import { API_URLS } from "@/config/configURL";
import { UserSignup } from "@/interface/user";
import axios from "axios";

// ---------------- { CREATE user / Signup } ----------------
export const createUser = async (user: Omit<UserSignup, "id">):
  Promise<UserSignup> => {
  try {
    const res = await axios.post<UserSignup>(
      API_URLS.signup.create,
      user
    );
    return res.data;
  } catch (error: any) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error;
  }
};

// ---------------- { GET user by ID } ----------------
export const getUserById = async (id: number):
  Promise<UserSignup> => {
  try {
    const res = await axios.get<UserSignup>(
      API_URLS.signup.byId(id)
    );
    return res.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

// ---------------- { UPDATE user } ----------------
export const updateUser = async (id: number, user: Partial<UserSignup>):
  Promise<UserSignup> => {
  try {
    const res = await axios.put<UserSignup>(
      API_URLS.signup.update(id),
      user
    );
    return res.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

// ---------------- { DELETE user } ----------------
export const deleteUser = async (id: number):
  Promise<void> => {
  try {
    await axios.delete(
      API_URLS.signup.delete(id)
    );
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};
