import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Chatbot from "@/components/layout/ChatBot";
import { Suspense } from "react";

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

function NavbarFallback() {
  return <div style={{ height: '64px' }} />; 
}

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
        {/* Wrap the component that uses the client-side hook */}
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>

        <main className="flex-1">
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  );
}