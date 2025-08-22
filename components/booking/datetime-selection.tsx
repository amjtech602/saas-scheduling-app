"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Clock, CalendarIcon } from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"

interface DateTimeSelectionProps {
  bookingData: any
  onNext: (data: any) => void
  onBack: () => void
  canGoBack: boolean
  canGoNext: boolean
}

// Mock available time slots
const getAvailableSlots = (date: Date) => {
  const slots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  // Simulate some slots being taken
  const today = new Date()
  if (isSameDay(date, today)) {
    return slots.filter((slot) => !["10:00", "14:30", "16:00"].includes(slot))
  }

  return slots.filter((slot) => !["09:30", "15:30"].includes(slot))
}

export function DateTimeSelection({ bookingData, onNext, onBack, canGoBack, canGoNext }: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(bookingData.time)

  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : []

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext({ date: selectedDate, time: selectedTime })
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Select Date
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
            className="rounded-md border"
          />
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Available Times
          </h3>
          {selectedDate ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Available slots for {format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(slot)}
                    className="text-sm"
                  >
                    {formatTime(slot)}
                  </Button>
                ))}
              </div>
              {availableSlots.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No available slots for this date</p>
                  <p className="text-sm text-gray-400">Please select a different date</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Please select a date first</p>
            </div>
          )}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedDate && selectedTime && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Selected Appointment</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
              <p className="text-sm text-green-700">{formatTime(selectedTime)}</p>
            </div>
            <Badge variant="secondary">{bookingData.service?.duration} minutes</Badge>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selectedDate || !selectedTime}>
          Continue
        </Button>
      </div>
    </div>
  )
}
