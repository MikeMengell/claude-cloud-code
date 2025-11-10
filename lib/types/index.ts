export interface Transaction {
  date: string
  description: string
  amount: number
  balance?: number
  category?: string
  merchant?: string
  reference?: string
}

export interface StatementSummary {
  starting_balance: number
  ending_balance: number
  total_credits: number
  total_debits: number
  transaction_count: number
}

export interface BankStatement {
  bank: string
  account_number: string
  account_holder?: string
  period: {
    start: string
    end: string
  }
  currency: string
  transactions: Transaction[]
  summary: StatementSummary
}

export interface AIOptimizedOutput {
  statement: BankStatement
  metadata: {
    processed_at: string
    file_name: string
    pages: number
    confidence_score: number
  }
  schema_version: string
}

export interface ConversionRequest {
  file: File
  format: 'csv' | 'excel' | 'json' | 'ai-optimized'
  userId?: string
}

export interface ConversionResponse {
  success: boolean
  data?: any
  downloadUrl?: string
  message?: string
  error?: string
}

export interface WebhookPayload {
  event: 'conversion.completed' | 'conversion.failed'
  data: {
    conversion_id: string
    file_name: string
    format: string
    status: string
    result?: AIOptimizedOutput
    error?: string
    timestamp: string
  }
}

export interface UsageStats {
  user_id: string
  conversions_used: number
  conversions_limit: number
  plan: 'free' | 'professional' | 'business' | 'enterprise'
  reset_date: string
}

// Cost Estimator Types
export type ComplexityLevel = 'low' | 'medium' | 'high' | 'veryHigh'

export interface Task {
  id: string
  name: string
  description: string
  complexity: ComplexityLevel
  sizeFactor: number
  calculatedCost: number
}

export interface Project {
  id: string
  name: string
  description: string
  tasks: Task[]
  totalCost: number
  createdAt: string
  updatedAt: string
}

export interface ComplexityFactors {
  low: number
  medium: number
  high: number
  veryHigh: number
}

export interface LLMConfig {
  provider: 'claude' | 'openai'
  apiKey: string
  model: string
}

export interface CostEstimatorSettings {
  baseRate: number
  complexityFactors: ComplexityFactors
  llm: LLMConfig
}
