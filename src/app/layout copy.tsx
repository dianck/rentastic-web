import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_BRAND} Event Management`,
  description: `${process.env.NEXT_PUBLIC_BRAND} Event Management`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log("Session (server):", session);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <ThemeProvider>
          <SessionProvider session={session}>
            {/* Fixed Navbar */}
            {/* <div className="fixed top-0 w-full z-50">
              <Navbar />
            </div> */}

            {/* Content shifted down by navbar height */}
            <main className="pt-16">
              {children}
            </main>
          </SessionProvider>
        </ThemeProvider>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          draggable
          theme="dark"
          closeOnClick
          transition={Bounce}
        />
      </body>
    </html>
  );
}
