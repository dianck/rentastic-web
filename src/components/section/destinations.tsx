"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";

interface Destination {
  id: string;
  name: string;
  image: string;
}

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

// const cities = ["Washington", "New York", "Los Angeles", "Chicago", "Miami"];
const cities = ["Jakarta", "Bandung", "Yogyakarta", "Semarang", "Surabaya", "Medan", "Denpasar"];

const DestinationSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const promises = cities.map(async (city) => {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              city
            )}&per_page=1&client_id=${ACCESS_KEY}`
          );
          const data = await res.json();

          if (data.results.length > 0) {
            const item = data.results[0];
            return {
              id: item.id,
              name: city,
              image: item.urls.regular,
            };
          } else {
            return {
              id: city,
              name: city,
              image: `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},city`,
            };
          }
        });

        const results = await Promise.all(promises);
        setDestinations(results);
      } catch (error) {
        console.error("Failed to fetch destinations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Fungsi scroll
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      let newScrollLeft =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      // Jika sudah di akhir, scroll ke awal (loop)
      if (newScrollLeft >= scrollWidth - clientWidth) {
        newScrollLeft = 0;
      }

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 4000); // Ganti interval sesuai kebutuhan

    return () => clearInterval(interval);
  }, [destinations]); // Jalankan ulang saat destinations berubah

  if (loading) {
    return (
      <p className="p-4 text-center">Loading destinations...</p>
    );
  }

  return (
    <div className="relative bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold mb-6 text-purple-900">
        Top destinations in <span className="text-purple-800">Indonesia</span>
      </h2>

      <div className="relative">
        {/* Scroll buttons */}
        {/* <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          ◀
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          ▶
        </button> */}

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
          style={{
            maskImage: "linear-gradient(to right, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, black 85%, transparent)",
          }}
        >
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="flex-shrink-0 w-64 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition relative bg-white"
            >
              <div className="relative h-40">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://source.unsplash.com/800x600/?${encodeURIComponent(dest.name)},city`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
                  <h3 className="text-white text-lg font-bold drop-shadow-md">
                    {dest.name}
                  </h3>
                </div>
              </div>
              <div className="h-1 bg-orange-500 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationSection;
