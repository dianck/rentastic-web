"use client";

import Link from "next/link";
// import { Home, BedDouble, PlusCircle } from "lucide-react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Logout from "../logout";
// import UserDropdown from "../UserDropdown";
import UserDropdown from "@/components/UserDropdown";

export function Header() {
  const { data: session } = useSession();
  return (
    // <header className="bg-card shadow-sm sticky top-0 z-40">
    <header className="bg-card relative z-100 overflow-visible">

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Home className="h-6 w-6" />
          <span className="font-headline">{process.env.NEXT_PUBLIC_APP_NAME || 'NestEase'}</span>
        </Link>
        {/* <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/properties">Destinations</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/tenant/register">List your property</Link>
          </Button>
        </nav> */}

        <div className="flex items-center gap-2">
          {session?.user?.email ? (
            <>
              {/* <span>{session.user.name}</span> */}
              {/* <Logout /> */}
              <UserDropdown />
            </>
          ) : (
            <Link
              href="/login"
              // className="text-gray-700 hover:text-indigo-600 transition"
              // className="py-1 px-2 w-full text-sm rounded-md cursor-pointer text-white bg-[#9f25f08c] hover:bg-[#9f25f0] disabled:opacity-50"
              className="flex items-center py-1 px-2 w-full text-sm rounded-md cursor-pointer bg-foreground text-white hover:brightness-75"

              data-cy="login-button"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
