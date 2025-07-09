"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { QRCodeCanvas } from "qrcode.react";

interface ConfirmationData {
  eventTitle: string;
  ticketType: string;
  totalPrice: number;
  createdAt: string;
}

export default function ConfirmationPage() {
  const params = useParams();
  const registrationId = params.id ;
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [error, setError] = useState("");


  useEffect(() => {
    console.log("Registration ID:", registrationId);

    const fetchConfirmation = async () => {
      try {
        const res = await axios.get(`/confirmation/${registrationId}`);
        console.log("API Response:", res.data);
        setData(res.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("API Error:", err.message);
        } else {
          console.error("API Error:", err);
        }
        setError("Gagal mengambil data konfirmasi.");
      }
    };

    if (registrationId) fetchConfirmation();
  }, [registrationId]);


  const handlePrint = () => {
    window.print();
  };

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!data)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-6 md:p-8 print:max-w-full print:shadow-none">
        <h1 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-4">
          🎉 Konfirmasi Pembelian Tiket
        </h1>

        <div className="space-y-2 text-sm md:text-base text-gray-700">
          <p><span className="font-semibold">Nama Event:</span> {data.eventTitle}</p>
          {/* <p><span className="font-semibold">Lokasi:</span> {data.eventLocation}</p> */}
          <p>
            <span className="font-semibold">Tanggal:</span>{" "}
            {new Date(data.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p><span className="font-semibold">Jenis Tiket:</span> {data.ticketType}</p>
          {/* <p><span className="font-semibold">Jumlah Tiket:</span> {data.quantity}</p> */}
          <p>
            <span className="font-semibold">Total Harga:</span> Rp{" "}
            {data.totalPrice.toLocaleString("id-ID")}
          </p>
          <p>
            <span className="font-semibold">Kode Registrasi:</span>{" "}
            <span className="text-blue-600 font-mono">{registrationId}</span>
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <QRCodeCanvas
            value={JSON.stringify({
              registrationId,
              eventTitle: data.eventTitle,
              totalPrice: data.totalPrice,
            })}
            className="bg-white p-2 rounded"
            size={128}
          />
        </div>

        <div className="text-center mt-4 text-sm text-gray-500">
          Simpan halaman ini sebagai bukti pembelian Anda.
        </div>

        <div className="mt-6 flex justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            🖨️ Cetak Bukti
          </button>
        </div>
      </div>
    </div>
  );
}
