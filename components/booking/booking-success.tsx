"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Clock, Mail, Phone, MapPin, Download, Share2 } from "lucide-react"
import { format } from "date-fns"

interface BookingSuccessProps {
  bookingData: any
  professional: any
  bookingId: string
}

export function BookingSuccess({ bookingData, professional, bookingId }: BookingSuccessProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleAddToCalendar = () => {
    // Generate calendar event
    const startDate = new Date(bookingData.date)
    const [hours, minutes] = bookingData.time.split(":")
    startDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + bookingData.service.duration)

    const event = {
      title: `${bookingData.service.name} with ${professional.name}`,
      start: startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      end: endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      description: `${bookingData.service.description}\n\nProfessional: ${professional.name}\nLocation: ${professional.location}`,
      location: professional.location,
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
    window.open(calendarUrl, "_blank")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Appointment Booked",
        text: `I've booked an appointment with ${professional.name} for ${bookingData.service.name}`,
        url: window.location.href,
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="text-gray-600 mt-2">Your appointment has been successfully scheduled</p>
          </div>
        </div>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Appointment Details
            </CardTitle>
            <CardDescription>Booking ID: #{bookingId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-blue-900">{bookingData.service.name}</h3>
                  <p className="text-sm text-blue-700">{bookingData.service.description}</p>
                </div>
                <Badge variant="secondary">${bookingData.service.price}</Badge>
              </div>
              <div className="flex items-center text-sm text-blue-700">
                <Clock className="h-4 w-4 mr-1" />
                {bookingData.service.duration} minutes
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">{format(bookingData.date, "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-sm text-gray-600">Date</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">{formatTime(bookingData.time)}</p>
                  <p className="text-sm text-gray-600">Time</p>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Professional</h4>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <span className="text-white font-semibold">
                    {professional.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{professional.name}</p>
                  <p className="text-sm text-gray-600">{professional.businessName}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {professional.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Your Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{bookingData.clientInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{bookingData.clientInfo.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation email at {bookingData.clientInfo.email} with all the details
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Add to Calendar</p>
                  <p className="text-sm text-gray-600">Don't forget to add this appointment to your calendar</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Arrive Early</p>
                  <p className="text-sm text-gray-600">Please arrive 5 minutes before your scheduled time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleAddToCalendar} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex-1 bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Need to make changes? Contact {professional.name} directly or</p>
          <Button variant="link" className="p-0 h-auto text-sm">
            manage your booking here
          </Button>
        </div>
      </div>
    </div>
  )
}
