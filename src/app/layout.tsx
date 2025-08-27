import type { Metadata } from "next";
import { Salsa, Roboto_Condensed } from "next/font/google";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "./globals.css";

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
  authors: [{ name: "learnhub-academy" }],
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${salsa.variable} ${roboto.variable} antialiased dark`}>
        <Provider store={store}>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
