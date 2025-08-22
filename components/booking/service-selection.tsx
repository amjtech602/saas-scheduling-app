"use client"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface ServiceSelectionProps {
  services: Service[]
  bookingData: any
  onNext: (data: any) => void
  canGoNext: boolean
}

export function ServiceSelection({ services, bookingData, onNext, canGoNext }: ServiceSelectionProps) {
  const handleServiceSelect = (service: Service) => {
    onNext({ service })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      consultation: "bg-blue-100 text-blue-800",
      coaching: "bg-green-100 text-green-800",
      therapy: "bg-purple-100 text-purple-800",
      training: "bg-orange-100 text-orange-800",
      workshop: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service.id}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
            bookingData.service?.id === service.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => handleServiceSelect(service)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${service.price}</div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {service.duration} min
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{service.description}</p>
        </div>
      ))}

      {bookingData.service && (
        <div className="pt-4 border-t">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Selected Service</h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{bookingData.service.name}</p>
                <p className="text-sm text-blue-700">{bookingData.service.duration} minutes</p>
              </div>
              <div className="text-xl font-bold text-blue-900">${bookingData.service.price}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
