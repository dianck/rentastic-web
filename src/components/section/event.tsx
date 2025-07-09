"use client";

import { getEvents} from "@/lib/api";
import { ShoppingCart } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const tabs = [
  "All",
  "For you",
  "Online",
  "Today",
  "This weekend",
  "Juneteenth",
  "Pride",
  "Free",
  "Music",
  "Food & Drink",
  "Charity & Causes",
];


interface Event {
  id: number;
  organizerId: number;
  title: string;
  description: string;
  locationId: number;
  startDate: string;
  endDate: string;
  price: number | null;
  isPaid: boolean;
  totalSeats: number;
  availableSeats: number;
  categoryId: number;
  createdAt: string;
  location: {
    name: string;
  };
  category: {
    name: string;
  };
  ticketTypes: [{
    name: string;
    price: number;
  }];
}


interface EventStats extends Event {
  registered: number;
  filledSeats: number;
  revenue: number;
}

const EventSection: React.FC = () => {
  const [events, setEvents] = useState<EventStats[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();

        const events = data.map((event: Event) => {
          const filledSeats = event.totalSeats - event.availableSeats;
          const revenue = event.isPaid && event.price ? filledSeats * event.price : 0;

          return {
            ...event,
            registered: filledSeats,
            filledSeats,
            revenue,
          };
        });

        setEvents(events);
      } catch (err) {
        console.error('Error fetching events', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-12">
      {/* Tabs */}
      <div className="flex flex-nowrap gap-4 text-sm font-medium border-b pb-2 overflow-x-auto -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 pb-1 border-b-2 whitespace-nowrap ${
              tab === "For you"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>


      {/* Title */}
      <h2 className="text-xl font-bold mt-6 mb-4 flex items-center gap-2">
        <span className="text-2xl">🏛️</span> Our top picks for you
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* <div className="relative">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="w-full h-[160px] object-cover"
              />
              {event.badge && (
                <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {event.badge}
                </span>
              )}
            </div> */}
            <div className="p-4">
              <h3 className="text-sm font-semibold leading-snug mb-1 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-xs text-gray-600 mb-1">{event.description}</p>
              <p className="text-xs text-gray-600 mb-1">
                Date: {new Date(event.startDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Time: {new Date(event.startDate).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).replace(':', '.')}
              </p>                
              <p className="text-xs text-gray-600 mb-1">{event.location.name}</p>
              {/* <p className="text-xs text-gray-900 font-medium mb-2">
                Rp. {new Intl.NumberFormat('id-ID').format(event.price ?? 0)}
              </p> */}
              {/* <div>
                {event.ticketTypes && event.ticketTypes.length > 0 ? (
                  event.ticketTypes.map((ticket, idx) => (
                    <p key={idx} className="text-xs text-gray-900 font-medium mb-2">
                      {ticket.name}: Rp. {new Intl.NumberFormat('id-ID').format(ticket.price ?? 0)}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-gray-900 font-medium mb-2">
                    Rp. {new Intl.NumberFormat('id-ID').format(event.price ?? 0)}
                  </p>
                )}
              </div> */}
              <ul>
                {event.ticketTypes?.map((ticket, idx) => (
                  <li key={idx} className="text-xs text-gray-900 font-medium mb-2">
                    {ticket.name}: Rp. {new Intl.NumberFormat('id-ID').format(ticket.price ?? 0)}
                  </li>
                ))}
              </ul>


              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="text-gray-500">
                  Available: {event.availableSeats} / {event.totalSeats}
                </span>
                <Link
                  href={`/buy/${event.id}`} // jangan pakai tanda petik biasa dan titik koma di sini
                  className="ml-4 bg-blue-500 text-white rounded hover:bg-blue-600 inline-flex items-center gap-1 px-2 py-1 w-auto whitespace-nowrap cursor-pointer"
                >
                  <ShoppingCart size={14} />
                  Buy
                </Link>
              </div>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSection;
