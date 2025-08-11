'use client';

import { useState } from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';

export default function PropertyContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [phones, setPhones] = useState([{ code: '+62', number: '' }]);

  const addPhoneField = () => {
    setPhones([...phones, { code: '', number: '' }]);
  };

  const updatePhoneField = (index: number, field: 'code' | 'number', value: string) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold">Person-in-Charge of Property</h2>

      <p className="text-sm text-gray-600">
        Kindly note that any action taken by the Hotel’s PIC as stated and recorded here will be
        deemed as a legitimate action on behalf of the Hotel. Any email, action, and/or other
        correspondence either notification from Traveloka to Hotel and/or Hotel’s approval on any
        related matter regarding services, confirmation letter, and/or any documents related to the
        cooperation, other than carry out by the Hotel’s authorized representative as stated in the
        POA, can be also carried out by Hotel’s PIC as stated and recorded in here.
      </p>

      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            placeholder="Type first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            placeholder="Type last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Type valid email address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Position */}
      <div className="w-full md:w-1/2">
        <label className="block text-sm font-medium mb-1">Position</label>
        <div className="relative">
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none"
          >
            <option value="">Select position</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Owner">Owner</option>
            {/* Tambahkan sesuai kebutuhan */}
          </select>
          <IoChevronDownSharp className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Phone Numbers */}
      {phones.map((phone, index) => (
        <div className="flex gap-4 items-end" key={index}>
          <div className="w-1/3">
            <label className="block text-sm font-medium mb-1">Country Code</label>
            <input
              type="text"
              value={phone.code}
              onChange={(e) => updatePhoneField(index, 'code', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="Input number"
              value={phone.number}
              onChange={(e) => updatePhoneField(index, 'number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPhoneField}
        className="text-blue-600 text-sm font-medium hover:underline mt-2"
      >
        + Add another number
      </button>
    </div>
  );
}
