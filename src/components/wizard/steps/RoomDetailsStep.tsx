"use client";

import { useState } from "react";
import WizardStep from "../WizardStep";

const bedTypes = [
  { id: "twin", label: "Twin bed(s)", size: "35–51 inches wide" },
  { id: "full", label: "Full bed(s)", size: "52–59 inches wide" },
  { id: "queen", label: "Queen bed(s)", size: "60–70 inches wide" },
  { id: "king", label: "King bed(s)", size: "71–81 inches wide" },
];

export default function RoomDetailsStep() {
  const [unitType, setUnitType] = useState("Double");
  const [roomCount, setRoomCount] = useState(1);
  const [beds, setBeds] = useState<{ [key: string]: number }>({
    twin: 0,
    full: 1,
    queen: 0,
    king: 0,
  });

  const handleBedChange = (id: string, delta: number) => {
    setBeds((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">Room details</h2>

      {/* Unit Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          What type of unit is this?
        </label>
        <select
          value={unitType}
          onChange={(e) => setUnitType(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="Double">Double</option>
          <option value="Single">Single</option>
          <option value="Suite">Suite</option>
        </select>
      </div>

      {/* Room Count */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          How many rooms of this type do you have?
        </label>
        <input
          type="number"
          min={1}
          value={roomCount}
          onChange={(e) => setRoomCount(Number(e.target.value))}
          className="border rounded p-2 w-20"
        />
      </div>

      {/* Bed Options */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">
          What beds are available in this room?
        </label>
        <div className="space-y-2">
          {bedTypes.map((bed) => (
            <div
              key={bed.id}
              className="flex items-center justify-between border rounded p-2"
            >
              <div>
                <div className="font-medium">{bed.label}</div>
                <div className="text-sm text-gray-500">{bed.size}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBedChange(bed.id, -1)}
                  className="px-3 py-1 border rounded bg-gray-100"
                >
                  -
                </button>
                <span>{beds[bed.id] || 0}</span>
                <button
                  onClick={() => handleBedChange(bed.id, 1)}
                  className="px-3 py-1 border rounded bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WizardStep>
  );
}
