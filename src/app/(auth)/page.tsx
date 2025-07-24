"use client"

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchForm } from "@/components/SearchForm";
import HeroSection from "@/components/section/hero";
import PropertiesSection from "@/components/section/properties";



export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
          <HeroSection />
          <SearchForm />
          <PropertiesSection />
      </main>
      <Footer />
    </div>
  );
}
