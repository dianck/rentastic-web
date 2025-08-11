'use client';

import { useState } from 'react';
import {
  FaUser, FaGift, FaCreditCard, FaList, FaPlane, FaUndoAlt,
  FaBell, FaUserFriends, FaInfoCircle, FaPowerOff, FaStar,
  FaHome
} from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const userName = session?.user?.name || 'Guest';

  return (
    <div className="relative text-sm z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-foreground text-white hover:brightness-75 rounded-md"
      >
        <BsFillPersonFill className="text-lg" />
        <span>
          {userName && userName.length > 10
            ? `${userName.slice(0, 7)}...`
            : userName}
        </span>
        {/* <span className="font-semibold">| 0 Points</span> */}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden border">
          <div className="bg-gradient-to-r from-gray-100 to-white px-4 py-3 border-b">
            <p className="font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              You’re our <strong className="ml-1">Platinum Priority</strong>
            </p>
          </div>

          <ul className="flex flex-col text-gray-800 divide-y text-sm">
            <MenuItem icon={<FaStar />} label="0 Points" />
            
            <MenuItem 
                icon={<FaUser />} 
                label="Edit Profile"
                onClick={() => router.push('/profile')} 
            />

            <MenuItem 
                icon={<FaHome />} 
                label="Register Property"
                onClick={() => router.push('/reg-property')} 
            />

            <MenuItem icon={<FaGift />} label="Reward Zone" badge="New!" />
            <MenuItem icon={<FaCreditCard />} label="My Cards" />
            <MenuItem icon={<FaList />} label="Purchase List" />
            <MenuItem icon={<FaPlane />} label="My Booking" />
            <MenuItem icon={<FaUndoAlt />} label="Refund" badge="New!" />
            {/* <MenuItem icon={<FaBell />} label="Flight Price Alerts" />
            <MenuItem icon={<FaUserFriends />} label="Saved Passenger Details" /> */}
            <MenuItem 
                icon={<FaInfoCircle />} 
                label="Promo Info"
                onClick={() => router.push('/promo')}
            />
            <MenuItem
              icon={<FaPowerOff />}
              label="Log Out"
              onClick={() => signOut({ redirectTo: "/" })}
            />
            
          </ul>
        </div>
      )}
    </div>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick?: () => void;
};

function MenuItem({ icon, label, badge, onClick }: MenuItemProps) {
  return (
    <li
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className="text-blue-500">{icon}</span>
        {label}
      </div>
      {badge && (
        <span className="bg-yellow-300 text-xs font-semibold text-gray-800 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </li>
  );
}
