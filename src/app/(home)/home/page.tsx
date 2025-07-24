import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/section/hero";
import { SearchForm } from "@/components/SearchForm";
import PropertiesSection from "@/components/section/properties";

export default async function Home() {

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
