"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Star } from "lucide-react"
import { ServiceSelection } from "./service-selection"
import { DateTimeSelection } from "./datetime-selection"
import { ClientInformation } from "./client-information"
import { BookingConfirmation } from "./booking-confirmation"
import { BookingSuccess } from "./booking-success"

interface Professional {
  id: string
  name: string
  businessName: string
  bio: string
  location: string
  rating: number
  reviewCount: number
  avatar?: string
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface BookingData {
  service?: Service
  date?: Date
  time?: string
  clientInfo?: {
    name: string
    email: string
    phone: string
    notes?: string
  }
}

const mockProfessional: Professional = {
  id: "1",
  name: "Dr. Sarah Johnson",
  businessName: "Johnson Consulting",
  bio: "Experienced business consultant with over 10 years of expertise in strategy and operations. I help businesses optimize their processes and achieve sustainable growth.",
  location: "New York, NY",
  rating: 4.9,
  reviewCount: 127,
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Business Consultation",
    description:
      "Comprehensive business strategy and planning session to help you identify opportunities and overcome challenges.",
    price: 150,
    duration: 60,
    category: "consultation",
  },
  {
    id: "2",
    name: "Follow-up Session",
    description: "Quick check-in and progress review to ensure you're on track with your goals.",
    price: 75,
    duration: 30,
    category: "consultation",
  },
  {
    id: "3",
    name: "Strategy Planning Workshop",
    description: "Deep-dive strategic planning session with comprehensive analysis and actionable recommendations.",
    price: 200,
    duration: 90,
    category: "workshop",
  },
]

interface BookingFlowProps {
  professionalId: string
}

export function BookingFlow({ professionalId }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({})
  const [bookingId, setBookingId] = useState<string>("")
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    { id: 1, title: "Select Service", component: ServiceSelection },
    { id: 2, title: "Choose Date & Time", component: DateTimeSelection },
    { id: 3, title: "Your Information", component: ClientInformation },
    { id: 4, title: "Confirmation", component: BookingConfirmation },
  ]

  const currentStepData = steps.find((step) => step.id === currentStep)
  const CurrentStepComponent = currentStepData?.component

  const handleNext = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBookingComplete = () => {
    // Generate booking ID
    const newBookingId = `BK${Date.now().toString().slice(-6)}`
    setBookingId(newBookingId)
    setIsComplete(true)

    // In a real app, this would:
    // 1. Submit booking to backend
    // 2. Send confirmation emails
    // 3. Update professional's calendar
    // 4. Process payment if required
    console.log("Booking completed:", { ...bookingData, bookingId: newBookingId })
  }

  // Show success page after booking completion
  if (isComplete) {
    return <BookingSuccess bookingData={bookingData} professional={mockProfessional} bookingId={bookingId} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto sm:mx-0">
                <AvatarFallback className="text-lg">
                  {mockProfessional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{mockProfessional.name}</h1>
                  <Badge variant="secondary" className="self-center sm:self-auto">
                    {mockProfessional.businessName}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{mockProfessional.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{mockProfessional.rating}</span>
                    <span>({mockProfessional.reviewCount} reviews)</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{mockProfessional.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 sm:mb-8">
          {/* Desktop Progress Steps */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Progress Steps */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </div>
              <div className="text-sm font-medium text-blue-600">{currentStepData?.title}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">{currentStepData?.title}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {currentStep === 1 && "Choose the service you'd like to book"}
              {currentStep === 2 && "Select your preferred date and time"}
              {currentStep === 3 && "Please provide your contact information"}
              {currentStep === 4 && "Review and confirm your booking"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {CurrentStepComponent && (
              <CurrentStepComponent
                services={mockServices}
                professional={mockProfessional}
                bookingData={bookingData}
                onNext={handleNext}
                onBack={handleBack}
                onComplete={handleBookingComplete}
                canGoBack={currentStep > 1}
                canGoNext={
                  (currentStep === 1 && bookingData.service) ||
                  (currentStep === 2 && bookingData.date && bookingData.time) ||
                  (currentStep === 3 && bookingData.clientInfo) ||
                  currentStep === 4
                }
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-4">
          <p>Powered by SchedulePro • Secure booking platform for professionals</p>
        </div>
      </div>
    </div>
  )
}
