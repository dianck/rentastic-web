"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const finalPrice = searchParams.get("finalPrice");
  const usedPoints = searchParams.get("usedPoints");
  const registrationId = params.id;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Konfirmasi Pembelian</h1>
      <p><strong>ID Registrasi:</strong> {registrationId}</p>
      <p><strong>Total Harga:</strong> Rp {finalPrice}</p>
      <p><strong>Poin Terpakai:</strong> {usedPoints}</p>
    </div>
  );
}
