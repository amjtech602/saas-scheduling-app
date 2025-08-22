"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, User, Mail, Phone } from "lucide-react"
import { format } from "date-fns"

interface EmailTemplateProps {
  bookingData: any
  professional: any
  bookingId: string
  type: "client" | "professional"
}

export function BookingConfirmationEmail({ bookingData, professional, bookingId, type }: EmailTemplateProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (type === "client") {
    return (
      <div className="max-w-2xl mx-auto bg-white">
        {/* Email Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">Booking Confirmed</h1>
          <p className="mt-2">Your appointment has been scheduled</p>
        </div>

        {/* Email Content */}
        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-700">Hi {bookingData.clientInfo.name},</p>
            <p className="text-gray-700 mt-2">
              Thank you for booking an appointment with {professional.name}. Your booking has been confirmed and we're
              looking forward to meeting with you.
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-3">Appointment Details</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                <span>{format(bookingData.date, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                <span>
                  {formatTime(bookingData.time)} ({bookingData.service.duration} minutes)
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                <span>{professional.location}</span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">{bookingData.service.name}</h3>
            <p className="text-gray-600 text-sm">{bookingData.service.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">Duration: {bookingData.service.duration} minutes</span>
              <span className="font-semibold">${bookingData.service.price}</span>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 className="font-semibold mb-2">Professional</h3>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium">{professional.name}</p>
              <p className="text-sm text-gray-600">{professional.businessName}</p>
              <p className="text-sm text-gray-600">{professional.location}</p>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Important Information</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Please arrive 5 minutes early</li>
              <li>• Bring any relevant documents or materials</li>
              <li>• Cancellations must be made 24 hours in advance</li>
              <li>• Contact us if you need to reschedule</li>
            </ul>
          </div>

          {/* Booking Reference */}
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="font-mono font-semibold">#{bookingId}</p>
          </div>
        </div>

        {/* Email Footer */}
        <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
          <p>This email was sent by SchedulePro on behalf of {professional.businessName}</p>
          <p className="mt-1">Need help? Contact support or reply to this email</p>
        </div>
      </div>
    )
  }

  // Professional email template
  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Email Header */}
      <div className="bg-green-600 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">New Booking Received</h1>
        <p className="mt-2">You have a new appointment request</p>
      </div>

      {/* Email Content */}
      <div className="p-6 space-y-6">
        <div>
          <p className="text-gray-700">Hi {professional.name},</p>
          <p className="text-gray-700 mt-2">
            You have received a new booking request. Please review the details below and confirm the appointment.
          </p>
        </div>

        {/* Client Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold text-green-900 mb-3">Client Information</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 text-green-600 mr-2" />
              <span>{bookingData.clientInfo.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-green-600 mr-2" />
              <span>{bookingData.clientInfo.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-green-600 mr-2" />
              <span>{bookingData.clientInfo.phone}</span>
            </div>
          </div>
          {bookingData.clientInfo.notes && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-sm text-green-800">
                <strong>Notes:</strong> {bookingData.clientInfo.notes}
              </p>
            </div>
          )}
        </div>

        {/* Appointment Details */}
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="font-semibold">{bookingData.service.name}</h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(bookingData.date, "MMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(bookingData.time)}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">Duration: {bookingData.service.duration} minutes</span>
            <span className="font-semibold">${bookingData.service.price}</span>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Action Required</h3>
          <p className="text-sm text-blue-800 mb-3">
            Please log in to your dashboard to confirm or modify this appointment
          </p>
          <div className="space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Confirm Booking</button>
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded text-sm">View Dashboard</button>
          </div>
        </div>

        {/* Booking Reference */}
        <div className="text-center p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Booking Reference</p>
          <p className="font-mono font-semibold">#{bookingId}</p>
        </div>
      </div>

      {/* Email Footer */}
      <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>This email was sent by SchedulePro</p>
        <p className="mt-1">Manage your bookings at schedulepro.com</p>
      </div>
    </div>
  )
}

export function EmailPreview({ bookingData, professional, bookingId }: Omit<EmailTemplateProps, "type">) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Confirmation Email</CardTitle>
          <CardDescription>Email sent to the client after booking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <BookingConfirmationEmail
              bookingData={bookingData}
              professional={professional}
              bookingId={bookingId}
              type="client"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Notification Email</CardTitle>
          <CardDescription>Email sent to the professional about new booking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <BookingConfirmationEmail
              bookingData={bookingData}
              professional={professional}
              bookingId={bookingId}
              type="professional"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
