import type { Metadata } from "next";
import { Salsa, Roboto_Condensed } from "next/font/google";
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
  title: "LearnHub Academy",
  description: "This is a demo site for Coaching centers for presentations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${salsa.variable} ${roboto.variable} antialiased dark`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
