import { NextRequest, NextResponse } from 'next/server'

interface TrialUser {
  fullName: string
  email: string
  company?: string
  useCase?: string
  trialStartDate: string
  trialEndDate: string
}

// In-memory storage for trial users (in production, use a database)
const trialUsers = new Map<string, TrialUser>()

// POST /api/trial - Register a new trial user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, company, useCase } = body

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (trialUsers.has(email)) {
      const existingUser = trialUsers.get(email)!
      return NextResponse.json({
        message: 'Trial already active',
        user: existingUser,
        isExisting: true
      })
    }

    // Calculate trial dates
    const trialStartDate = new Date().toISOString()
    const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

    // Create new trial user
    const newUser: TrialUser = {
      fullName,
      email,
      company,
      useCase,
      trialStartDate,
      trialEndDate
    }

    // Store user
    trialUsers.set(email, newUser)

    console.log(`New trial user registered: ${email}`)

    // In production, you would:
    // 1. Store in database
    // 2. Send welcome email
    // 3. Create user account
    // 4. Set up analytics tracking

    return NextResponse.json({
      message: 'Trial started successfully',
      user: newUser,
      isExisting: false
    }, { status: 201 })

  } catch (error) {
    console.error('Trial registration error:', error)
    return NextResponse.json(
      { error: 'Failed to start trial' },
      { status: 500 }
    )
  }
}

// GET /api/trial?email={email} - Get trial user info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const user = trialUsers.get(email)

    if (!user) {
      return NextResponse.json(
        { error: 'Trial user not found' },
        { status: 404 }
      )
    }

    // Check if trial has expired
    const now = new Date()
    const endDate = new Date(user.trialEndDate)
    const isExpired = now > endDate

    // Calculate days remaining
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      user,
      isExpired,
      daysRemaining: isExpired ? 0 : daysRemaining
    })

  } catch (error) {
    console.error('Trial lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve trial info' },
      { status: 500 }
    )
  }
}
