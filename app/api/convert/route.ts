import { NextRequest, NextResponse } from 'next/server'
import { parseBankStatement } from '@/lib/pdfParser'
import { formatOutput } from '@/lib/converter'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const format = (formData.get('format') as string) || 'csv'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a PDF or image.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse bank statement using AI extraction
    const statement = await parseBankStatement(buffer, file.name)

    // Format output based on requested format
    const output = formatOutput(statement, format as any, file.name)

    // In production, save the file to cloud storage and return a download URL
    // For now, we'll return the data directly
    const conversionId = uuidv4()

    // Trigger webhook if configured (for low-code integrations)
    // await triggerWebhook(conversionId, file.name, format, output.data)

    return NextResponse.json({
      success: true,
      data: output.data,
      conversionId: conversionId,
      metadata: {
        format: format,
        fileName: file.name,
        processedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

// Enable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}
