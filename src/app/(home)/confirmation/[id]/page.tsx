"use client";

import ConfirmationClient from "@/components/ConfirmationClient";
import { useParams } from "next/navigation";

export default function ConfirmationPage() {
  const params = useParams();

  const idParam = params?.id;
  const registrationId =
    typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] : "";

  if (!registrationId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading atau ID registrasi tidak valid...</p>
      </div>
    );
  }

  return <ConfirmationClient registrationId={registrationId} />;
}
