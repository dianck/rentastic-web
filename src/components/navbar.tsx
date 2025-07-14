"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logout from "./logout";
import { useSession } from "next-auth/react";
import Image from "next/image";
// import Image from "next/image";

type NavItem =
  | { label: string; subItems: { label: string; href: string }[] }
  | { label: string; href: string };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { data: session } = useSession();

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu((prev) => (prev === label ? null : label));
  };

  const navItems: NavItem[] = [
    {
      label: "Cash",
      subItems: [
        { label: "Cash In", href: "/cash/in" },
        { label: "Cash Out", href: "/cash/out" },
        { label: "Zakat", href: "/cash/zakat" },
        { label: "Asset", href: "/cash/asset" },
        { label: "Cash Flow", href: "/cash/flow" },
        { label: "Hutang", href: "/cash/debt" },
        { label: "Piutang", href: "/cash/receivables" },
        { label: "Neraca", href: "/cash/balance-sheet" },
        { label: "Waris", href: "/cash/inheritance" },
      ],
    },
    {
      label: "Business",
      subItems: [
        { label: "Property", href: "/business/property" },
        { label: "Other", href: "/business/other" },
      ],
    },
    {
      label: "Gold",
      subItems: [
        { label: "Asset", href: "/gold/cashin" },
        { label: "Buy", href: "/gold/cashin" },
        { label: "Sell", href: "/gold/cashout" },
      ],
    },
    {
      label: "Dasboard",
      subItems: [
        { label: "Cash In", href: "/dashboard/cashin" },
        { label: "Cash Out", href: "/dashboard/cashout" },
      ],
    },
    {
      label: "Events",
      subItems: [
        { label: "Recurring", href: "/events/recurring" },
        { label: "Routine", href: "/events/routine" },
      ],
    },
    {
      label: "Records",
      subItems: [
        { label: "Healthy", href: "/records/recurring" },
        { label: "Charging", href: "/records/routine" },
      ],
    },
    {
      label: "Setting",
      subItems: [
        { label: "Change Password", href: "/setting/change-password" },
        { label: "Add Member", href: "/setting/add-member" },
      ],
    },

  ];

  return (
    <nav className="navbar relative z-50 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                alt="logo"
                src={`/${(process.env.NEXT_PUBLIC_LOGO || "fallback-logo.png").replace(/^\/+/, "")}`}
                width={10}
                height={10}
                className="h-8 w-8"
                priority
              />
              <span className="text-lg font-semibold ml-[1px]">
                {process.env.NEXT_PUBLIC_BRAND}
              </span>
            </Link>
          </div>



          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 relative z-50">
            {session &&
              navItems.map((item, index) => (
                <div key={index} className="relative group" data-cy={`menu-${item.label.toLowerCase()}`}>
                  {"subItems" in item ? (
                    <>
                      <div className="navbar-menu cursor-pointer text-gray-700 hover:text-indigo-600">
                        {item.label}
                      </div>
                      <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.subItems.map((sub, subIdx) => (
                          <Link
                            key={subIdx}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-indigo-600 transition"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

            {session ? (
              <Logout />
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 transition"
                data-cy="login-button"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--foreground)] focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {session &&
            navItems.map((item, index) => (
              <div key={index} data-cy={`menu-${item.label.toLowerCase()}`}>
                {"subItems" in item ? (
                  <>
                    <button
                      onClick={() => toggleSubMenu(item.label)}
                      className="navbar-menu w-full text-left font-semibold text-gray-700 flex justify-between items-center"
                    >
                      {item.label}
                      <span>{openSubMenu === item.label ? "▲" : "▼"}</span>
                    </button>
                    {openSubMenu === item.label && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.subItems.map((sub, subIdx) => (
                          <Link
                            key={subIdx}
                            href={sub.href}
                            className="block text-gray-600 hover:text-indigo-600 transition"
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-gray-700 hover:text-indigo-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

          <div className="border-t pt-2 mt-5">
            {session ? (
              <Logout />
            ) : (
              <Link
                href="/login"
                className="block text-gray-700 hover:text-indigo-600 transition"
                onClick={() => setIsOpen(false)}
                data-cy="login-button"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
