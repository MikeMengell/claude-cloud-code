import { BankStatement, Transaction } from './types'

/**
 * Simulated PDF parsing and AI extraction
 * In production, this would use:
 * - pdf-parse for PDF text extraction
 * - OCR for scanned documents (Tesseract.js or cloud OCR)
 * - AI models for pattern recognition and categorization
 */
export async function parseBankStatement(fileBuffer: Buffer, fileName: string): Promise<BankStatement> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate AI extraction
  // In production, this would analyze the PDF and extract structured data
  const mockStatement: BankStatement = {
    bank: detectBank(fileName),
    account_number: '****' + Math.floor(1000 + Math.random() * 9000),
    account_holder: 'John Doe',
    period: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    currency: 'USD',
    transactions: generateMockTransactions(),
    summary: {
      starting_balance: 5000.00,
      ending_balance: 4523.45,
      total_credits: 2500.00,
      total_debits: -2976.55,
      transaction_count: 15
    }
  }

  return mockStatement
}

function detectBank(fileName: string): string {
  const bankKeywords = [
    { keyword: 'chase', name: 'Chase Bank' },
    { keyword: 'wells', name: 'Wells Fargo' },
    { keyword: 'bofa', name: 'Bank of America' },
    { keyword: 'citi', name: 'Citibank' },
    { keyword: 'usbank', name: 'US Bank' }
  ]

  const lowerFileName = fileName.toLowerCase()
  for (const bank of bankKeywords) {
    if (lowerFileName.includes(bank.keyword)) {
      return bank.name
    }
  }

  return 'Unknown Bank'
}

function generateMockTransactions(): Transaction[] {
  const merchants = [
    { name: 'Amazon', category: 'shopping' },
    { name: 'Walmart', category: 'groceries' },
    { name: 'Starbucks', category: 'dining' },
    { name: 'Shell Gas Station', category: 'transportation' },
    { name: 'Netflix', category: 'entertainment' },
    { name: 'AT&T', category: 'utilities' },
    { name: 'Whole Foods', category: 'groceries' },
    { name: 'Uber', category: 'transportation' },
    { name: 'Apple Store', category: 'shopping' },
    { name: 'Direct Deposit - Salary', category: 'income' }
  ]

  const transactions: Transaction[] = []
  let balance = 5000.00

  for (let i = 0; i < 15; i++) {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)]
    const isCredit = merchant.category === 'income'
    const amount = isCredit
      ? Math.random() * 2000 + 500
      : -(Math.random() * 200 + 10)

    balance += amount

    transactions.push({
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      description: merchant.name,
      amount: Math.round(amount * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      category: merchant.category,
      merchant: merchant.name,
      reference: `REF${Math.floor(100000 + Math.random() * 900000)}`
    })
  }

  return transactions.sort((a, b) => a.date.localeCompare(b.date))
}

export function categorizeTransaction(description: string): string {
  const categories: { [key: string]: string[] } = {
    groceries: ['walmart', 'target', 'whole foods', 'kroger', 'safeway'],
    dining: ['starbucks', 'mcdonalds', "wendy's", 'restaurant', 'cafe'],
    transportation: ['uber', 'lyft', 'shell', 'chevron', 'gas station'],
    entertainment: ['netflix', 'spotify', 'hulu', 'amazon prime', 'movie'],
    utilities: ['at&t', 'verizon', 'electric', 'water', 'internet'],
    shopping: ['amazon', 'ebay', 'apple store', 'best buy'],
    income: ['salary', 'deposit', 'payroll', 'payment received']
  }

  const lowerDesc = description.toLowerCase()

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category
    }
  }

  return 'other'
}
