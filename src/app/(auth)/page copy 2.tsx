import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchForm } from "@/components/SearchForm";
import { PropertyCard } from "@/components/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { UnsplashCarouselImage } from "@/components/UnsplashCarouselImage";
// import { Card, CardContent } from "@/components/ui/card";

const featuredProperties = [
  { id: "1", name: "Villa Moderno", location: "Bali, Indonesia", price: 350, rating: 4.9, imageUrl: "https://placehold.co/400x300.png", imageHint: "modern villa" },
  { id: "2", name: "Cozy Downtown Loft", location: "Jakarta, Indonesia", price: 120, rating: 4.7, imageUrl: "https://placehold.co/400x300.png", imageHint: "city loft" },
  { id: "3", name: "Mountain Retreat", location: "Bandung, Indonesia", price: 200, rating: 4.8, imageUrl: "https://placehold.co/400x300.png", imageHint: "mountain cabin" },
  { id: "4", name: "Seaside Bungalow", location: "Surabaya, Indonesia", price: 250, rating: 4.6, imageUrl: "https://placehold.co/400x300.png", imageHint: "beach bungalow" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white">
          <div className="absolute inset-0">
            <Carousel className="w-full h-full" opts={{ loop: true }}>
                <CarouselContent className="h-full">
                  <CarouselItem className="h-full">
                    <div className="relative w-full h-172">
                      <UnsplashCarouselImage query="luxury bedroom" alt="Hero background" />
                    </div>
                  </CarouselItem>
                  <CarouselItem className="h-full">
                    <div className="relative w-full h-172">
                      <UnsplashCarouselImage query="scenic view" alt="Hero background" />
                    </div>
                  </CarouselItem>
                </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 carousel-arrow" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 carousel-arrow" />

            </Carousel>
            {/* Tambahkan overlay transparan dengan warna foreground */}
            {/* <div className="absolute inset-0 bg-foreground/40" /> */}
          </div>

          <div className="relative z-10 text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Find Your Perfect Stay</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">Compare prices and book from our curated list of unique properties.</p>
          </div>
        </section>


        <SearchForm />

        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-3xl font-headline font-bold">Featured Properties</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Handpicked properties that we think you will love. Book your dream vacation today.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} {...prop} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
