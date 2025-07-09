"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const finalPrice = searchParams.get("finalPrice");
  const usedPoints = searchParams.get("usedPoints");
  const registrationId = params.id;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-6 md:p-8 print:shadow-none print:rounded-none">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          🎉 Konfirmasi Pembelian Tiket
        </h1>

        <div className="space-y-4 text-gray-800 text-base">
          <p>
            <span className="font-semibold">🆔 ID Registrasi:</span>{" "}
            <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">
              {registrationId}
            </span>
          </p>
          <p>
            <span className="font-semibold">💰 Total Harga:</span> Rp{" "}
            {finalPrice ? Number(finalPrice).toLocaleString("id-ID") : "0"}
          </p>
          <p>
            <span className="font-semibold">🎯 Poin Terpakai:</span>{" "}
            {usedPoints ?? "0"}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="p-4 bg-white border rounded shadow-sm">
            <QRCodeCanvas
              value={registrationId}
              size={160}
              className="bg-white"
            />
          </div>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          Tunjukkan QR ini saat check-in event.
        </p>

        <div className="mt-6 flex justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium shadow"
          >
            🖨️ Cetak Bukti
          </button>
        </div>
      </div>
    </div>
  );
}
