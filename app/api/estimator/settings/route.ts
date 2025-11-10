import { NextRequest, NextResponse } from 'next/server'
import { getSettings, saveSettings, getAllProjects, saveProject } from '@/lib/storage'
import { CostEstimatorSettings } from '@/lib/types'
import { recalculateProject } from '@/lib/costCalculator'

export const dynamic = 'force-dynamic'

// GET settings
export async function GET() {
  try {
    const settings = getSettings()
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { baseRate, complexityFactors, llm } = body

    const currentSettings = getSettings()

    const updatedSettings: CostEstimatorSettings = {
      baseRate: baseRate !== undefined ? Number(baseRate) : currentSettings.baseRate,
      complexityFactors: complexityFactors || currentSettings.complexityFactors,
      llm: llm || currentSettings.llm,
    }

    saveSettings(updatedSettings)

    // Recalculate all projects with new settings
    const projects = getAllProjects()
    projects.forEach(project => {
      const recalculated = recalculateProject(project, updatedSettings)
      saveProject(recalculated)
    })

    return NextResponse.json({ success: true, settings: updatedSettings })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
