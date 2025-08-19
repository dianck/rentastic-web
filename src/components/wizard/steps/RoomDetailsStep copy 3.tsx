"use client";

import { useEffect, useState } from "react";
import WizardStep from "../WizardStep";
import axios from "@/lib/axios";
import { useSession } from "next-auth/react";

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  number_of_rooms: number;
  type: string;
}

export default function RoomDetailsStep() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // State untuk form Add Room
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    number_of_rooms: 0,
    type: "",
  });

  // State untuk error per field
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch daftar room user
  useEffect(() => {
    const fetchRooms = async () => {
      if (!email) return;

      try {
        setLoading(true);
        const res = await axios.post(
          "/property/detail-room",
          { email },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          }
        );
        setRooms(res.data?.data || []);
      } catch (err: any) {
        console.error("Failed to load room details", err);
        setError("Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [email]);

  // Fetch daftar room types
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await axios.get("/property/room-types", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        });
        setRoomTypes(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load room types", err);
      }
    };

    fetchRoomTypes();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Room name is required.";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = "Price must be greater than 0.";
    }
    if (!formData.number_of_rooms || formData.number_of_rooms <= 0) {
      errors.number_of_rooms = "Number of rooms must be greater than 0.";
    }
    if (!formData.type) {
      errors.type = "Please select a room type.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddRoom = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "/property/add-room",
        { email, ...formData },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );
      setRooms((prev) => [...prev, res.data?.data]);
      setFormData({
        name: "",
        description: "",
        price: 0,
        number_of_rooms: 0,
        type: "",
      });
      setFormErrors({});
      setShowForm(false);
    } catch (err: any) {
      console.error("Failed to add room", err);
      setError("Failed to add room");
    }
  };

  if (loading) {
    return (
      <WizardStep>
        <p className="text-gray-500">Loading room details...</p>
      </WizardStep>
    );
  }

  if (error) {
    return (
      <WizardStep>
        <p className="text-red-500">{error}</p>
      </WizardStep>
    );
  }

  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">Room Details</h2>

      {rooms.length === 0 ? (
        <p className="text-gray-500">No rooms found for this property.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h3 className="text-md font-semibold">{room.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {room.description || "No description available"}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {room.type}
                </div>
                <div>
                  <span className="font-medium">Price:</span> Rp{" "}
                  {room.price.toLocaleString("id-ID")}
                </div>
                <div>
                  <span className="font-medium">Rooms Available:</span>{" "}
                  {room.number_of_rooms}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tombol Add Room */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Add Room"}
      </button>

      {/* Form Add Room */}
      {showForm && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
          <h3 className="font-semibold mb-3">Add New Room</h3>

          <div className="space-y-3">
            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Room Name
              </label>
              <input
                type="text"
                placeholder="Room name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`border p-2 rounded w-full ${
                  formErrors.name ? "border-red-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                placeholder="Room description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`border p-2 rounded w-full ${
                  formErrors.description ? "border-red-500" : ""
                }`}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (Rp)
              </label>
              <input
                type="number"
                placeholder="Room price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className={`border p-2 rounded w-full ${
                  formErrors.price ? "border-red-500" : ""
                }`}
              />
              {formErrors.price && (
                <p className="text-red-500 text-sm">{formErrors.price}</p>
              )}
            </div>

            {/* Number of Rooms */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Rooms
              </label>
              <input
                type="number"
                placeholder="Available rooms"
                value={formData.number_of_rooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number_of_rooms: Number(e.target.value),
                  })
                }
                className={`border p-2 rounded w-full ${
                  formErrors.number_of_rooms ? "border-red-500" : ""
                }`}
              />
              {formErrors.number_of_rooms && (
                <p className="text-red-500 text-sm">
                  {formErrors.number_of_rooms}
                </p>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Room Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className={`border p-2 rounded w-full ${
                  formErrors.type ? "border-red-500" : ""
                }`}
              >
                <option value="">-- Select a Room Type --</option>
                {roomTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {formErrors.type && (
                <p className="text-red-500 text-sm">{formErrors.type}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleAddRoom}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save Room
          </button>
        </div>
      )}
    </WizardStep>
  );
}
