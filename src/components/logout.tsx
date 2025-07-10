"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-sm rounded-lg cursor-pointer"
      data-cy="logout-button"
    >
      Logout
    </button>

  );
}



