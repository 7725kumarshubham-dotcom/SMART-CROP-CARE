import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Smart Crop Care | Market Insights for Indian Farmers",
  description:
    "Everyday weather advice, crop health support, soil testing, and mandi insights for your farm.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#245c3a"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
