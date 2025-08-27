import { User } from "@/interface/user";
import { USER_URLS } from "@/config/configURL";
import axios from "axios";

//W--------------{ GET all users }---------------
export const getUsers = async (): Promise<User[]> => {
    try {
        const res = await axios.get<User[]>(USER_URLS.getAll);
        return res.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

//W--------------{ GET user by ID }---------------
export const getUserById = async (id: number): Promise<User> => {
    try {
        const res = await axios.get<User>(USER_URLS.byId(id));
        return res.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
};

//W--------------{ CREATE user }---------------
export const createUser = async (user: Omit<User, "id">): Promise<User> => {
    try {
        const res = await axios.post<User>(USER_URLS.create, user);
        return res.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

//W--------------{ UPDATE user }---------------
export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
    try {
        const res = await axios.put<User>(USER_URLS.update(id), user);
        return res.data;
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
    }
};

//W--------------{ DELETE user }---------------
export const deleteUser = async (id: number): Promise<void> => {
    try {
        await axios.delete(USER_URLS.delete(id));
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }
};
