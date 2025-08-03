"use client";

import { useState } from "react";
import axios from "@/lib/axios"; // pastikan path ini benar, atau gunakan axios langsung jika tidak pakai custom instance

export default function HomePage() {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/test-prisma",{
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      }); 

     
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setResponse(err?.response?.data?.message || "API error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">API Test Page 123</h1>

      <button
        onClick={testApi}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-4"
        disabled={loading}
      >
        {loading ? "Testing..." : "Test API"}
      </button>

      <pre className="w-full max-w-xl bg-white p-4 rounded shadow overflow-auto">
        {response || "Klik tombol untuk mengetes API."}
      </pre>
    </div>
  );
}
