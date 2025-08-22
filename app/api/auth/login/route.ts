import { type NextRequest, NextResponse } from "next/server"
import type { LoginRequest, ApiResponse, User } from "@/lib/api-types"

/**
 * POST /api/auth/login
 *
 * Authenticates a user with email and password
 *
 * Required attributes:
 * - email: string (valid email format)
 * - password: string (minimum 6 characters)
 *
 * Response:
 * - success: boolean
 * - data: User object with JWT token
 * - error: string (if authentication fails)
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // TODO: Replace with actual database authentication
    // Mock authentication logic
    const mockUser: User = {
      id: "1",
      email: body.email,
      firstName: "John",
      lastName: "Doe",
      timezone: "America/New_York",
      role: "professional",
      subscription: {
        plan: "professional",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // TODO: Generate actual JWT token
    const token = "mock-jwt-token"

    return NextResponse.json<ApiResponse<User & { token: string }>>({
      success: true,
      data: { ...mockUser, token },
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
