import fs from 'fs'
import path from 'path'
import { Project, CostEstimatorSettings } from './types'

const DATA_DIR = path.join(process.cwd(), 'data', 'estimator')
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

// Default settings
const DEFAULT_SETTINGS: CostEstimatorSettings = {
  baseRate: 100,
  complexityFactors: {
    low: 1,
    medium: 2,
    high: 4,
    veryHigh: 8,
  },
  llm: {
    provider: 'claude',
    apiKey: '',
    model: 'claude-3-5-sonnet-20241022',
  },
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Projects operations
export function getAllProjects(): Project[] {
  ensureDataDir()

  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([]))
    return []
  }

  const data = fs.readFileSync(PROJECTS_FILE, 'utf-8')
  return JSON.parse(data) as Project[]
}

export function getProjectById(id: string): Project | null {
  const projects = getAllProjects()
  return projects.find(p => p.id === id) || null
}

export function saveProject(project: Project): void {
  const projects = getAllProjects()
  const index = projects.findIndex(p => p.id === project.id)

  if (index >= 0) {
    projects[index] = project
  } else {
    projects.push(project)
  }

  ensureDataDir()
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2))
}

export function deleteProject(id: string): boolean {
  const projects = getAllProjects()
  const filtered = projects.filter(p => p.id !== id)

  if (filtered.length === projects.length) {
    return false // Project not found
  }

  ensureDataDir()
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2))
  return true
}

// Settings operations
export function getSettings(): CostEstimatorSettings {
  ensureDataDir()

  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2))
    return DEFAULT_SETTINGS
  }

  const data = fs.readFileSync(SETTINGS_FILE, 'utf-8')
  return JSON.parse(data) as CostEstimatorSettings
}

export function saveSettings(settings: CostEstimatorSettings): void {
  ensureDataDir()
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}
