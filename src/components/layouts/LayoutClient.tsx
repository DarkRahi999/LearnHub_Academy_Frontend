"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import Providers from "@/provider/storeProvider";
import { ThemeProvider } from "@/provider/themeProvider";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Providers>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
            <Header />
            <main>{children}</main>
            <Toaster />
            {!isAdminRoute && <Footer />}
          </div>
        </AuthProvider>
      </Providers>
    </ThemeProvider>
  );
}
