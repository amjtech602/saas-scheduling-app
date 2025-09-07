"use client"

//import { useAuth } from "@/components/auth-context"
import { BillingDashboard } from "@/components/billing/billing-dashboard"
import { ServiceList } from "@/components/services/service-list"
import { SubscriptionOverview } from "@/components/subscription/subscription-overview"
import { TimetableManager } from "@/components/timetable/timetable-manager"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from '@/context/UserContext'
import {
    Bell,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    LogOut,
    Menu,
    Plus,
    Settings,
    Users,
    X,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { BookingManagement } from "./booking-management"

const mockAppointments = [
    {
        id: "1",
        clientName: "Sarah Johnson",
        service: "Business Consultation",
        time: "9:00",
        duration: 60,
        price: 150,
        status: "confirmado",
        date: "2024-01-15",
    },
    {
        id: "2",
        clientName: "Mike Chen",
        service: "Follow-up Session",
        time: "14:00",
        duration: 30,
        price: 75,
        status: "confirmado",
        date: "2024-01-15",
    },
    {
        id: "3",
        clientName: "Alex Rivera",
        service: "Strategy Planning",
        time: "16:30",
        duration: 90,
        price: 200,
        status: "pendente",
        date: "2024-01-15",
    },
]

const mockServices = [
    { id: "1", name: "Business Consultation", price: 150, duration: 60, bookings: 12 },
    { id: "2", name: "Follow-up Session", price: 75, duration: 30, bookings: 8 },
    { id: "3", name: "Strategy Planning", price: 200, duration: 90, bookings: 5 },
    { id: "4", name: "Quick Call", price: 50, duration: 15, bookings: 15 },
]

export function Dashboard() {
    const { data: session, status } = useSession();
    //const { user, logout } = useAuth()
    const { user, loading, logout } = useUser();
    const [activeTab, setActiveTab] = useState("overview")
    const [currentWeek, setCurrentWeek] = useState(new Date())
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const getWeekDates = (date: Date) => {
        const week = []
        const startDate = new Date(date)
        const day = startDate.getDay()
        const diff = startDate.getDate() - day
        startDate.setDate(diff)

        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate)
            day.setDate(startDate.getDate() + i)
            week.push(day)
        }
        return week
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("pt-BR", {
            weekday: "short",
            month: "short",
            day: "numeric",
        })
    }

    const navigateWeek = (direction: "prev" | "next") => {
        const newDate = new Date(currentWeek)
        newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
        setCurrentWeek(newDate)
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">SchedulePro</h1>
                                <p className="text-sm text-gray-500 hidden sm:block">{user?.businessName || user?.firstName}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                                <Plus className="h-4 w-4 mr-2" />
                                Quick Book
                            </Button>
                            <div className="mx-5 text-gray-700 font-semibold text-xs">
                                <div>
                                    {/* {session?.user?.name} */}
                                      {user?.firstName} 
                                </div>
                                <div>
                                    {/* {session?.user?.email} */}
                                       {user?.email} 
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => logout()}>
                            {/* <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => signOut({ callbackUrl: "/" })}> */}
                            {/* <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => signOut()}> */}
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="sm:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Menu Tabs  */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 sm:hidden" onClick={() => setMobileMenuOpen(false)}>
                        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold">Navigation</h2>
                            </div>
                            <nav className="p-4 space-y-2">
                                {[
                                    { id: "overview", label: "Visão Geral", icon: Calendar },
                                    { id: "schedule", label: "Programação", icon: Clock },
                                    { id: "bookings", label: "Reservas", icon: Bell },
                                    { id: "services", label: "Serviços", icon: Settings },
                                    { id: "timetable", label: "Horários", icon: Clock },
                                    { id: "clients", label: "Clients", icon: Users },
                                    { id: "billing", label: "Billing", icon: CreditCard },
                                    { id: "earnings", label: "Earnings", icon: DollarSign },
                                ].map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => {
                                            setActiveTab(id)
                                            setMobileMenuOpen(false)
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === id
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                                <div className="pt-4 border-t">
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => logout()}>
                                        <LogOut className="h-4 w-4 mr-3" />
                                        Sign Out
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </div>
                )}

                <nav className="flex space-x-2 sm:space-x-8 mb-6 sm:mb-8 overflow-x-auto pb-2 sm:pb-0 sm:hidden">
                    {[
                        { id: "overview", label: "Visão Geral", icon: Calendar },
                        { id: "schedule", label: "Programação", icon: Clock },
                        { id: "bookings", label: "Reservas", icon: Bell },
                        { id: "services", label: "Serviços", icon: Settings },
                        { id: "timetable", label: "Horários", icon: Clock },
                        { id: "clients", label: "Clients", icon: Users },
                        { id: "billing", label: "Billing", icon: CreditCard },
                        { id: "earnings", label: "Earnings", icon: DollarSign },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === id ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden xs:inline">{label}</span>
                        </button>
                    ))}
                </nav>

                <nav className="hidden sm:flex space-x-8 mb-8">
                    {[
                        { id: "overview", label: "Visão Geral", icon: Calendar },
                        { id: "schedule", label: "Programação", icon: Clock },
                        { id: "bookings", label: "Reservas", icon: Bell },
                        { id: "services", label: "Serviços", icon: Settings },
                        { id: "timetable", label: "Horários", icon: Clock },
                        { id: "clients", label: "Clients", icon: Users },
                        { id: "billing", label: "Billing", icon: CreditCard },
                        { id: "earnings", label: "Earnings", icon: DollarSign },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === id ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                {/* Dashboard Content */}
                {/* Overview  */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Agendamentos do Dia</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3</div>
                                    <p className="text-xs text-muted-foreground">+2 de ontem</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground">8 horas reservadas</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">5</div>
                                    <p className="text-xs text-muted-foreground">2 mais populares</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">48</div>
                                    <p className="text-xs text-muted-foreground">+5 neste mês</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Agendamentos do Dia</CardTitle>
                                    <CardDescription>Seus compromissos para hoje</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {mockAppointments.map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="flex items-center space-x-3 sm:space-x-4 p-3 bg-blue-50 rounded-lg"
                                        >
                                            <div className="text-sm font-medium text-blue-700 min-w-[60px]">{appointment.time}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {appointment.service} - {appointment.clientName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {appointment.duration} min • R$ {appointment.price}
                                                </p>
                                            </div>
                                            <Badge variant={appointment.status === "confirmado" ? "default" : "secondary"} className="text-xs">
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Ações Rápidas</CardTitle>
                                    <CardDescription>Tarefas e atalhos comuns</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        className="w-full justify-start bg-transparent text-sm sm:text-base cursor-pointer"
                                        variant="outline"
                                        onClick={() => setActiveTab("services")}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar novo serviço
                                    </Button>
                                    <Button className="w-full justify-start bg-transparent text-sm sm:text-base cursor-pointer" variant="outline">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Bloquear intervalo de tempo
                                    </Button>
                                    <Button className="w-full justify-start bg-transparent text-sm sm:text-base cursor-pointer" variant="outline">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Disponibilidade de atualização
                                    </Button>
                                    <Button
                                        className="w-full justify-start bg-transparent text-sm sm:text-base cursor-pointer"
                                        variant="outline"
                                        onClick={() => setActiveTab("clients")}
                                    >
                                        <Users className="h-4 w-4 mr-2" />
                                        Ver lista de clientes
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* schedule  */}
                {activeTab === "schedule" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                                    <div>
                                        <CardTitle className="text-lg sm:text-xl">Programação Semanal</CardTitle>
                                        <CardDescription>Gerencie seus compromissos e disponibilidade</CardDescription>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium px-2 sm:px-4 text-center">
                                            {currentWeek.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                                        </span>
                                        <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="hidden sm:grid sm:grid-cols-7 gap-4">
                                    {getWeekDates(currentWeek).map((date, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="text-center">
                                                <p className="text-sm font-medium">{formatDate(date)}</p>
                                            </div>
                                            <div className="space-y-1 min-h-[200px] bg-gray-50 rounded-lg p-2">
                                                {index === 1 && (
                                                    <div className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded text-xs">
                                                        <p className="font-medium">9:00</p>
                                                        <p>Sarah J.</p>
                                                        <p className="text-gray-600">Consulta</p>
                                                    </div>
                                                )}
                                                {index === 1 && (
                                                    <div className="bg-green-100 border-l-4 border-green-500 p-2 rounded text-xs">
                                                        <p className="font-medium">14:00</p>
                                                        <p>Mike C.</p>
                                                        <p className="text-gray-600">Acompanhamento</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="sm:hidden space-y-4">
                                    {getWeekDates(currentWeek).map((date, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-medium">{formatDate(date)}</h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {index === 1 ? "2 appointments" : "Available"}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2">
                                                {index === 1 && (
                                                    <>
                                                        <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="font-medium text-sm">9:00 AM - Sarah J.</p>
                                                                    <p className="text-xs text-gray-600">Business Consultation</p>
                                                                </div>
                                                                <Badge className="text-xs">Confirmed</Badge>
                                                            </div>
                                                        </div>
                                                        <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="font-medium text-sm">2:00 PM - Mike C.</p>
                                                                    <p className="text-xs text-gray-600">Follow-up Session</p>
                                                                </div>
                                                                <Badge className="text-xs">Confirmed</Badge>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {index !== 1 && (
                                                    <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "bookings" && <BookingManagement />}

                {activeTab === "services" && <ServiceList />}

                {activeTab === "timetable" && <TimetableManager />}

                {activeTab === "clients" && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold">Clients</h2>
                                <p className="text-gray-600">Manage your client relationships</p>
                            </div>
                            <Button className="w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Client
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Recent Clients</CardTitle>
                                <CardDescription>Your most recent client interactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { name: "Sarah Johnson", email: "sarah@example.com", lastBooking: "Today", totalBookings: 5 },
                                        { name: "Mike Chen", email: "mike@example.com", lastBooking: "Yesterday", totalBookings: 3 },
                                        { name: "Alex Rivera", email: "alex@example.com", lastBooking: "2 days ago", totalBookings: 8 },
                                        { name: "Emma Davis", email: "emma@example.com", lastBooking: "1 week ago", totalBookings: 2 },
                                    ].map((client, index) => (
                                        <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg">
                                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                                <AvatarFallback className="text-sm">
                                                    {client.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm sm:text-base truncate">{client.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-500 truncate">{client.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs sm:text-sm font-medium">{client.totalBookings} reservas</p>
                                                <p className="text-xs text-gray-500">Last: {client.lastBooking}</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                                                View
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "billing" && <SubscriptionOverview />}

                {activeTab === "earnings" && <BillingDashboard />}

                {/* Placeholder for other tabs */}
                {activeTab !== "overview" &&
                    activeTab !== "schedule" &&
                    activeTab !== "bookings" &&
                    activeTab !== "services" &&
                    activeTab !== "timetable" &&
                    activeTab !== "clients" &&
                    activeTab !== "billing" &&
                    activeTab !== "earnings" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="capitalize">{activeTab}</CardTitle>
                                <CardDescription>
                                    {activeTab === "schedule" && "Manage your daily and weekly schedule"}
                                    {activeTab === "services" && "Configure your services and pricing"}
                                    {activeTab === "clients" && "View and manage your client base"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management coming in the next update...
                                </p>
                            </CardContent>
                        </Card>
                    )}
            </div>
        </div>
    )
}
