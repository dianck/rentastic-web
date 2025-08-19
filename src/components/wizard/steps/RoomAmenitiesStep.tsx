"use client";

import { useState, useEffect } from "react";
import WizardStep from "../WizardStep";
import axios from "@/lib/axios";

interface RoomFacility {
  id: string;
  name: string;
}

export default function RoomAmenitiesStep() {
  const [amenities, setAmenities] = useState<RoomFacility[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Fetch amenities dari API
  const fetchAmenities = async () => {
    try {
      const res = await axios.get("/property/room-facilities", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      setAmenities(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load amenities", err);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">
        What can guests use in this room?
      </h2>
      <h3 className="font-semibold mb-2">General amenities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {amenities.map((amenity) => (
          <label
            key={amenity.id}
            className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity.id)}
              onChange={() => toggleAmenity(amenity.id)}
            />
            {amenity.name}
          </label>
        ))}
      </div>
    </WizardStep>
  );
}
