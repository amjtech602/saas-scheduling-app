"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Clock, User, Mail, Phone, MoreHorizontal, Check, X, MessageSquare } from "lucide-react"
import { format } from "date-fns"

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  date: Date
  time: string
  duration: number
  price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  createdAt: Date
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    clientName: "Sarah Johnson",
    clientEmail: "sarah@example.com",
    clientPhone: "+1 (555) 123-4567",
    service: "Business Consultation",
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: "09:00",
    duration: 60,
    price: 150,
    status: "pending",
    notes: "Looking for help with business strategy",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "BK002",
    clientName: "Mike Chen",
    clientEmail: "mike@example.com",
    clientPhone: "+1 (555) 987-6543",
    service: "Follow-up Session",
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    time: "14:00",
    duration: 30,
    price: 75,
    status: "confirmed",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: "BK003",
    clientName: "Alex Rivera",
    clientEmail: "alex@example.com",
    clientPhone: "+1 (555) 456-7890",
    service: "Strategy Planning",
    date: new Date(Date.now() - 86400000), // Yesterday
    time: "16:30",
    duration: 90,
    price: 200,
    status: "completed",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: "BK004",
    clientName: "Emma Davis",
    clientEmail: "emma@example.com",
    clientPhone: "+1 (555) 321-0987",
    service: "Quick Call",
    date: new Date(Date.now() + 259200000), // 3 days from now
    time: "11:00",
    duration: 15,
    price: 50,
    status: "cancelled",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
]

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [activeTab, setActiveTab] = useState("all")

  const handleStatusChange = (bookingId: string, newStatus: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
    )
  }

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const filterBookings = (status?: string) => {
    if (!status || status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  const getTabCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
    }
  }

  const tabCounts = getTabCounts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-gray-600">Manage your appointments and client bookings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({tabCounts.pending})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({tabCounts.confirmed})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tabCounts.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filterBookings(activeTab === "all" ? undefined : activeTab).map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{booking.service}</h3>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Booking #{booking.id}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {booking.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmed")}>
                                <Check className="h-4 w-4 mr-2" />
                                Confirm
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "cancelled")}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "completed")}>
                                <Check className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "cancelled")}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{format(booking.date, "MMM d, yyyy")}</p>
                          <p className="text-sm text-gray-600">{format(booking.date, "EEEE")}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{formatTime(booking.time)}</p>
                          <p className="text-sm text-gray-600">{booking.duration} minutes</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 p-2 rounded-full">
                          <span className="text-green-600 font-semibold text-sm">$</span>
                        </div>
                        <div>
                          <p className="font-medium">${booking.price}</p>
                          <p className="text-sm text-gray-600">Service fee</p>
                        </div>
                      </div>
                    </div>

                    {/* Client Information */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{booking.clientName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{booking.clientEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{booking.clientPhone}</span>
                        </div>
                      </div>
                      {booking.notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    {booking.status === "pending" && (
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" onClick={() => handleStatusChange(booking.id, "confirmed")}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(booking.id, "cancelled")}
                          className="bg-transparent"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filterBookings(activeTab === "all" ? undefined : activeTab).length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab === "all" ? "" : activeTab} bookings
                </h3>
                <p className="text-gray-500 text-center">
                  {activeTab === "all" ? "You don't have any bookings yet" : `No ${activeTab} bookings at the moment`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
