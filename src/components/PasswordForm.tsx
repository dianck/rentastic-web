"use client";

import axios from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordSecurityForm() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.patch(
        "/user-profile/update-password",
        {
          email,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );

      setMessage(res.data.message || "Password updated successfully");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border">
      <div className="border-b px-6 py-4 font-semibold text-gray-700">
        Password & Security
      </div>
      <div className="p-6 space-y-4">

        {/* OLD PASSWORD */}
        <div>
          <label htmlFor="oldPassword" className="block text-sm text-gray-600 mb-1">
            Old Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle old password visibility"
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label htmlFor="newPassword" className="block text-sm text-gray-600 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle new password visibility"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="text-sm mt-2 text-center text-gray-600">
            {message}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 text-sm rounded-md text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            Maybe later
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md cursor-pointer bg-foreground text-white hover:brightness-75 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
