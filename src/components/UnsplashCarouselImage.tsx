'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface UnsplashCarouselImageProps {
  query: string
  alt: string
}

export const UnsplashCarouselImage = ({ query, alt }: UnsplashCarouselImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        )
        const data = await res.json()
        console.log('Fetched image:', data.urls?.regular)
        if (data?.urls?.regular) {
          setImageUrl(data.urls.regular)
        }
      } catch (error) {
        console.error('Error fetching Unsplash image:', error)
      }
    }

    fetchImage()
  }, [query])

  if (!imageUrl) {
    return <div className="w-full h-full bg-gray-300 animate-pulse" />
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover brightness-50"
        sizes="100vw"
        priority
      />
    </div>
  )
}
