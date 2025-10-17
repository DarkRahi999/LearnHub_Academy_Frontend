import type { Metadata, Viewport } from "next";

//W---------{ Meta data for SCO }----------
export const siteMetadata: Metadata = {
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
  metadataBase: new URL("https://learn-hub-academy-frontend.vercel.app"),
  alternates: {
    canonical: "https://learn-hub-academy-frontend.vercel.app",
    languages: {
      "en-US": "https://learn-hub-academy-frontend.vercel.app/en",
      "bn-BD": "https://learn-hub-academy-frontend.vercel.app/bn",
    },
  },
  openGraph: {
    title: "LearnHub Academy | Best Coaching & Learning Platform",
    description:
      "Discover LearnHub Academy – a demo coaching center website for modern learning and presentations.",
    url: "https://learn-hub-academy-frontend.vercel.app",
    siteName: "LearnHub Academy",
    images: [
      {
        url: "https://learn-hub-academy-frontend.vercel.app/og-image.jpg",
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
export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const viewport: Viewport = {
  
};