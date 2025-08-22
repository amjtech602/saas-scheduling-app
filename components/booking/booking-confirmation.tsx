"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle, CreditCard, Shield } from "lucide-react"
import { format } from "date-fns"

interface BookingConfirmationProps {
  bookingData: any
  professional: any
  onBack: () => void
  onComplete: () => void
  canGoBack: boolean
}

export function BookingConfirmation({
  bookingData,
  professional,
  onBack,
  onComplete,
  canGoBack,
}: BookingConfirmationProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleConfirmBooking = () => {
    // In a real app, this would submit to the backend
    onComplete()
  }

  const subtotal = bookingData.service?.price || 0
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Service</h4>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">{bookingData.service?.name}</p>
                <p className="text-sm text-gray-600">{bookingData.service?.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {bookingData.service?.duration} minutes
                  </div>
                  <div className="text-lg font-bold text-gray-900">${bookingData.service?.price}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Date & Time</h4>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="font-medium">
                    {bookingData.date && format(bookingData.date, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-600" />
                  <span>{bookingData.time && formatTime(bookingData.time)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional & Client Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Professional</h4>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">{professional.name}</p>
                <p className="text-sm text-gray-600">{professional.businessName}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {professional.location}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Your Information</h4>
              <div className="bg-white p-3 rounded border space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">{bookingData.clientInfo?.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">{bookingData.clientInfo?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">{bookingData.clientInfo?.phone}</span>
                </div>
                {bookingData.clientInfo?.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {bookingData.clientInfo.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
          <h4 className="font-medium text-gray-900">Payment Summary</h4>
        </div>

        {bookingData.paymentData && (
          <div className="mb-4 p-3 bg-white rounded border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  •••• •••• •••• {bookingData.paymentData.cardNumber.slice(-4)}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{bookingData.paymentData.cardholderName}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{bookingData.service?.name}</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Important Information</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• You will receive a confirmation email shortly after booking</li>
          <li>• Please arrive 5 minutes early for your appointment</li>
          <li>• Cancellations must be made at least 24 hours in advance</li>
          <li>• Payment has been securely processed and will appear on your statement</li>
          <li>• A receipt will be sent to your email address</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
          Back
        </Button>
        <Button onClick={handleConfirmBooking} size="lg" className="px-8">
          Confirm Booking
        </Button>
      </div>
    </div>
  )
}
