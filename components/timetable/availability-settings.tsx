"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Clock } from "lucide-react"

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  isAvailable: boolean
  timeSlots: TimeSlot[]
}

interface WeeklyAvailability {
  [key: string]: DayAvailability
}

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const time24 = `${hour.toString().padStart(2, "0")}:${minute}`
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const ampm = hour < 12 ? "AM" : "PM"
  const time12 = `${hour12}:${minute} ${ampm}`
  return { value: time24, label: time12 }
})

export function AvailabilitySettings() {
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    monday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    thursday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    friday: { isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    saturday: { isAvailable: false, timeSlots: [] },
    sunday: { isAvailable: false, timeSlots: [] },
  })

  const [bufferTime, setBufferTime] = useState(15)
  const [timezone, setTimezone] = useState("America/New_York")

  const toggleDayAvailability = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
        timeSlots: !prev[day].isAvailable ? [{ start: "09:00", end: "17:00" }] : [],
      },
    }))
  }

  const addTimeSlot = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: "09:00", end: "17:00" }],
      },
    }))
  }

  const removeTimeSlot = (day: string, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index),
      },
    }))
  }

  const updateTimeSlot = (day: string, index: number, field: "start" | "end", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const copyToAllDays = (sourceDay: string) => {
    const sourceAvailability = availability[sourceDay]
    const newAvailability = { ...availability }

    DAYS.forEach(({ key }) => {
      if (key !== sourceDay) {
        newAvailability[key] = {
          isAvailable: sourceAvailability.isAvailable,
          timeSlots: sourceAvailability.timeSlots.map((slot) => ({ ...slot })),
        }
      }
    })

    setAvailability(newAvailability)
  }

  const formatTime = (time24: string) => {
    const option = TIME_OPTIONS.find((opt) => opt.value === time24)
    return option ? option.label : time24
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Availability Settings</h2>
          <p className="text-gray-600">Configure your working hours and availability</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>Settings that apply to all appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Buffer Time Between Appointments</Label>
              <Select value={bufferTime.toString()} onValueChange={(value) => setBufferTime(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Availability</CardTitle>
          <CardDescription>Set your available hours for each day of the week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Switch checked={availability[key].isAvailable} onCheckedChange={() => toggleDayAvailability(key)} />
                  <Label className="text-base font-medium">{label}</Label>
                  {availability[key].isAvailable && (
                    <Badge variant="secondary" className="text-xs">
                      {availability[key].timeSlots.length} slot{availability[key].timeSlots.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                {availability[key].isAvailable && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => addTimeSlot(key)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToAllDays(key)}>
                      Copy to All
                    </Button>
                  </div>
                )}
              </div>

              {availability[key].isAvailable && (
                <div className="ml-8 space-y-3">
                  {availability[key].timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <Select
                          value={slot.start}
                          onValueChange={(value) => updateTimeSlot(key, index, "start", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-gray-500">to</span>
                        <Select value={slot.end} onValueChange={(value) => updateTimeSlot(key, index, "end", value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 text-sm text-gray-600">
                        {formatTime(slot.start)} - {formatTime(slot.end)}
                      </div>
                      {availability[key].timeSlots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(key, index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!availability[key].isAvailable && (
                <div className="ml-8 text-sm text-gray-500 italic">Not available on {label.toLowerCase()}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
