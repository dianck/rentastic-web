"use client";

import { useState } from "react";
import axios from "@/lib/axios"; // pastikan path ini sesuai dengan instance axios kamu

export default function ApiTester() {
  const [endpoint, setEndpoint] = useState("/user-profile/get");
  const [method, setMethod] = useState("POST");
  const [params, setParams] = useState('{"email": "dianck2002@gmail.com"}');
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    try {
      const parsedParams = JSON.parse(params);

      const config = {
        method: method as "GET" | "POST",
        url: endpoint,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        ...(method === "GET"
          ? { params: parsedParams }
          : { data: parsedParams }),
      };

      const res = await axios(config);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setResponse(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Check your input."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">API Tester</h1>

      <div className="w-full max-w-2xl bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="font-medium">Endpoint</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/user-profile/get"
          />
        </div>

        <div>
          <label className="font-medium">Method</label>
          <select
            className="w-full p-2 border rounded"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Params / Body (JSON)</label>
          <textarea
            className="w-full p-2 border rounded font-mono"
            rows={6}
            value={params}
            onChange={(e) => setParams(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Send Request"}
        </button>
      </div>

      <div className="w-full max-w-2xl mt-6">
        <label className="font-medium mb-2 block">Response</label>
        <pre className="bg-white p-4 rounded shadow text-sm overflow-auto whitespace-pre-wrap">
          {response || "No response yet."}
        </pre>
      </div>
    </div>
  );
}
