import { type NextRequest, NextResponse } from "next/server"
import type { RegisterRequest, ApiResponse, User } from "@/lib/api-types"

/**
 * POST /api/auth/register
 *
 * Creates a new user account
 *
 * Required attributes:
 * - email: string (valid email format, must be unique)
 * - password: string (minimum 6 characters)
 * - firstName: string
 * - lastName: string
 *
 * Optional attributes:
 * - phone: string
 * - timezone: string (defaults to UTC)
 *
 * Response:
 * - success: boolean
 * - data: User object with JWT token
 * - error: string (if registration fails)
 */
export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()

    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email, password, first name, and last name are required",
        },
        { status: 400 },
      )
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    // TODO: Check if email already exists in database
    // TODO: Hash password before storing
    // TODO: Create user in database

    // Mock user creation
    const newUser: User = {
      id: Date.now().toString(),
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      timezone: body.timezone || "UTC",
      role: "professional",
      subscription: {
        plan: "basic",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14-day trial
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // TODO: Generate actual JWT token
    const token = "mock-jwt-token"

    return NextResponse.json<ApiResponse<User & { token: string }>>(
      {
        success: true,
        data: { ...newUser, token },
        message: "Account created successfully",
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
