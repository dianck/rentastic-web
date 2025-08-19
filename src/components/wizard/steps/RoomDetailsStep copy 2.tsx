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
  }, []);

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
        <div className="space-y-4">
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
    </WizardStep>
  );
}
