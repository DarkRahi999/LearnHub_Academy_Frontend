"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/auth/auth";

const users = [
    { username: "editor123", password: "12345", role: "editor" },
    { username: "viewer123", password: "12345", role: "viewer" },
];

export default function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        const foundUser = users.find(
            (u) => u.username === username && u.password === password
        );

        if (foundUser) {
            login({ ...foundUser, role: foundUser.role as UserRole });
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border px-3 py-2 rounded w-64"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-3 py-2 rounded w-64"
            />

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={handleLogin}
                className="px-4 py-2 bg-black text-white rounded w-64"
            >
                Login
            </button>
        </div>
    );
}
