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
  is_published: string;
}

export default function RoomDetailsStep() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null); // untuk edit
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [roomPrice, setRoomPrice] = useState<number | "">("");
  const [roomCount, setRoomCount] = useState<number | "">("");
  const [unitType, setUnitType] = useState("");
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState<string>("false"); // default draft

  // fetch room list
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

        // console.log("Room: ", res.data);
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

  // fetch room types
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
      } catch (err) {
        console.error("Failed to load room types", err);
      }
    };
    fetchRoomTypes();
  }, []);

  // Upload handlers
  const appendFiles = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(fileList)]);
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
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // validate form
  const validateForm = () => {
    if (!roomName.trim()) return "Room name is required";
    if (!roomDesc.trim()) return "Room description is required";
    if (!unitType) return "Room type is required";
    if (!roomPrice || roomPrice <= 0) return "Room price must be greater than 0";
    if (!roomCount || roomCount <= 0)
      return "Number of rooms must be greater than 0";

    if (!editingRoomId && files.length < 5) return "Please upload at least 5 photos";
    // if (files.length < 5) return "Please upload at least 5 photos";
    return null;
  };

  // save room
  const handleSaveRoom = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", roomName);
      formData.append("description", roomDesc);
      formData.append("type", unitType);
      formData.append("price", String(roomPrice));
      formData.append("number_of_rooms", String(roomCount));
      formData.append("is_published", isPublished);

      files.forEach((file) => {
        formData.append("images", file);
      });

      // jika editing, panggil endpoint room-update, jika add, room-add
      const url = editingRoomId 
        ? `/property/room-update/${editingRoomId}` 
        : "/property/room-add";

      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // reset form
      setRoomName("");
      setRoomDesc("");
      setRoomPrice("");
      setRoomCount("");
      setUnitType("");
      setFiles([]);
      setIsPublished("false");
      setShowForm(false);
      setEditingRoomId(null);

      // refresh room list
      const res = await axios.post("/property/detail-room", { email }, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
      });
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error("Failed to save room", err);
      setFormError("Failed to save room. Please try again.");
    }
  };



  const handleEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomName(room.name);
    setRoomDesc(room.description);
    setUnitType(room.type);
    setRoomPrice(room.price);
    setRoomCount(room.number_of_rooms);
    setIsPublished(room.is_published);
    setShowForm(true);
    
  };

  const handlePublish = async (roomId: string) => {
    try {
      await axios.post(`/property/room-publish/${roomId}`, {}, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
      });
      // refresh room list
      const res = await axios.post("/property/detail-room", { email }, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
      });
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error("Failed to publish room", err);
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Room Details</h2>

        <button
          onClick={() => {
            // reset semua state form agar kosong
            setRoomName("");
            setRoomDesc("");
            setRoomPrice("");
            setRoomCount("");
            setUnitType("");
            setFiles([]);
            setIsPublished("false");
            setEditingRoomId(null);
            setShowForm(true);
          }}
          className="px-2 py-1 bg-blue-600 text-white rounded-full shadow text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Room
        </button>
      </div>


    {/* Form Add Room muncul di atas daftar jika showForm true */}
      {showForm && editingRoomId === null && (
        <div className="border rounded-lg p-4 bg-gray-50 shadow-md space-y-4 mb-6">
          <h3 className="text-md font-semibold mb-2">Add New Room</h3>

          {formError && <p className="text-red-500">{formError}</p>}

          <div>
            <label className="block text-sm font-medium">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter room name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={roomDesc}
              onChange={(e) => setRoomDesc(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter room description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Room Type</label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Room Type --</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              value={roomPrice}
              onChange={(e) => setRoomPrice(Number(e.target.value))}
              className="w-full border p-2 rounded"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Number of Rooms</label>
            <input
              type="number"
              value={roomCount}
              onChange={(e) => setRoomCount(Number(e.target.value))}
              className="w-full border p-2 rounded"
              placeholder="Enter number of rooms"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Published</label>
            <select
              value={isPublished}
              onChange={(e) => setIsPublished(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Upload Photos */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Photos (min. 5)</label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed p-4 text-center cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-add"
              />
              <label htmlFor="file-upload-add" className="cursor-pointer">
                Drag and drop or <b>Upload photos</b>
              </label>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {files.map((file, index) => (
                  <div key={index} className="relative border p-1">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-20 object-cover"
                    />
                    <button
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveRoom}
              className="px-4 py-1 bg-green-600 text-white rounded-lg cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-1 bg-gray-400 text-white rounded-lg cursor-pointer"
            > 
              Cancel
            </button>
          </div>
        </div>
      )}

      {rooms.length === 0 ? (
        <p className="text-gray-500 mb-4">No rooms found for this property.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {rooms.map((room) => (
            <div key={room.id} className="relative border rounded-lg p-4 shadow-sm bg-white">
              {editingRoomId === room.id ? (
                // Form edit langsung di posisi card
                <div className="space-y-4">
                  <h3 className="text-md font-semibold mb-2">Edit Room</h3>

                  {formError && <p className="text-red-500">{formError}</p>}

                  <div>
                    <label className="block text-sm font-medium">Room Name</label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      value={roomDesc}
                      onChange={(e) => setRoomDesc(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Room Type</label>
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Select Room Type --</option>
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input
                      type="number"
                      value={roomPrice}
                      onChange={(e) => setRoomPrice(Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Number of Rooms</label>
                    <input
                      type="number"
                      value={roomCount}
                      onChange={(e) => setRoomCount(Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Published</label>
                    <select
                      value={isPublished}
                      onChange={(e) => setIsPublished(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  {/* Upload Photos */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Photos</label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed p-4 text-center cursor-pointer"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id={`file-upload-${room.id}`}
                      />
                      <label htmlFor={`file-upload-${room.id}`} className="cursor-pointer">
                        Drag and drop or <b>Upload photos</b>
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {files.map((file, index) => (
                          <div key={index} className="relative border p-1">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${index}`}
                              className="w-full h-20 object-cover"
                            />
                            <button
                              onClick={() => handleRemove(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSaveRoom}
                      className="px-4 py-1 bg-green-600 text-white rounded-lg cursor-pointer"
                    >
                      Update
                    </button>
                    
                    <button
                      onClick={() => {
                        // Reset semua state form
                        setEditingRoomId(null);
                        setShowForm(false);
                        setRoomName("");
                        setRoomDesc("");
                        setRoomPrice("");
                        setRoomCount("");
                        setUnitType("");
                        setFiles([]);
                        setIsPublished("false");
                        setFormError(null);
                      }}
                      className="px-4 py-1 bg-gray-400 text-white rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (

                <>
                  {/* <div className="relative border rounded-xl p-4 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200"> */}
                    {/* Status badge */}
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
                        room.is_published ? "bg-green-600 text-white" : "bg-gray-400 text-white"
                      }`}
                    >
                      {room.is_published ? "Published" : "Draft"}
                    </span>

                    {/* Room title & description */}
                    <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {room.description || "No description available"}
                    </p>

                    {/* Room info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <span className="font-medium">Type:</span> {room.type}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span>{" "}
                        <span className=" font-semibold">
                          Rp {room.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Rooms Available:</span> {room.number_of_rooms}
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  {/* </div> */}
                </>

              )}
            </div>
          ))}
        </div>



      )}

    </WizardStep>
  );
}
