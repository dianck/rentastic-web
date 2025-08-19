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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  // form state
  const [unitName, setUnitName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [numberOfRooms, setNumberOfRooms] = useState<number | "">("");
  const [unitType, setUnitType] = useState("");
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  // error state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch existing rooms
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
      } catch (err) {
        setError("Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [email]);

  // Fetch Room Types
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await axios.get("/property/room-types", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        });
        const types = res.data?.data || [];
        setRoomTypes(types);
        // default kosong (tidak langsung pilih)
        setUnitType("");
      } catch (err) {
        console.error("Failed to load room types", err);
      }
    };

    fetchRoomTypes();
  }, []);

  // file upload handling
  const appendFiles = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      setPhotos((prev) => [...prev, ...Array.from(fileList)]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    appendFiles(e.target.files);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    appendFiles(e.dataTransfer.files);
  };
  const handleRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!unitName.trim()) errors.name = "Room name is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!price || price <= 0)
      errors.price = "Price must be greater than 0";
    if (!numberOfRooms || numberOfRooms <= 0)
      errors.numberOfRooms = "Number of rooms must be greater than 0";
    if (!unitType) errors.type = "Room type is required";
    if (photos.length < 5)
      errors.photos = "Please upload at least 5 photos";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log("Submitting room:", {
      unitName,
      description,
      price,
      numberOfRooms,
      unitType,
      photos,
    });

    // reset form
    setShowForm(false);
    setUnitName("");
    setDescription("");
    setPrice("");
    setNumberOfRooms("");
    setUnitType("");
    setPhotos([]);
    setFormErrors({});
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

      {/* Button toggle */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Room
        </button>
      ) : (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-4">
          <h3 className="text-md font-semibold mb-2">Add New Room</h3>

          <div>
            <label className="block text-sm font-medium">Room Name</label>
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter room name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter description"
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm">{formErrors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Price (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border rounded p-2"
              placeholder="Enter price"
            />
            {formErrors.price && (
              <p className="text-red-500 text-sm">{formErrors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Number of Rooms</label>
            <input
              type="number"
              value={numberOfRooms}
              onChange={(e) => setNumberOfRooms(Number(e.target.value))}
              className="w-full border rounded p-2"
              placeholder="Enter number of rooms"
            />
            {formErrors.numberOfRooms && (
              <p className="text-red-500 text-sm">
                {formErrors.numberOfRooms}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Room Type</label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">-- Select Room Type --</option>
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

          {/* Upload Photos */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Photos (min 5)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-400 p-6 text-center rounded"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600"
              >
                Drag and drop or <b>Upload photos</b>
              </label>
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {photos.map((file, index) => (
                  <div key={index} className="relative border rounded">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formErrors.photos && (
              <p className="text-red-500 text-sm">{formErrors.photos}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </WizardStep>
  );
}
