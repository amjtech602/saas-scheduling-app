import { type NextRequest, NextResponse } from "next/server"
import type { Service, CreateServiceRequest, ApiResponse } from "@/lib/api-types"

/**
 * GET /api/services
 *
 * Retrieves all services for the authenticated user
 *
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - category: string (optional filter)
 * - isActive: boolean (optional filter)
 *
 * Response:
 * - success: boolean
 * - data: Service[] array
 * - pagination: object with page info
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
    const category = searchParams.get("category")
    const isActive = searchParams.get("isActive")

    // TODO: Get user ID from JWT token
    // TODO: Query database with filters and pagination

    // Mock services data
    const mockServices: Service[] = [
      {
        id: "1",
        userId: "1",
        name: "Business Consultation",
        description: "Strategic business planning and consultation",
        duration: 60,
        price: 15000, // $150.00 in cents
        currency: "USD",
        category: "Consulting",
        isActive: true,
        requiresPreparation: true,
        preparationTime: 15,
        maxBookingsPerDay: 4,
        bufferTime: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json<ApiResponse<Service[]>>({
      success: true,
      data: mockServices,
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
 * POST /api/services
 *
 * Creates a new service for the authenticated user
 *
 * Required attributes:
 * - name: string
 * - description: string
 * - duration: number (in minutes)
 * - price: number (in cents)
 *
 * Optional attributes:
 * - currency: string (default: 'USD')
 * - category: string
 * - requiresPreparation: boolean
 * - preparationTime: number (in minutes)
 * - maxBookingsPerDay: number
 * - bufferTime: number (in minutes)
 *
 * Response:
 * - success: boolean
 * - data: Created Service object
 * - error: string (if creation fails)
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateServiceRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.duration || !body.price) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Name, description, duration, and price are required",
        },
        { status: 400 },
      )
    }

    // Validate business rules
    if (body.duration < 15) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Service duration must be at least 15 minutes",
        },
        { status: 400 },
      )
    }

    if (body.price < 100) {
      // $1.00 minimum
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Service price must be at least $1.00",
        },
        { status: 400 },
      )
    }

    // TODO: Get user ID from JWT token
    // TODO: Create service in database

    // Mock service creation
    const newService: Service = {
      id: Date.now().toString(),
      userId: "1", // TODO: Get from JWT
      name: body.name,
      description: body.description,
      duration: body.duration,
      price: body.price,
      currency: body.currency || "USD",
      category: body.category,
      isActive: true,
      requiresPreparation: body.requiresPreparation || false,
      preparationTime: body.preparationTime,
      maxBookingsPerDay: body.maxBookingsPerDay,
      bufferTime: body.bufferTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json<ApiResponse<Service>>(
      {
        success: true,
        data: newService,
        message: "Service created successfully",
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
