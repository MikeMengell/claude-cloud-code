import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getSettings, getProjectById, saveProject } from '@/lib/storage'
import { Task, ComplexityLevel } from '@/lib/types'
import { recalculateProject } from '@/lib/costCalculator'

export const dynamic = 'force-dynamic'

interface GeneratedTask {
  name: string
  description: string
  complexity: ComplexityLevel
  sizeFactor: number
}

async function callClaude(apiKey: string, model: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
}

async function callOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

function parseTasksFromResponse(response: string): GeneratedTask[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed.map((task: any) => ({
        name: task.name || 'Untitled Task',
        description: task.description || '',
        complexity: (task.complexity || 'medium') as ComplexityLevel,
        sizeFactor: Number(task.sizeFactor) || 1,
      }))
    }

    // Fallback: return empty array if parsing fails
    return []
  } catch (error) {
    console.error('Failed to parse tasks:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, projectDescription } = body

    if (!projectId || !projectDescription) {
      return NextResponse.json(
        { success: false, error: 'projectId and projectDescription are required' },
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

    if (!settings.llm.apiKey) {
      return NextResponse.json(
        { success: false, error: 'LLM API key not configured. Please set it in settings.' },
        { status: 400 }
      )
    }

    const prompt = `You are a project management expert. Based on the following project description, generate a list of tasks/milestones.

Project: ${project.name}
Description: ${projectDescription}

Generate 5-10 tasks with the following structure. Return ONLY a valid JSON array, nothing else:

[
  {
    "name": "Task name",
    "description": "Detailed description",
    "complexity": "low" | "medium" | "high" | "veryHigh",
    "sizeFactor": number (estimated hours or size units)
  }
]

Complexity levels:
- low: Simple, straightforward tasks
- medium: Moderate complexity
- high: Complex tasks requiring significant effort
- veryHigh: Very complex, critical tasks

Size factor should be the estimated hours or relative size units.`

    let llmResponse: string

    if (settings.llm.provider === 'claude') {
      llmResponse = await callClaude(settings.llm.apiKey, settings.llm.model, prompt)
    } else {
      llmResponse = await callOpenAI(settings.llm.apiKey, settings.llm.model, prompt)
    }

    const generatedTasks = parseTasksFromResponse(llmResponse)

    if (generatedTasks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse tasks from LLM response' },
        { status: 500 }
      )
    }

    // Convert generated tasks to Task objects with IDs
    const tasks: Task[] = generatedTasks.map(gt => ({
      id: uuidv4(),
      name: gt.name,
      description: gt.description,
      complexity: gt.complexity,
      sizeFactor: gt.sizeFactor,
      calculatedCost: 0, // Will be calculated by recalculateProject
    }))

    // Add tasks to project
    project.tasks.push(...tasks)

    // Recalculate project
    const updatedProject = recalculateProject(project, settings)
    saveProject(updatedProject)

    return NextResponse.json({
      success: true,
      tasks,
      project: updatedProject,
    })
  } catch (error: any) {
    console.error('Generate tasks error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}
