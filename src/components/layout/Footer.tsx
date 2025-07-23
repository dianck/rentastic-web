import Link from "next/link";
import { Home, Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
              <Home className="h-6 w-6" />
              <span className="font-headline">NestEase</span>
            </Link>
            <p className="text-sm text-muted-foreground">Find your perfect stay with ease.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="font-semibold">Explore</h4>
              <ul className="space-y-1">
                <li><Link href="/properties" className="text-sm hover:underline">Destinations</Link></li>
                <li><Link href="#" className="text-sm hover:underline">About Us</Link></li>
                <li><Link href="#" className="text-sm hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">For Tenants</h4>
              <ul className="space-y-1">
                <li><Link href="/tenant/register" className="text-sm hover:underline">List Property</Link></li>
                <li><Link href="/tenant/login" className="text-sm hover:underline">Tenant Login</Link></li>
                <li><Link href="/tenant/reviews" className="text-sm hover:underline">Review Tools</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end items-start">
             <div className="flex gap-4">
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary" /></Link>
              <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-primary" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NestEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
