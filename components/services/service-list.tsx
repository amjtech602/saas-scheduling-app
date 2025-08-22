"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react"
import { ServiceForm } from "./service-form"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  isActive: boolean
  requiresPreparation: boolean
  maxAdvanceBooking: number
  bookings?: number
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Business Consultation",
    description: "Comprehensive business strategy and planning session",
    price: 150,
    duration: 60,
    category: "consultation",
    isActive: true,
    requiresPreparation: true,
    maxAdvanceBooking: 30,
    bookings: 12,
  },
  {
    id: "2",
    name: "Follow-up Session",
    description: "Quick check-in and progress review",
    price: 75,
    duration: 30,
    category: "consultation",
    isActive: true,
    requiresPreparation: false,
    maxAdvanceBooking: 14,
    bookings: 8,
  },
  {
    id: "3",
    name: "Strategy Planning Workshop",
    description: "Deep-dive strategic planning session",
    price: 200,
    duration: 90,
    category: "workshop",
    isActive: true,
    requiresPreparation: true,
    maxAdvanceBooking: 60,
    bookings: 5,
  },
  {
    id: "4",
    name: "Quick Call",
    description: "Brief consultation call",
    price: 50,
    duration: 15,
    category: "consultation",
    isActive: false,
    requiresPreparation: false,
    maxAdvanceBooking: 7,
    bookings: 15,
  },
]

export function ServiceList() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSaveService = (serviceData: Service) => {
    if (editingService) {
      // Update existing service
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...serviceData, id: editingService.id } : s)),
      )
    } else {
      // Add new service
      const newService = { ...serviceData, id: Date.now().toString(), bookings: 0 }
      setServices((prev) => [...prev, newService])
    }
    setShowForm(false)
    setEditingService(null)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId))
  }

  const handleToggleActive = (serviceId: string) => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s)))
  }

  const handleDuplicateService = (service: Service) => {
    const duplicatedService = {
      ...service,
      id: Date.now().toString(),
      name: `${service.name} (Copy)`,
      bookings: 0,
    }
    setServices((prev) => [...prev, duplicatedService])
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

  if (showForm) {
    return (
      <div className="flex justify-center">
        <ServiceForm
          service={editingService || undefined}
          onSave={handleSaveService}
          onCancel={() => {
            setShowForm(false)
            setEditingService(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-gray-600">Manage your service offerings and pricing</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className={`relative ${!service.isActive ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {!service.isActive && <EyeOff className="h-4 w-4 text-gray-400" />}
                  </div>
                  <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditService(service)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateService(service)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleActive(service.id)}>
                      {service.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteService(service.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CardDescription className="text-sm">
                  {service.description || "No description provided"}
                </CardDescription>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${service.price}</span>
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{service.bookings || 0} bookings</span>
                  <span>Max {service.maxAdvanceBooking}d advance</span>
                </div>

                {service.requiresPreparation && (
                  <Badge variant="outline" className="text-xs">
                    Requires Preparation
                  </Badge>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditService(service)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Share Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">No services yet</h3>
              <p className="text-gray-500">Create your first service to start accepting bookings</p>
              <Button onClick={() => setShowForm(true)}>Add Your First Service</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
