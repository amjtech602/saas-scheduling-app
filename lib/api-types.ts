// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  timezone: string
  role: "professional" | "admin"
  subscription: {
    plan: "basic" | "professional" | "complete"
    status: "active" | "cancelled" | "past_due"
    currentPeriodEnd: string
  }
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  timezone?: string
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

export interface Service {
  id: string
  userId: string
  name: string
  description: string
  duration: number // in minutes
  price: number // in cents
  currency: string
  category?: string
  isActive: boolean
  requiresPreparation: boolean
  preparationTime?: number // in minutes
  maxBookingsPerDay?: number
  bufferTime?: number // in minutes
  createdAt: string
  updatedAt: string
}

export interface CreateServiceRequest {
  name: string
  description: string
  duration: number
  price: number
  currency?: string
  category?: string
  requiresPreparation?: boolean
  preparationTime?: number
  maxBookingsPerDay?: number
  bufferTime?: number
}

// ============================================================================
// APPOINTMENT/BOOKING TYPES
// ============================================================================

export interface Appointment {
  id: string
  userId: string // professional ID
  serviceId: string
  clientId: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  paymentStatus: "unpaid" | "paid" | "refunded"
  paymentMethod?: "card" | "cash" | "bank_transfer"
  notes?: string
  clientNotes?: string
  reminderSent: boolean
  createdAt: string
  updatedAt: string
  service: Service
  client: Client
}

export interface CreateAppointmentRequest {
  serviceId: string
  clientEmail: string
  clientName: string
  clientPhone?: string
  startTime: string
  notes?: string
  paymentMethod?: "card" | "pay_later"
  paymentDetails?: any
}

export interface UpdateAppointmentRequest {
  status?: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  paymentStatus?: "unpaid" | "paid" | "refunded"
  notes?: string
  startTime?: string
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface Client {
  id: string
  userId: string // professional ID
  email: string
  name: string
  phone?: string
  notes?: string
  totalBookings: number
  totalSpent: number
  lastBooking?: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// AVAILABILITY TYPES
// ============================================================================

export interface WorkingHours {
  id: string
  userId: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  isAvailable: boolean
  timeSlots: TimeSlot[]
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  startTime: string // HH:MM format
  endTime: string // HH:MM format
}

export interface BlockedTime {
  id: string
  userId: string
  title: string
  startTime: string
  endTime: string
  isRecurring: boolean
  recurringPattern?: "daily" | "weekly" | "monthly"
  recurringEndDate?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateWorkingHoursRequest {
  dayOfWeek: number
  isAvailable: boolean
  timeSlots: TimeSlot[]
}

export interface CreateBlockedTimeRequest {
  title: string
  startTime: string
  endTime: string
  isRecurring?: boolean
  recurringPattern?: "daily" | "weekly" | "monthly"
  recurringEndDate?: string
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "requires_payment_method" | "requires_confirmation" | "succeeded" | "canceled"
  clientSecret: string
}

export interface Subscription {
  id: string
  userId: string
  plan: "basic" | "professional" | "complete"
  status: "active" | "cancelled" | "past_due" | "unpaid"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  appointmentId?: string
  type: "booking_payment" | "subscription_payment" | "refund" | "payout"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  description: string
  createdAt: string
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsData {
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  bookings: {
    total: number
    thisMonth: number
    pending: number
    confirmed: number
    completed: number
  }
  clients: {
    total: number
    new: number
    returning: number
  }
  popularServices: Array<{
    serviceId: string
    serviceName: string
    bookings: number
    revenue: number
  }>
  revenueChart: Array<{
    date: string
    revenue: number
    bookings: number
  }>
}
