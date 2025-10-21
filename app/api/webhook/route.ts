import { NextRequest, NextResponse } from 'next/server'
import { WebhookPayload } from '@/lib/types'

/**
 * Webhook endpoint for low-code platform integrations
 * Supports Zapier, Make.com, n8n, etc.
 *
 * Usage:
 * 1. Register this endpoint in your low-code platform
 * 2. Trigger conversions via API
 * 3. Receive real-time notifications when conversions complete
 */

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json()

    // Validate webhook payload
    if (!payload.event || !payload.data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    // In production, you would:
    // 1. Validate webhook signature for security
    // 2. Store webhook configuration per user
    // 3. Send webhooks to registered URLs
    // 4. Handle retry logic for failed webhooks

    console.log('Webhook received:', payload)

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
      eventId: payload.data.conversion_id
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to retrieve webhook configuration
 * Useful for low-code platforms to discover webhook schema
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    webhook_url: `${request.nextUrl.origin}/api/webhook`,
    events: [
      {
        event: 'conversion.completed',
        description: 'Triggered when a bank statement conversion is successfully completed',
        payload_example: {
          event: 'conversion.completed',
          data: {
            conversion_id: 'uuid-v4-string',
            file_name: 'statement.pdf',
            format: 'ai-optimized',
            status: 'completed',
            result: {
              statement: {
                bank: 'Chase Bank',
                account_number: '****1234',
                transactions: []
              }
            },
            timestamp: '2024-01-15T10:30:00Z'
          }
        }
      },
      {
        event: 'conversion.failed',
        description: 'Triggered when a conversion fails',
        payload_example: {
          event: 'conversion.failed',
          data: {
            conversion_id: 'uuid-v4-string',
            file_name: 'statement.pdf',
            format: 'csv',
            status: 'failed',
            error: 'Invalid file format',
            timestamp: '2024-01-15T10:30:00Z'
          }
        }
      }
    ],
    integration_guides: {
      zapier: `${request.nextUrl.origin}/docs/integrations/zapier`,
      make: `${request.nextUrl.origin}/docs/integrations/make`,
      n8n: `${request.nextUrl.origin}/docs/integrations/n8n`
    }
  })
}
