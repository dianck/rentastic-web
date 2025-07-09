import React from "react";

export default async function Sidebar() {
  return (
    <div className="w-full md:w-64 bg-white border-r shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Comedy #1</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fri, Jul 11, 2025, 10:00 AM
        </p>
        <button className="mt-3 px-3 py-1 border rounded">Draft</button>
        <div className="mt-2 text-blue-600 text-sm cursor-pointer underline">
          Preview
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="font-medium text-sm text-blue-700">Build event page</div>
          <div className="text-sm text-gray-700">Online event page</div>
          <div className="text-sm text-gray-700">Add tickets</div>
          <div className="text-sm text-gray-700">Publish</div>
        </div>
      </div>
    </div>
  );
}
