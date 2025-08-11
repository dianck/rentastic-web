'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoChevronDownSharp } from 'react-icons/io5';

export default function PropertyAddressForm() {
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      {/* Property Address Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Property Address</h2>

        {/* Country Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select country</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
              {/* Tambahkan opsi lainnya sesuai kebutuhan */}
            </select>
            <IoChevronDownSharp className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Location Input with Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Property Phone Number Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Property Phone Number</h2>

        <div className="flex gap-4">
          {/* Country Code */}
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="Input number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
