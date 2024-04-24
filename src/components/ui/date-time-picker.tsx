"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker12Demo } from "./time-picker-demo";

export function DateTimePicker({ onDateChange }: { onDateChange: any }) {
  const [date, setDate] = React.useState<Date>();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTimeSet = (time: Date | undefined) => {
    if(time){
      const newDateTime = new Date(date!.getTime());
      newDateTime.setHours(time.getHours());
      newDateTime.setMinutes(time.getMinutes());
      newDateTime.setSeconds(time.getSeconds());
      setDate(newDateTime); // Update date object with time
      onDateChange(newDateTime.toISOString()); // Propagate the change in ISO format
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePicker12Demo setDate={handleTimeSet} date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
