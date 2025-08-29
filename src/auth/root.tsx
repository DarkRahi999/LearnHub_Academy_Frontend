"use client";
import { useAuth } from "@/auth/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
    children,
    roles,
}: {
    children: React.ReactNode;
    roles?: string[];
}) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        } else if (roles && !roles.includes(user.role)) {
            router.replace("/");
        }
    }, [user, router, roles]);

    if (!user || (roles && !roles.includes(user.role))) return null;

    return <>{children}</>;
}
