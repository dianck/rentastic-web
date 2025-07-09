import React from "react";

export default async function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4 bg-white border-b">
      <h1 className="text-xl font-bold">eventbrite</h1>
      <div className="flex items-center space-x-4 text-sm">
        <span className="cursor-pointer hover:underline">Preview Your Event</span>
        <span className="cursor-pointer hover:underline">Publish</span>
        <span className="cursor-pointer hover:underline">Dian Kusuma</span>
      </div>
    </header>
  );
}
