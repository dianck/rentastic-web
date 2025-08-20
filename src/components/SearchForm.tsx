"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Users, Search } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SearchForm() {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [guests, setGuests] = React.useState(2);

  return (
    <div className="w-full max-w-4xl mx-auto bg-card p-4 sm:p-6 rounded-xl shadow-lg -mt-30 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-white font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Destination
          </Label>
          <Select>
            <SelectTrigger id="destination" className="w-full">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jakarta">Jakarta</SelectItem>
              <SelectItem value="bandung">Bandung</SelectItem>
              <SelectItem value="bali">Bali</SelectItem>
              <SelectItem value="surabaya">Surabaya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
           <Label htmlFor="dates" className="text-white   font-semibold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Check-in - Check-out
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dates"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-white font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" /> Guests
          </Label>
          <Input id="guests" type="number" placeholder="2" value={guests} onChange={(e) => setGuests(parseInt(e.target.value, 10))} min="1"/>
        </div>

        <Button
          className="text-white md:col-start-4"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Search className="mr-2 h-4 w-4 text-white" /> Search
        </Button>

      </div>
    </div>
  );
}
