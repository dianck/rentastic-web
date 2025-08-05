// src/components/ProfileSidebar.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import {
  FaCreditCard, FaPlane, FaList, FaUndoAlt, FaBell,
  FaUserFriends, FaCog, FaPowerOff
} from "react-icons/fa";

export default function ProfileSidebar() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Guest';

  return (
    <aside className="w-64 bg-white border-r px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-lg font-bold">
          DC
        </div>
        <p className="font-semibold  uppercase"><span>{userName}</span></p>
        <p className="text-sm text-gray-500">Google</p>
        <div className="bg-gray-200 text-xs mt-2 px-2 py-1 rounded-md inline-block text-gray-700 font-medium">
          🎖 You're our <strong>Platinum Priority</strong>
        </div>
      </div>

      <nav className="text-sm space-y-3 text-gray-800">
        <SidebarItem icon={<FaCreditCard />} label="My Cards" />
        <SidebarItem icon={<FaPlane />} label="My Booking" />
        <SidebarItem icon={<FaList />} label="Purchase List" />
        <SidebarItem icon={<FaUndoAlt />} label="Refunds" />
        <SidebarItem icon={<FaBell />} label="Flight Price Alerts" />
        <SidebarItem icon={<FaUserFriends />} label="Saved Passenger Details" />
        <SidebarItem icon={<FaCog />} label="Notification Settings" />
        <SidebarItem icon={<FaCreditCard />} label="My Account" active />
        <SidebarItem
          icon={<FaPowerOff />}
          label="Log Out"
          onClick={() => signOut({ callbackUrl: "/" })}
        />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
        active ? "bg-foreground text-white font-semibold hover:brightness-75" : "hover:bg-gray-100"
      }`}                        

    >
      <span className="text-lg">{icon}</span>
      {label}
    </div>
  );
}
