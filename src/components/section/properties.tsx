"use client"

import { useEffect, useRef } from "react";
import { PropertyCard } from "@/components/PropertyCard";

const featuredProperties = [
  { id: "1", name: "Villa Moderno", location: "Bali, Indonesia", price: 350, rating: 4.9, imageUrl: "https://placehold.co/400x300.png", imageHint: "modern villa" },
  { id: "2", name: "Cozy Downtown Loft", location: "Jakarta, Indonesia", price: 120, rating: 4.7, imageUrl: "https://placehold.co/400x300.png", imageHint: "city loft" },
  { id: "3", name: "Mountain Retreat", location: "Bandung, Indonesia", price: 200, rating: 4.8, imageUrl: "https://placehold.co/400x300.png", imageHint: "mountain cabin" },
  { id: "4", name: "Seaside Bungalow", location: "Surabaya, Indonesia", price: 250, rating: 4.6, imageUrl: "https://placehold.co/400x300.png", imageHint: "beach bungalow" },
];


const PropertiesSection = () => {
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollNext?.();
      }
    }, 5000); // 5 detik

    return () => clearInterval(interval);
  }, []);  



  return (
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

  );
};

export default PropertiesSection;
