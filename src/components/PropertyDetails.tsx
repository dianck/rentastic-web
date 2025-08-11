"use client";

import axios from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiSearch } from 'react-icons/fi';
import { IoChevronDownSharp } from 'react-icons/io5';

interface Category {
  id: string;
  name: string;
}

export default function PropertyDetailsForm() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [propertyName, setPropertyName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);


  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [picEmail, setEmail] = useState('');
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
  
  const fetchProfile = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "/property/details",
        { email },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );

      const data = res.data?.data;
      console.log("Response Data: ", data);

      if (data?.length) {
        const property = data[0];
        setPropertyName(property.name || "");
        setSelectedCategoryId(property.category?.id || "");

        setCountry(property.country || "");
        setLocation(property.location || "");
        setCountryCode(property.phone_country || "+62");
        setPhoneNumber(property.phone_number || "");

        // // ✅ Tambahan PIC
        setFirstName(property.pic_first_name || "");
        setLastName(property.pic_last_name || "");
        setEmail(property.pic_email || "");
        setPosition(property.pic_position || "");

        // // ✅ Tambahan Phones
        setPhones([
          {
            code: property.pic_country_code || "+62",
            number: property.pic_phone_number || "", // sesuai nama field API
          },
        ]);

      } else {
        setError("Property data not found.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load property details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/property/categories", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      setCategories(res.data?.data || []);
    } catch (err: any) {
      console.error("Failed to load categories", err);
    }
  };

  const handleSave = async () => {
    if (
      !email ||
      !propertyName ||
      !selectedCategoryId ||
      !firstName ||
      !lastName ||
      !picEmail ||
      !position
    ) {
      setError("All fields are required.");
      return;
    }

    console.log("email: ", email);
    console.log("PropName: ", propertyName);
    console.log("Category ID: ", selectedCategoryId);
    
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "/property/detail-update", // ✅ pakai endpoint yang benar
        {
          email,
          name: propertyName,
          categoryId: selectedCategoryId,
          country,
          location,
          phone_country: countryCode,
          phone_number: phoneNumber,
          pic_first_name: firstName,
          pic_last_name: lastName,
          pic_email: picEmail,
          pic_position: position,
          pic_country_code: phones[0]?.code || "+62",
          pic_phone_number: phones[0]?.number || "",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );

      setSuccess("Property details updated successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update property.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, [email]);

  return (
    <div>
    
    {/* DETAILS */}
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Property Identity</h2>

      {loading && <p className="text-sm text-gray-500 mb-4">Loading...</p>}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-4">{success}</p>}

      {/* Property Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Property Name
        </label>
        <input
          type="text"
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
          placeholder="Type your property name"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Property Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Property Type
        </label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your property type</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

    </div>



    {/* ADDRESS */}
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6 my-5">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
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


    {/* CONTACT */}
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6 my-5">
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
            value={picEmail}
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


    <div className="bg-white shadow-sm rounded-lg p-3 my-5 flex items-center justify-center min-h-[50px]">
      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`bg-foreground text-white hover:brightness-75 px-14 py-2 rounded-md text-sm font-medium ${
          saving ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
   

  </div>
  );
}
