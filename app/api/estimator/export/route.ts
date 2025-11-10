import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getProjectById } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId is required' },
        { status: 400 }
      )
    }

    const project = getProjectById(projectId)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // Project Summary Sheet
    const summaryData = [
      ['Project Name', project.name],
      ['Description', project.description],
      ['Total Cost', `$${project.totalCost.toFixed(2)}`],
      ['Tasks Count', project.tasks.length],
      ['Created At', new Date(project.createdAt).toLocaleDateString()],
      ['Updated At', new Date(project.updatedAt).toLocaleDateString()],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Tasks Sheet
    const tasksData = [
      ['Task Name', 'Description', 'Complexity', 'Size Factor', 'Calculated Cost'],
      ...project.tasks.map(task => [
        task.name,
        task.description,
        task.complexity,
        task.sizeFactor,
        `$${task.calculatedCost.toFixed(2)}`,
      ]),
      [],
      ['TOTAL', '', '', '', `$${project.totalCost.toFixed(2)}`],
    ]

    const tasksSheet = XLSX.utils.aoa_to_sheet(tasksData)
    XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tasks')

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return as downloadable file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_estimate.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export project' },
      { status: 500 }
    )
  }
}
