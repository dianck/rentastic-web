"use client";

import axios from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserProfile {
  username: string;
  gender: string;
  birthdate: string;
  residence: string;
  email: string;
  mobile_number: string;
}

export default function ProfileForm() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "/user-profile/get",
        { email },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );
      setUserData(res.data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const [year, month, day] = userData.birthdate.split("-");
      const payload = {
        ...userData,
        bdate: day,
        bmonth: month,
        byear: year,
      };

      await axios.patch("/user-profile/update", payload, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });

      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (email) fetchProfile();
  }, [email]);

  return (
    <div className="bg-white rounded-md shadow-sm border">
      <div className="border-b px-6 py-4 font-semibold text-gray-700">
        Personal Data
      </div>

      <div className="p-6 space-y-4">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {userData && (
          <>
            <div>
              <label className="block text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md text-sm uppercase"
              />
              <p className="text-xs text-gray-400 mt-1">
                Your full name will also appear as your profile name
              </p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm text-gray-600">Gender</label>
                    <select
                    value={userData.gender}
                    onChange={(e) =>
                        setUserData({ ...userData, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                    <option value="">Select</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    </select>
                </div>

                <div className="flex-1">
                <label className="block text-sm text-gray-600">Birthdate</label>
                <input
                    type="date"
                    value={userData?.birthdate ? userData.birthdate.split("T")[0] : ""}
                    onChange={(e) =>
                    setUserData((prev) =>
                        prev ? { ...prev, birthdate: e.target.value } : prev
                    )
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                />
                </div>

            </div>

            <div>
              <label className="block text-sm text-gray-600">City of Residence</label>
              <input
                type="text"
                value={userData.residence}
                onChange={(e) =>
                  setUserData({ ...userData, residence: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-3 py-2 border rounded-md text-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Mobile Number</label>
              <input
                type="text"
                value={userData.mobile_number}
                onChange={(e) =>
                  setUserData({ ...userData, mobile_number: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm rounded-md text-gray-500 hover:text-gray-700"
                onClick={fetchProfile}
              >
                Reset
              </button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-md cursor-pointer bg-foreground text-white hover:brightness-75 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
