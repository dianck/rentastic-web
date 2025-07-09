"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const categories = [
  { name: "Music", icon: "🎤" },
  { name: "Education", icon: "🌐" },
  { name: "Performing & Visual Arts", icon: "🎭" },
  { name: "Technology Expo", icon: "📅" },
  { name: "Commedy", icon: "💘" },
  { name: "Hobbies", icon: "🎮" },
  { name: "Business", icon: "🗂️" },
  { name: "Food & Baverage", icon: "🍽️" },
];

const keywords = ["music", "Technology", "Business", "Education", "art", "Food", "Travel"];

const HeroSection = () => {
  const [slide, setSlide] = useState(0);
  const [slides, setSlides] = useState<
    { title: string; subtitle: string; cta: string; image: string }[]
  >([]);

  const fetchImages = async () => {
    try {
      const fetchedSlides = await Promise.all(
        keywords.map(async (keyword) => {
          const res = await fetch(
            `https://api.unsplash.com/photos/random?query=${keyword}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
          );
          const data = await res.json();
          
            // Tambahkan log agar lebih jelas
            console.log(`Keyword: ${keyword}`);
            console.log("Fetched data:", data);
                      
          return {
            title: keyword.toUpperCase(),
            subtitle: "DISCOVER NOW",
            cta: `Explore ${keyword}`,  // 👈 Fix added here
            image: data.urls?.regular || "",
            width: data.width || 1200,
            height: data.height || 600,            
          };
        })
      );

      setSlides(fetchedSlides);
    } catch (err) {
      console.error("Failed to fetch Unsplash images", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);


  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      {slides.length > 0 ? (
        <div className="relative overflow-hidden rounded-xl">
          {/* <Image
            src={slides[slide].image}
            alt="Hero"
            fill
            sizes="(max-width: 768px) 100vw, 100vw" 
            className="w-full h-[400px] object-cover transition-all duration-500"
          /> */}
          <div className="relative overflow-hidden rounded-xl w-full aspect-[10/3]">
            <Image
              src={slides[slide].image}
              alt="Hero"
              fill
              sizes="100vw"
              className="object-cover transition-all duration-500"
            />
          </div>          
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6 md:p-12 text-white">
            <p className="text-sm font-semibold mb-2">{slides[slide].subtitle}</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-purple-300 text-black px-1">{slides[slide].title}</span>
            </h2>
            {/* <button className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium shadow">
              {slides[slide].cta}
            </button> */}
          </div>

            {/* <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 focus:outline-none"
            >
            <ChevronLeft size={24} className="text-black" />
            </button>
            <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 focus:outline-none"
            >
            <ChevronRight size={24} className="text-black" />
            </button> */}

        </div>
      ) : (
        <p className="text-center text-gray-500">Loading slides...</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 mt-8">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex flex-col items-center justify-center space-y-2"
          >
            {/* Lingkaran berisi ikon */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full border border-blue-100 hover:bg-blue-50 transition">
              <span className="text-3xl">{cat.icon}</span>
            </div>
            {/* Nama kategori */}
            <p className="text-sm text-center font-medium">{cat.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HeroSection;
