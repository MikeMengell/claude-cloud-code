import { NextRequest, NextResponse } from 'next/server'
import { UsageStats } from '@/lib/types'

/**
 * Usage tracking API for free trial management
 * In production, this would integrate with a database and authentication
 */

// Mock storage - In production, use a database
const usageStore = new Map<string, UsageStats>()

export async function GET(request: NextRequest) {
  // In production, get userId from authenticated session
  const userId = request.nextUrl.searchParams.get('userId') || 'anonymous'

  let usage = usageStore.get(userId)

  // Initialize usage for new users
  if (!usage) {
    usage = {
      user_id: userId,
      conversions_used: 0,
      conversions_limit: 10, // Free tier limit
      plan: 'free',
      reset_date: getNextMonthDate()
    }
    usageStore.set(userId, usage)
  }

  // Check if reset date has passed
  if (new Date() > new Date(usage.reset_date)) {
    usage.conversions_used = 0
    usage.reset_date = getNextMonthDate()
    usageStore.set(userId, usage)
  }

  return NextResponse.json({
    success: true,
    usage: usage,
    remaining: usage.conversions_limit - usage.conversions_used,
    percentage_used: Math.round((usage.conversions_used / usage.conversions_limit) * 100)
  })
}

export async function POST(request: NextRequest) {
  try {
    const { userId = 'anonymous', increment = 1 } = await request.json()

    let usage = usageStore.get(userId)

    if (!usage) {
      usage = {
        user_id: userId,
        conversions_used: 0,
        conversions_limit: 10,
        plan: 'free',
        reset_date: getNextMonthDate()
      }
    }

    // Check if user has exceeded limit
    if (usage.conversions_used >= usage.conversions_limit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Conversion limit reached',
          message: 'You have reached your monthly conversion limit. Please upgrade your plan.',
          usage: usage
        },
        { status: 429 }
      )
    }

    // Increment usage
    usage.conversions_used += increment
    usageStore.set(userId, usage)

    return NextResponse.json({
      success: true,
      usage: usage,
      remaining: usage.conversions_limit - usage.conversions_used
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update usage' },
      { status: 500 }
    )
  }
}

function getNextMonthDate(): string {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}
