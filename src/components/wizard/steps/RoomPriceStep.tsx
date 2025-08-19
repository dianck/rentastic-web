"use client";

import { useState } from "react";
import WizardStep from "../WizardStep";

export default function RoomPriceStep() {
  const [price, setPrice] = useState(100000);

  const commissionRate = 0.15;
  const earnings = price - price * commissionRate;

  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">
        Set the price per night for this room
      </h2>


      {/* Price Input */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          How much do you want to charge per night?
        </label>
        <div className="flex items-center border rounded p-2 max-w-xs">
          <span className="mr-2">IDR</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full outline-none"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Including taxes, commission, and fees
        </p>
      </div>

      {/* Commission Info */}
      <div className="mb-4 border rounded p-4 bg-gray-50">
        <p className="font-semibold">15.00% {process.env.NEXT_PUBLIC_APP_NAME} commission</p>
        <ul className="list-disc list-inside text-sm mt-2 text-gray-700">
          <li>24/7 help in your language</li>
          <li>Save time with automatically confirmed bookings</li>
          <li>We promote your place on Google</li>
        </ul>
      </div>

      {/* Earnings */}
      <div className="font-semibold text-green-600">
        IDR{earnings.toLocaleString()} Your earnings (including taxes)
      </div>
    </WizardStep>
  );
}
