"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import EditPropertyPage from "@/components/form/property";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // redirect kalau belum login
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="flex-grow flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {session?.user?.email ? (
        <>
          <Header />
          <main className="flex-grow">
            <div className="container mx-auto items-center justify-between px-4 md:px-6">
              <EditPropertyPage />
            </div>
          </main>
          <Footer />
        </>
      ) : null}
    </div>
  );
}
