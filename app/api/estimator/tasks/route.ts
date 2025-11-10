import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getProjectById, saveProject, getSettings } from '@/lib/storage'
import { Task } from '@/lib/types'
import { calculateTaskCost, recalculateProject } from '@/lib/costCalculator'

export const dynamic = 'force-dynamic'

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, name, description, complexity, sizeFactor } = body

    if (!projectId || !name || !complexity || sizeFactor === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'projectId, name, complexity, and sizeFactor are required',
        },
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

    const settings = getSettings()

    const newTask: Task = {
      id: uuidv4(),
      name,
      description: description || '',
      complexity,
      sizeFactor: Number(sizeFactor),
      calculatedCost: 0, // Will be calculated below
    }

    // Calculate cost for the new task
    newTask.calculatedCost = calculateTaskCost(newTask, settings)

    // Add task to project
    project.tasks.push(newTask)

    // Recalculate project totals
    const updatedProject = recalculateProject(project, settings)
    saveProject(updatedProject)

    return NextResponse.json({ success: true, task: newTask, project: updatedProject })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

// PUT update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, taskId, name, description, complexity, sizeFactor } = body

    if (!projectId || !taskId) {
      return NextResponse.json(
        { success: false, error: 'projectId and taskId are required' },
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

    const taskIndex = project.tasks.findIndex(t => t.id === taskId)

    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }

    const settings = getSettings()

    // Update task
    project.tasks[taskIndex] = {
      ...project.tasks[taskIndex],
      name: name || project.tasks[taskIndex].name,
      description: description !== undefined ? description : project.tasks[taskIndex].description,
      complexity: complexity || project.tasks[taskIndex].complexity,
      sizeFactor: sizeFactor !== undefined ? Number(sizeFactor) : project.tasks[taskIndex].sizeFactor,
    }

    // Recalculate costs
    const updatedProject = recalculateProject(project, settings)
    saveProject(updatedProject)

    return NextResponse.json({
      success: true,
      task: updatedProject.tasks[taskIndex],
      project: updatedProject,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const taskId = searchParams.get('taskId')

    if (!projectId || !taskId) {
      return NextResponse.json(
        { success: false, error: 'projectId and taskId are required' },
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

    const initialLength = project.tasks.length
    project.tasks = project.tasks.filter(t => t.id !== taskId)

    if (project.tasks.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }

    const settings = getSettings()
    const updatedProject = recalculateProject(project, settings)
    saveProject(updatedProject)

    return NextResponse.json({ success: true, project: updatedProject })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
