import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Chatbot from "@/components/layout/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieFlix",
  description: "A movie discovery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-black text-white ${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
          <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  );
}
