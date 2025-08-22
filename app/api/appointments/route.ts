import { type NextRequest, NextResponse } from "next/server"
import type { Appointment, CreateAppointmentRequest, ApiResponse, PaginatedResponse } from "@/lib/api-types"

/**
 * GET /api/appointments
 *
 * Retrieves appointments for the authenticated user
 *
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - status: string (pending|confirmed|completed|cancelled|no_show)
 * - startDate: string (ISO date, filter from this date)
 * - endDate: string (ISO date, filter to this date)
 * - serviceId: string (filter by service)
 * - clientId: string (filter by client)
 *
 * Response:
 * - success: boolean
 * - data: Appointment[] array with populated service and client data
 * - pagination: object with page info
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // TODO: Get user ID from JWT token
    // TODO: Query database with filters and pagination
    // TODO: Include service and client data in response

    // Mock appointments data
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        userId: "1",
        serviceId: "1",
        clientId: "1",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "card",
        notes: "Initial consultation",
        reminderSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        service: {
          id: "1",
          userId: "1",
          name: "Business Consultation",
          description: "Strategic business planning",
          duration: 60,
          price: 15000,
          currency: "USD",
          isActive: true,
          requiresPreparation: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        client: {
          id: "1",
          userId: "1",
          email: "client@example.com",
          name: "Jane Smith",
          phone: "+1234567890",
          totalBookings: 3,
          totalSpent: 45000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ]

    return NextResponse.json<PaginatedResponse<Appointment>>({
      success: true,
      data: mockAppointments,
      pagination: {
        page,
        limit,
        total: 1,
        totalPages: 1,
      },
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/appointments
 *
 * Creates a new appointment (used by public booking form)
 *
 * Required attributes:
 * - serviceId: string
 * - clientEmail: string
 * - clientName: string
 * - startTime: string (ISO datetime)
 *
 * Optional attributes:
 * - clientPhone: string
 * - notes: string
 * - paymentMethod: 'card' | 'pay_later'
 * - paymentDetails: object (if paying upfront)
 *
 * Response:
 * - success: boolean
 * - data: Created Appointment object
 * - error: string (if creation fails)
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateAppointmentRequest = await request.json()

    // Validate required fields
    if (!body.serviceId || !body.clientEmail || !body.clientName || !body.startTime) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Service ID, client email, client name, and start time are required",
        },
        { status: 400 },
      )
    }

    // Validate start time is in the future
    const startTime = new Date(body.startTime)
    if (startTime <= new Date()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Appointment time must be in the future",
        },
        { status: 400 },
      )
    }

    // TODO: Validate service exists and is active
    // TODO: Check professional availability
    // TODO: Check for conflicts with existing appointments
    // TODO: Create or find client by email
    // TODO: Process payment if paymentMethod is 'card'
    // TODO: Send confirmation email

    // Mock appointment creation
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      userId: "1", // TODO: Get from service
      serviceId: body.serviceId,
      clientId: "1", // TODO: Get or create client
      startTime: body.startTime,
      endTime: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // TODO: Calculate from service duration
      status: "pending",
      paymentStatus: body.paymentMethod === "card" ? "paid" : "unpaid",
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      reminderSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      service: {
        id: body.serviceId,
        userId: "1",
        name: "Business Consultation",
        description: "Strategic business planning",
        duration: 60,
        price: 15000,
        currency: "USD",
        isActive: true,
        requiresPreparation: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      client: {
        id: "1",
        userId: "1",
        email: body.clientEmail,
        name: body.clientName,
        phone: body.clientPhone,
        totalBookings: 1,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }

    return NextResponse.json<ApiResponse<Appointment>>(
      {
        success: true,
        data: newAppointment,
        message: "Appointment created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
