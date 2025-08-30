// API Service Layer for Scheduling SaaS Application
// Provides type-safe client-side API interactions with error handling and authentication

import type {
  ApiResponse,
  Appointment,
  BlockedTime,
  Client,
  DashboardAnalytics,
  PaymentMethod,
  Service,
  Subscription,
  User,
  WorkingHours,
} from "./api-types"

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Generic API request handler with error handling and authentication
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  // Get auth token from localStorage (in real app, use secure storage)
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status, errorData.code)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Network error occurred", 0)
  }
}

// Authentication Service
export const authService = {
  /**
   * User login
   * @param email - User email address
   * @param password - User password
   * @returns Promise<ApiResponse<{ user: User; token: string }>>
   */
  async login(email: string, password: string) {
    const response = await apiRequest<ApiResponse<{ user: User; token: string }>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    // Store token in localStorage (in real app, use secure storage)
    if (response.success && response.data?.token) {
      localStorage.setItem("auth_token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response
  },

  /**
   * User registration
   * @param userData - User registration data
   * @returns Promise<ApiResponse<{ user: User; token: string }>>
   */
  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    businessName?: string
    phone?: string
  }) {
    const response = await apiRequest<ApiResponse<{ user: User; token: string }>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (response.success && response.data?.token) {
      localStorage.setItem("auth_token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response
  },

  /**
   * User logout
   * Clears local storage and invalidates token
   */
  logout() {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  },

  /**
   * Get current user from localStorage
   * @returns User | null
   */
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },
}

// Services Management
export const servicesService = {
  /**
   * Get all services for the authenticated professional
   * @returns Promise<ApiResponse<Service[]>>
   */
  async getServices() {
    return apiRequest<ApiResponse<Service[]>>("/services")
  },

  /**
   * Create a new service
   * @param serviceData - Service creation data
   * @returns Promise<ApiResponse<Service>>
   */
  async createService(serviceData: {
    name: string
    description?: string
    duration: number
    price: number
    category?: string
    isActive?: boolean
    maxAdvanceBooking?: number
    minAdvanceBooking?: number
    bufferTime?: number
    preparationRequirements?: string[]
    maxBookingsPerDay?: number
  }) {
    return apiRequest<ApiResponse<Service>>("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  },

  /**
   * Update an existing service
   * @param id - Service ID
   * @param serviceData - Updated service data
   * @returns Promise<ApiResponse<Service>>
   */
  async updateService(id: string, serviceData: Partial<Service>) {
    return apiRequest<ApiResponse<Service>>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    })
  },

  /**
   * Delete a service
   * @param id - Service ID
   * @returns Promise<ApiResponse<void>>
   */
  async deleteService(id: string) {
    return apiRequest<ApiResponse<void>>(`/services/${id}`, {
      method: "DELETE",
    })
  },
}

// Appointments Management
export const appointmentsService = {
  /**
   * Get appointments with optional filtering
   * @param params - Query parameters for filtering
   * @returns Promise<ApiResponse<Appointment[]>>
   */
  async getAppointments(params?: {
    startDate?: string
    endDate?: string
    status?: string
    serviceId?: string
    clientId?: string
  }) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiRequest<ApiResponse<Appointment[]>>(`/appointments${queryString}`)
  },

  /**
   * Create a new appointment (booking)
   * @param appointmentData - Appointment creation data
   * @returns Promise<ApiResponse<Appointment>>
   */
  async createAppointment(appointmentData: {
    serviceId: string
    clientName: string
    clientEmail: string
    clientPhone?: string
    startTime: string
    endTime: string
    notes?: string
    paymentStatus?: "pending" | "paid" | "failed"
    paymentMethod?: string
  }) {
    return apiRequest<ApiResponse<Appointment>>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    })
  },

  /**
   * Update appointment status
   * @param id - Appointment ID
   * @param status - New appointment status
   * @returns Promise<ApiResponse<Appointment>>
   */
  async updateAppointmentStatus(id: string, status: "confirmed" | "cancelled" | "completed" | "no-show") {
    return apiRequest<ApiResponse<Appointment>>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },

  /**
   * Cancel an appointment
   * @param id - Appointment ID
   * @param reason - Cancellation reason
   * @returns Promise<ApiResponse<Appointment>>
   */
  async cancelAppointment(id: string, reason?: string) {
    return apiRequest<ApiResponse<Appointment>>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelled", cancellationReason: reason }),
    })
  },

  /**
   * Get available time slots for a service
   * @param serviceId - Service ID
   * @param date - Date to check availability (YYYY-MM-DD)
   * @returns Promise<ApiResponse<string[]>>
   */
  async getAvailableSlots(serviceId: string, date: string) {
    return apiRequest<ApiResponse<string[]>>(`/appointments/available-slots?serviceId=${serviceId}&date=${date}`)
  },
}

// Availability Management
export const availabilityService = {
  /**
   * Get working hours for the professional
   * @returns Promise<ApiResponse<WorkingHours[]>>
   */
  async getWorkingHours() {
    return apiRequest<ApiResponse<WorkingHours[]>>("/availability/working-hours")
  },

  /**
   * Update working hours
   * @param workingHours - Array of working hours for each day
   * @returns Promise<ApiResponse<WorkingHours[]>>
   */
  async updateWorkingHours(workingHours: WorkingHours[]) {
    return apiRequest<ApiResponse<WorkingHours[]>>("/availability/working-hours", {
      method: "PUT",
      body: JSON.stringify({ workingHours }),
    })
  },

  /**
   * Get blocked times
   * @param startDate - Start date for query (optional)
   * @param endDate - End date for query (optional)
   * @returns Promise<ApiResponse<BlockedTime[]>>
   */
  async getBlockedTimes(startDate?: string, endDate?: string) {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    const queryString = params.toString() ? "?" + params.toString() : ""

    return apiRequest<ApiResponse<BlockedTime[]>>(`/availability/blocked-times${queryString}`)
  },

  /**
   * Create a blocked time period
   * @param blockedTimeData - Blocked time creation data
   * @returns Promise<ApiResponse<BlockedTime>>
   */
  async createBlockedTime(blockedTimeData: {
    title: string
    startTime: string
    endTime: string
    isRecurring?: boolean
    recurringPattern?: "daily" | "weekly" | "monthly"
    recurringEndDate?: string
  }) {
    return apiRequest<ApiResponse<BlockedTime>>("/availability/blocked-times", {
      method: "POST",
      body: JSON.stringify(blockedTimeData),
    })
  },

  /**
   * Delete a blocked time
   * @param id - Blocked time ID
   * @returns Promise<ApiResponse<void>>
   */
  async deleteBlockedTime(id: string) {
    return apiRequest<ApiResponse<void>>(`/availability/blocked-times/${id}`, {
      method: "DELETE",
    })
  },
}

// Clients Management
export const clientsService = {
  /**
   * Get all clients for the professional
   * @returns Promise<ApiResponse<Client[]>>
   */
  async getClients() {
    return apiRequest<ApiResponse<Client[]>>("/clients")
  },

  /**
   * Get client by ID with appointment history
   * @param id - Client ID
   * @returns Promise<ApiResponse<Client & { appointments: Appointment[] }>>
   */
  async getClientById(id: string) {
    return apiRequest<ApiResponse<Client & { appointments: Appointment[] }>>(`/clients/${id}`)
  },

  /**
   * Update client information
   * @param id - Client ID
   * @param clientData - Updated client data
   * @returns Promise<ApiResponse<Client>>
   */
  async updateClient(id: string, clientData: Partial<Client>) {
    return apiRequest<ApiResponse<Client>>(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    })
  },
}

// Payment Management
export const paymentsService = {
  /**
   * Get current subscription details
   * @returns Promise<ApiResponse<Subscription>>
   */
  async getSubscription() {
    return apiRequest<ApiResponse<Subscription>>("/payments/subscription")
  },

  /**
   * Update subscription plan
   * @param planId - New plan ID
   * @returns Promise<ApiResponse<Subscription>>
   */
  async updateSubscription(planId: string) {
    return apiRequest<ApiResponse<Subscription>>("/payments/subscription", {
      method: "PUT",
      body: JSON.stringify({ planId }),
    })
  },

  /**
   * Cancel subscription
   * @returns Promise<ApiResponse<Subscription>>
   */
  async cancelSubscription() {
    return apiRequest<ApiResponse<Subscription>>("/payments/subscription", {
      method: "DELETE",
    })
  },

  /**
   * Get payment methods
   * @returns Promise<ApiResponse<PaymentMethod[]>>
   */
  async getPaymentMethods() {
    return apiRequest<ApiResponse<PaymentMethod[]>>("/payments/methods")
  },

  /**
   * Add new payment method
   * @param paymentMethodData - Payment method data
   * @returns Promise<ApiResponse<PaymentMethod>>
   */
  async addPaymentMethod(paymentMethodData: {
    type: "card" | "bank_account"
    cardNumber?: string
    expiryMonth?: number
    expiryYear?: number
    cvv?: string
    cardholderName?: string
  }) {
    return apiRequest<ApiResponse<PaymentMethod>>("/payments/methods", {
      method: "POST",
      body: JSON.stringify(paymentMethodData),
    })
  },

  /**
   * Process payment for an appointment
   * @param appointmentId - Appointment ID
   * @param paymentData - Payment processing data
   * @returns Promise<ApiResponse<{ success: boolean; transactionId: string }>>
   */
  async processAppointmentPayment(
    appointmentId: string,
    paymentData: {
      paymentMethodId: string
      amount: number
    },
  ) {
    return apiRequest<ApiResponse<{ success: boolean; transactionId: string }>>("/payments/process", {
      method: "POST",
      body: JSON.stringify({ appointmentId, ...paymentData }),
    })
  },
}

// Analytics and Reports
export const analyticsService = {
  /**
   * Get dashboard analytics
   * @param period - Time period for analytics ('week' | 'month' | 'quarter' | 'year')
   * @returns Promise<ApiResponse<DashboardAnalytics>>
   */
  async getDashboardAnalytics(period: "week" | "month" | "quarter" | "year" = "month") {
    return apiRequest<ApiResponse<DashboardAnalytics>>(`/analytics/dashboard?period=${period}`)
  },

  /**
   * Get revenue report
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Promise<ApiResponse<any>>
   */
  async getRevenueReport(startDate: string, endDate: string) {
    return apiRequest<ApiResponse<any>>(`/analytics/revenue?startDate=${startDate}&endDate=${endDate}`)
  },

  /**
   * Export data to CSV
   * @param type - Type of data to export
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise<Blob>
   */
  async exportData(type: "appointments" | "clients" | "revenue", startDate: string, endDate: string): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/export?type=${type}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      },
    )

    if (!response.ok) {
      throw new ApiError("Export failed", response.status)
    }

    return response.blob()
  },
}

// Utility functions for common operations
export const apiUtils = {
  /**
   * Handle API errors consistently across the app
   * @param error - Error object
   * @returns Formatted error message
   */
  handleError(error: unknown): string {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          authService.logout()
          return "Session expired. Please log in again."
        case 403:
          return "You do not have permission to perform this action."
        case 404:
          return "The requested resource was not found."
        case 422:
          return error.message || "Invalid data provided."
        case 500:
          return "Server error. Please try again later."
        default:
          return error.message || "An unexpected error occurred."
      }
    }
    return "Network error. Please check your connection."
  },

  /**
   * Format date for API requests
   * @param date - Date object or string
   * @returns Formatted date string (YYYY-MM-DD)
   */
  formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  },

  /**
   * Format datetime for API requests
   * @param date - Date object or string
   * @returns Formatted datetime string (ISO 8601)
   */
  formatDateTime(date: Date | string): string {
    return new Date(date).toISOString()
  },
}

// Export all services as a single object for convenience
export const api = {
  auth: authService,
  services: servicesService,
  appointments: appointmentsService,
  availability: availabilityService,
  clients: clientsService,
  payments: paymentsService,
  analytics: analyticsService,
  utils: apiUtils,
}

export default api
