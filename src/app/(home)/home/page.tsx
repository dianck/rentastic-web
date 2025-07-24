import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import DestinationSection from "@/components/section/destinations";
import EventSection from "@/components/section/event";
import HeroSection from "@/components/section/hero";
import Wrapper from "@/components/wrapper";
import { SearchForm } from "@/components/SearchForm";
import PropertiesSection from "@/components/section/properties";

export default async function Home() {



  return (
    // <Wrapper>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <HeroSection />
          <SearchForm />
          <PropertiesSection />
          {/* <EventSection /> */}
          {/* <DestinationSection /> */}
          {/* <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-300 md:my-2 text-shadow">
            Halaman Home <span className="text-green-700">Dengan Login</span>
          </h2> */}
          <div>
          
          </div>
        </main>
        <Footer />
      </div>
    // </Wrapper>
  );
}
