import { type NextRequest, NextResponse } from "next/server"
import type { WorkingHours, UpdateWorkingHoursRequest, ApiResponse } from "@/lib/api-types"

/**
 * GET /api/availability/working-hours
 *
 * Retrieves working hours for all days of the week
 *
 * Response:
 * - success: boolean
 * - data: WorkingHours[] array (7 items, one for each day)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from JWT token
    // TODO: Query database for working hours

    // Mock working hours data
    const mockWorkingHours: WorkingHours[] = [
      {
        id: "1",
        userId: "1",
        dayOfWeek: 1, // Monday
        isAvailable: true,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "17:00" },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // ... other days
    ]

    return NextResponse.json<ApiResponse<WorkingHours[]>>({
      success: true,
      data: mockWorkingHours,
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
 * PUT /api/availability/working-hours
 *
 * Updates working hours for a specific day
 *
 * Required attributes:
 * - dayOfWeek: number (0-6, Sunday-Saturday)
 * - isAvailable: boolean
 * - timeSlots: TimeSlot[] array
 *
 * Response:
 * - success: boolean
 * - data: Updated WorkingHours object
 * - error: string (if update fails)
 */
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateWorkingHoursRequest = await request.json()

    // Validate required fields
    if (body.dayOfWeek === undefined || body.isAvailable === undefined || !body.timeSlots) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Day of week, availability status, and time slots are required",
        },
        { status: 400 },
      )
    }

    // Validate day of week
    if (body.dayOfWeek < 0 || body.dayOfWeek > 6) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Day of week must be between 0 (Sunday) and 6 (Saturday)",
        },
        { status: 400 },
      )
    }

    // TODO: Get user ID from JWT token
    // TODO: Validate time slots don't overlap
    // TODO: Update working hours in database

    // Mock working hours update
    const updatedWorkingHours: WorkingHours = {
      id: "1",
      userId: "1",
      dayOfWeek: body.dayOfWeek,
      isAvailable: body.isAvailable,
      timeSlots: body.timeSlots,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json<ApiResponse<WorkingHours>>({
      success: true,
      data: updatedWorkingHours,
      message: "Working hours updated successfully",
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
