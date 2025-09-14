import type { Metadata, Viewport } from "next";
import { Salsa, Roboto_Condensed } from "next/font/google";
import { ReactNode } from "react";
import Providers from "../provider/storeProvider";
import { ThemeProvider } from "@/provider/themeProvider";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";
import "../style/globals.css";

//W---------{ Fonts for website }----------
const salsa = Salsa({
  variable: "--font-salsa",
  subsets: ["latin"],
  weight: "400",
});
const roboto = Roboto_Condensed({
  variable: "--font-Roboto_Condensed",
  subsets: ["latin"],
  weight: "500",
});

//W---------{ Meta data for SCO }----------
export const metadata: Metadata = {
  title: "LearnHub Academy | Best Coaching & Learning Platform",
  description:
    "LearnHub Academy is a modern coaching center demo site. Discover courses, resources, and presentations designed to make learning easier and more engaging.",
  keywords: [
    "LearnHub Academy",
    "coaching center",
    "learning platform",
    "online courses",
    "education resources",
    "student presentations",
  ],
  authors: [{ name: "learnHub-academy" }],
  applicationName: "LearnHub Academy",
  category: "education",
  metadataBase: new URL("https://yourdomain.com"),
  alternates: {
    canonical: "https://yourdomain.com",
    languages: {
      "en-US": "https://yourdomain.com/en",
      "bn-BD": "https://yourdomain.com/bn",
    },
  },
  openGraph: {
    title: "LearnHub Academy | Best Coaching & Learning Platform",
    description:
      "Discover LearnHub Academy – a demo coaching center website for modern learning and presentations.",
    url: "https://yourdomain.com",
    siteName: "LearnHub Academy",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LearnHub Academy Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

//W---------{ viewport & themeColor }----------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

//W---------{ Root Layout }----------
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${salsa.variable} ${roboto.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              <main>{children}</main>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    style: {
                      background: '#10b981',
                      color: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                    },
                  },
                }}
              />
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
