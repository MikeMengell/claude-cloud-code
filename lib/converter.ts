import { BankStatement, AIOptimizedOutput } from './types'
import Papa from 'papaparse'

/**
 * Convert bank statement to CSV format
 */
export function convertToCSV(statement: BankStatement): string {
  const rows = statement.transactions.map(transaction => ({
    Date: transaction.date,
    Description: transaction.description,
    Amount: transaction.amount,
    Balance: transaction.balance || '',
    Category: transaction.category || '',
    Merchant: transaction.merchant || '',
    Reference: transaction.reference || ''
  }))

  return Papa.unparse(rows)
}

/**
 * Convert bank statement to Excel format (CSV with metadata)
 * In production, use a library like exceljs for native Excel format
 */
export function convertToExcel(statement: BankStatement): string {
  // Add metadata header rows
  const metadata = [
    ['Bank Statement'],
    ['Bank:', statement.bank],
    ['Account:', statement.account_number],
    ['Period:', `${statement.period.start} to ${statement.period.end}`],
    ['Currency:', statement.currency],
    [''],
    ['Summary'],
    ['Starting Balance:', statement.summary.starting_balance],
    ['Ending Balance:', statement.summary.ending_balance],
    ['Total Credits:', statement.summary.total_credits],
    ['Total Debits:', statement.summary.total_debits],
    [''],
    ['Transactions']
  ]

  const headers = ['Date', 'Description', 'Amount', 'Balance', 'Category', 'Merchant', 'Reference']

  const transactions = statement.transactions.map(t => [
    t.date,
    t.description,
    t.amount,
    t.balance || '',
    t.category || '',
    t.merchant || '',
    t.reference || ''
  ])

  const allRows = [...metadata, headers, ...transactions]

  return Papa.unparse(allRows)
}

/**
 * Convert bank statement to standard JSON
 */
export function convertToJSON(statement: BankStatement): string {
  return JSON.stringify(statement, null, 2)
}

/**
 * Convert bank statement to AI-optimized format
 * This format is designed to minimize token usage and maximize accuracy
 * when feeding into AI systems like GPT or Claude
 */
export function convertToAIOptimized(
  statement: BankStatement,
  fileName: string,
  pages: number = 1
): AIOptimizedOutput {
  const output: AIOptimizedOutput = {
    statement: {
      ...statement,
      // Ensure all fields are properly structured
      transactions: statement.transactions.map(t => ({
        date: t.date,
        description: t.description,
        amount: Number(t.amount.toFixed(2)),
        balance: t.balance ? Number(t.balance.toFixed(2)) : undefined,
        category: t.category,
        merchant: t.merchant,
        reference: t.reference
      }))
    },
    metadata: {
      processed_at: new Date().toISOString(),
      file_name: fileName,
      pages: pages,
      confidence_score: 0.995 // In production, this would be calculated by the AI model
    },
    schema_version: '1.0.0'
  }

  return output
}

/**
 * Calculate token savings compared to raw text
 * This demonstrates the benefit of using AI-optimized format
 */
export function calculateTokenSavings(rawText: string, structuredJSON: string): {
  rawTokens: number
  structuredTokens: number
  savings: number
  savingsPercent: number
} {
  // Rough token estimation (1 token ≈ 4 characters)
  const rawTokens = Math.ceil(rawText.length / 4)
  const structuredTokens = Math.ceil(structuredJSON.length / 4)
  const savings = rawTokens - structuredTokens
  const savingsPercent = Math.round((savings / rawTokens) * 100)

  return {
    rawTokens,
    structuredTokens,
    savings,
    savingsPercent
  }
}

/**
 * Format output based on requested format
 */
export function formatOutput(
  statement: BankStatement,
  format: 'csv' | 'excel' | 'json' | 'ai-optimized',
  fileName: string
): { data: string | AIOptimizedOutput; mimeType: string; extension: string } {
  switch (format) {
    case 'csv':
      return {
        data: convertToCSV(statement),
        mimeType: 'text/csv',
        extension: 'csv'
      }
    case 'excel':
      return {
        data: convertToExcel(statement),
        mimeType: 'text/csv', // In production, use 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        extension: 'csv' // In production, use 'xlsx'
      }
    case 'json':
      return {
        data: convertToJSON(statement),
        mimeType: 'application/json',
        extension: 'json'
      }
    case 'ai-optimized':
      return {
        data: convertToAIOptimized(statement, fileName),
        mimeType: 'application/json',
        extension: 'json'
      }
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}
