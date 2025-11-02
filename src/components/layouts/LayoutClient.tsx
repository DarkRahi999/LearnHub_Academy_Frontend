"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layouts/Header";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import Providers from "@/provider/storeProvider";
import { ThemeProvider } from "@/provider/themeProvider";
import DraggableWhatsAppButton from "@/components/layouts/DraggableWhatsAppButton";
import Footer from "./Footer";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Providers>
        <AuthProvider>
          {/*One More dark Option: dark:bg-radial dark:from-slate-950 dark:via-blue-950 dark:to-gray-900 */}
          <div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:bg-radial dark:from-blue-950 dark:via-slate-900 dark:to-gray-950">
            <Header />
            <main>{children}</main>
            <Toaster />
            {!isAdminRoute && !isAuthRoute && <Footer />}
            {!isAdminRoute && !isAuthRoute && <DraggableWhatsAppButton />}
          </div>
        </AuthProvider>
      </Providers>
    </ThemeProvider>
  );
}
