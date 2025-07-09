import DestinationSection from "@/components/section/destinations";
import EventSection from "@/components/section/event";
import HeroSection from "@/components/section/hero";
import Wrapper from "@/components/wrapper";

export default async function Home() {



  return (
    <Wrapper>
      <div className="py-4 sm:py-8">
        <HeroSection />
        <EventSection />
        <DestinationSection />
        {/* <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-300 md:my-2 text-shadow">
          Halaman Home <span className="text-green-700">Dengan Login</span>
        </h2> */}
        <div>
         
        </div>
      </div>
    </Wrapper>
  );
}
