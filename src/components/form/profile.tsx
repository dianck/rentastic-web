"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileForm from "@/components/ProfileForm";
import PasswordSecurityForm from "../PasswordForm";

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState<'account' | 'security'>('account');
  const { data: session } = useSession();

  const authType = session?.user?.auth_type;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <ProfileSidebar />
      </div>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-4">
          <ul className="flex gap-4 text-sm font-semibold cursor-pointer">
            <li
              onClick={() => setActiveTab('account')}
              className={`pb-2 ${
                activeTab === 'account'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Account Information
            </li>
            {authType === "CREDENTIAL" && (
              <li
                onClick={() => setActiveTab('security')}
                className={`pb-2 ${
                  activeTab === 'security'
                    ? 'text-foreground border-b-2 border-foreground'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Password & Security
              </li>
            )}
          </ul>
        </div>

        {/* Content */}
        {activeTab === 'account' && <ProfileForm />}
        {activeTab === 'security' && authType === "CREDENTIAL" && <PasswordSecurityForm />}
      </main>
    </div>
  );
}
