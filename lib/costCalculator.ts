import { Task, Project, CostEstimatorSettings, ComplexityLevel } from './types'

export function calculateTaskCost(
  task: Task,
  settings: CostEstimatorSettings
): number {
  const complexityMultiplier = settings.complexityFactors[task.complexity]
  return task.sizeFactor * complexityMultiplier * settings.baseRate
}

export function calculateProjectTotal(
  tasks: Task[],
  settings: CostEstimatorSettings
): number {
  return tasks.reduce((total, task) => {
    return total + calculateTaskCost(task, settings)
  }, 0)
}

export function recalculateProject(
  project: Project,
  settings: CostEstimatorSettings
): Project {
  const updatedTasks = project.tasks.map(task => ({
    ...task,
    calculatedCost: calculateTaskCost(task, settings),
  }))

  return {
    ...project,
    tasks: updatedTasks,
    totalCost: updatedTasks.reduce((sum, task) => sum + task.calculatedCost, 0),
    updatedAt: new Date().toISOString(),
  }
}
