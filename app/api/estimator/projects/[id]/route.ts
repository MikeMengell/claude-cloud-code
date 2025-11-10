import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, saveProject } from '@/lib/storage'

export const dynamic = 'force-dynamic'

// GET project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = getProjectById(params.id)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, project })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = getProjectById(params.id)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    const updatedProject = {
      ...project,
      name: name || project.name,
      description: description || project.description,
      updatedAt: new Date().toISOString(),
    }

    saveProject(updatedProject)

    return NextResponse.json({ success: true, project: updatedProject })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
