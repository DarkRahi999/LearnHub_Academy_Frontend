import { ReactNode } from "react";
import LayoutClient from "@/components/layouts/LayoutClient";
import { Salsa, Roboto_Condensed } from "next/font/google";
import { siteMetadata, siteViewport } from "@/config/metadata";
import "../style/globals.css";

//W---------={ Fonts for website }=----------
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

export const metadata = siteMetadata;
export const viewport = siteViewport;

//W---------={ Root Layout }=----------
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${salsa.variable} ${roboto.variable} antialiased transition-colors duration-700 ease-in-out`}>
        <LayoutClient>
          <div className="container mx-auto p-5">
            {children}
          </div>
        </LayoutClient>
      </body>
    </html>
  );
}
