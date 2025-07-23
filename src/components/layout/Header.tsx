"use client";

import Link from "next/link";
// import { Home, BedDouble, PlusCircle } from "lucide-react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Home className="h-6 w-6" />
          <span className="font-headline">{process.env.NEXT_PUBLIC_APP_NAME || 'NestEase'}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/properties">Destinations</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/tenant/register">List your property</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          {/* <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}> */}
          <Button asChild  className="btn-foreground">          
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
