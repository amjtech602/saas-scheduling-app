"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Check, Clock, Mail, MessageSquare, MoreHorizontal, Phone, User, Wallet, X } from "lucide-react"
import { useState } from "react"

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
  status: "pendente" | "confirmada" | "cancelada" | "concluida"
  notes?: string
  createdAt: Date
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    clientName: "Sarah Johnson",
    clientEmail: "sarah@example.com",
    clientPhone: "+1 (555) 123-4567",
    service: "Consulta Empresarial",
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: "09:00",
    duration: 60,
    price: 150,
    status: "pendente",
    notes: "Procurando ajuda com estratégia de negócios",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "BK002",
    clientName: "Mike Chen",
    clientEmail: "mike@example.com",
    clientPhone: "+1 (555) 987-6543",
    service: "Sessão de Acompanhamento",
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    time: "14:00",
    duration: 30,
    price: 75,
    status: "confirmada",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: "BK003",
    clientName: "Alex Rivera",
    clientEmail: "alex@example.com",
    clientPhone: "+1 (555) 456-7890",
    service: "Planejamento Estratégico",
    date: new Date(Date.now() - 86400000), // Yesterday
    time: "16:30",
    duration: 90,
    price: 200,
    status: "concluida",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: "BK004",
    clientName: "Emma Davis",
    clientEmail: "emma@example.com",
    clientPhone: "+1 (555) 321-0987",
    service: "Chamada rápida",
    date: new Date(Date.now() + 259200000), // 3 days from now
    time: "11:00",
    duration: 15,
    price: 50,
    status: "cancelada",
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
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      case "concluida":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    // const ampm = hour >= 12 ? "PM" : "AM"
    // const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    // return `${displayHour}:${minutes} ${ampm}`
    return `${hour}:${minutes}`
  }

  const filterBookings = (status?: string) => {
    if (!status || status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  const getTabCounts = () => {
    return {
      all: bookings.length,
      pendente: bookings.filter((b) => b.status === "pendente").length,
      confirmada: bookings.filter((b) => b.status === "confirmada").length,
      concluida: bookings.filter((b) => b.status === "concluida").length,
    }
  }

  const tabCounts = getTabCounts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Reservas</h2>
          <p className="text-gray-600">Gerencie seus compromissos e reservas de clientes</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="pendente">Pendentes ({tabCounts.pendente})</TabsTrigger>
          <TabsTrigger value="confirmada">Confirmadas ({tabCounts.confirmada})</TabsTrigger>
          <TabsTrigger value="concluida">Concluídas ({tabCounts.concluida})</TabsTrigger>
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
                        <p className="text-sm text-gray-500">Reserva #{booking.id}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {booking.status === "pendente" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmada")}>
                                <Check className="h-4 w-4 mr-2" />
                                Confirmar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "cancelada")}>
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                              </DropdownMenuItem>
                            </>
                          )}
                          {booking.status === "confirmada" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "concluida")}>
                                <Check className="h-4 w-4 mr-2" />
                                Marcar como concluído
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "cancelada")}>
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Entrar em contato com o cliente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{format(booking.date, "d/MM/yyyy")}</p>
                          <p className="text-sm text-gray-600">{format(booking.date, "EEEE", {locale: ptBR})}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{formatTime(booking.time)}</p>
                          <p className="text-sm text-gray-600">{booking.duration} minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 p-2 rounded-full">                          
                          <Wallet className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">R$ {booking.price}</p>
                          <p className="text-sm text-gray-600">Taxa de serviço</p>
                        </div>
                      </div>
                    </div>

                    {/* Client Information */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Informações do cliente</h4>
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
                            <strong>Anotações:</strong> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    {booking.status === "pendente" && (
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" onClick={() => handleStatusChange(booking.id, "confirmada")}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(booking.id, "cancelada")}
                          className="bg-transparent"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
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
                  Sem reservas {activeTab === "all" ? "" : activeTab}
                </h3>
                <p className="text-gray-500 text-center">
                  {activeTab === "all" ? "Você ainda não tem nenhuma reserva" : `Sem reservas ${activeTab} no momento`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
