"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ProfileSidebar from "@/components/ProfileSidebar";
import PropertyDetailsForm from "../PropertyDetails";
import PropertyAddressForm from "../PropertyAddressForm";
import PropertyContactForm from "../PropertyContact";

export default function EditPropertyPage() {
  const [activeTab, setActiveTab] = useState<'details' | 'address' | 'contact'>('details');
  const { data: session } = useSession();

  const authType = session?.user?.auth_type;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <ProfileSidebar />
      </div>
      
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Property Settings</h1>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-4">
          <ul className="flex gap-4 text-sm font-semibold cursor-pointer">
            <li
              onClick={() => setActiveTab('details')}
              className={`pb-2 ${
                activeTab === 'details'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Property Details
            </li>
            <li
              onClick={() => setActiveTab('address')}
              className={`pb-2 ${
                activeTab === 'address'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Property Address
            </li>
            <li
              onClick={() => setActiveTab('contact')}
              className={`pb-2 ${
                activeTab === 'contact'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Property Contact
            </li>
          </ul>
        </div>

        {/* Content */}
        {activeTab === 'details' && <PropertyDetailsForm />}
        {activeTab === 'address' && <PropertyAddressForm />}
        {activeTab === 'contact' && <PropertyContactForm />} {/* Tab baru */}
      </main>
    </div>
  );
}
