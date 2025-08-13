"use client";

import { useState } from "react";
import WizardStep from "../WizardStep";

const amenitiesList = [
  "Clothes rack",
  "Flat-screen TV",
  "Air conditioning",
  "Linens",
  "Desk",
  "Wake-up service",
  "Towels",
  "Wardrobe or closet",
  "Heating",
  "Fan",
  "Safe",
  "Towels/Sheets (extra fee)",
  "Entire unit located on ground floor",
];

export default function RoomAmenitiesStep() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">
        What can guests use in this room?
      </h2>
      <h3 className="font-semibold mb-2">General amenities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {amenitiesList.map((amenity) => (
          <label
            key={amenity}
            className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
            />
            {amenity}
          </label>
        ))}
      </div>
    </WizardStep>
  );
}
