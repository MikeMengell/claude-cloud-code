'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Download,
  Sparkles,
  Edit2,
  Trash2,
  DollarSign,
  Save,
  X,
} from 'lucide-react'
import { Project, Task, ComplexityLevel } from '@/lib/types'

export default function ProjectView() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Task form state
  const [taskName, setTaskName] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskComplexity, setTaskComplexity] = useState<ComplexityLevel>('medium')
  const [taskSize, setTaskSize] = useState('1')

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/estimator/projects/${projectId}`)
      const data = await response.json()
      if (data.success) {
        setProject(data.project)
      } else {
        alert('Project not found')
        router.push('/estimator')
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
      alert('Failed to load project')
      router.push('/estimator')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!taskName.trim() || !taskSize) {
      alert('Please enter task name and size')
      return
    }

    try {
      const response = await fetch('/api/estimator/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: taskName,
          description: taskDesc,
          complexity: taskComplexity,
          sizeFactor: parseFloat(taskSize),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setProject(data.project)
        setShowAddTaskModal(false)
        resetTaskForm()
      }
    } catch (error) {
      console.error('Failed to add task:', error)
      alert('Failed to add task')
    }
  }

  const updateTask = async () => {
    if (!editingTask || !taskName.trim() || !taskSize) {
      alert('Please enter task name and size')
      return
    }

    try {
      const response = await fetch('/api/estimator/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          taskId: editingTask.id,
          name: taskName,
          description: taskDesc,
          complexity: taskComplexity,
          sizeFactor: parseFloat(taskSize),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setProject(data.project)
        setEditingTask(null)
        resetTaskForm()
      }
    } catch (error) {
      console.error('Failed to update task:', error)
      alert('Failed to update task')
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      const response = await fetch(
        `/api/estimator/tasks?projectId=${projectId}&taskId=${taskId}`,
        { method: 'DELETE' }
      )

      const data = await response.json()
      if (data.success) {
        setProject(data.project)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert('Failed to delete task')
    }
  }

  const generateTasks = async () => {
    if (!project) return

    setGenerating(true)
    try {
      const response = await fetch('/api/estimator/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          projectDescription: project.description,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setProject(data.project)
        setShowGenerateModal(false)
        alert(`Successfully generated ${data.tasks.length} tasks!`)
      } else {
        alert(data.error || 'Failed to generate tasks')
      }
    } catch (error) {
      console.error('Failed to generate tasks:', error)
      alert('Failed to generate tasks')
    } finally {
      setGenerating(false)
    }
  }

  const exportToExcel = async () => {
    setExporting(true)
    try {
      const response = await fetch(`/api/estimator/export?projectId=${projectId}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${project?.name.replace(/[^a-zA-Z0-9]/g, '_')}_estimate.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        alert('Failed to export')
      }
    } catch (error) {
      console.error('Failed to export:', error)
      alert('Failed to export')
    } finally {
      setExporting(false)
    }
  }

  const resetTaskForm = () => {
    setTaskName('')
    setTaskDesc('')
    setTaskComplexity('medium')
    setTaskSize('1')
  }

  const startEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskName(task.name)
    setTaskDesc(task.description)
    setTaskComplexity(task.complexity)
    setTaskSize(task.sizeFactor.toString())
  }

  const cancelEdit = () => {
    setEditingTask(null)
    resetTaskForm()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  const complexityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    veryHigh: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/estimator"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Generate Tasks
              </button>
              <button
                onClick={exportToExcel}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {exporting ? 'Exporting...' : 'Export'}
              </button>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total Cost Card */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 font-medium mb-2">Total Project Cost</p>
              <p className="text-5xl font-bold">${project.totalCost.toFixed(2)}</p>
              <p className="text-primary-100 mt-4">
                {project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-full">
              <DollarSign className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tasks & Milestones</h2>
          </div>

          {project.tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No tasks yet. Add your first task or generate them with AI.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate with AI
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {project.tasks.map(task => (
                <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  {editingTask?.id === task.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={taskName}
                        onChange={e => setTaskName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Task name"
                      />
                      <textarea
                        value={taskDesc}
                        onChange={e => setTaskDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complexity
                          </label>
                          <select
                            value={taskComplexity}
                            onChange={e => setTaskComplexity(e.target.value as ComplexityLevel)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="veryHigh">Very High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Size Factor
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={taskSize}
                            onChange={e => setTaskSize(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={updateTask}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.name}</h3>
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full font-medium ${complexityColors[task.complexity]}`}
                          >
                            {task.complexity}
                          </span>
                          <span className="text-gray-600">
                            Size: <span className="font-medium">{task.sizeFactor}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            ${task.calculatedCost.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditTask(task)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                <select
                  value={taskComplexity}
                  onChange={e => setTaskComplexity(e.target.value as ComplexityLevel)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="veryHigh">Very High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Factor (hours/units)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={taskSize}
                  onChange={e => setTaskSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter size factor"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTaskModal(false)
                  resetTaskForm()
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Tasks Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Tasks with AI</h2>
            <p className="text-gray-600 mb-6">
              The AI will analyze your project description and generate relevant tasks automatically.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-medium mb-2">Project Description:</p>
              <p className="text-sm text-blue-800">{project.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={generating}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={generateTasks}
                disabled={generating}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
