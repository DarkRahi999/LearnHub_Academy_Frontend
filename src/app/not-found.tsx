"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
            <h1 className="text-9xl font-extrabold text-slate-700 dark:text-slate-200">404</h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </p>

            <Button variant="ghost" className="mt-8 hover:shadow-md  text-slate-700 dark:text-slate-200 hover:text-slate-800 hover:dark:text-slate-100">
                <Link href="/" className="flex items-center py-2 px-5 text-lg " >
                    <Home className="mr-2" />
                    Back to Home
                </Link>
            </Button>

        </div>
    );
}
