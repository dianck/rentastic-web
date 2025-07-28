"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import FormLoginForm from "./login";

export default function FormLoginWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Jangan kondisikan hook
  React.useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/home");
    } else if (status === "authenticated" && !session?.user) {
      router.replace("/login");
    }
  }, [status, session, router]);

  // Tampilkan loading selama pengecekan session
  if (status === "loading") {
    return <p className="p-4 text-center">Checking session...</p>;
  }

  // Sembunyikan form saat redirect agar hook tetap stabil
  if (status === "authenticated") {
    return <p className="p-4 text-center">Redirecting...</p>;
  }

  return <FormLoginForm />;
}
