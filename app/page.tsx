'use client'

import { useState } from 'react'
import { Upload, FileText, Zap, Shield, Code, Brain, CheckCircle, ArrowRight } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import PricingCards from '@/components/PricingCards'
import Features from '@/components/Features'

export default function Home() {
  const [showUploader, setShowUploader] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">StatementAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition">Pricing</a>
            <a href="#integrations" className="text-gray-600 hover:text-primary-600 transition">Integrations</a>
            <button
              onClick={() => setShowUploader(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Start Free Trial
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            10 Free Conversions - No Credit Card Required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Convert Bank Statements to
            <span className="text-primary-600"> Structured Data</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered converter that transforms PDFs into CSV, Excel, or AI-optimized JSON.
            Integrate with low-code platforms and AI tools to save tokens and boost accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setShowUploader(true)}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Upload className="w-5 h-5" />
              Convert Now - Free
            </button>
            <a
              href="#features"
              className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-50 transition flex items-center justify-center gap-2"
            >
              See How It Works
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Process in Seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span>99.9% Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* File Uploader Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Your Bank Statement</h2>
              <button
                onClick={() => setShowUploader(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <FileUploader onClose={() => setShowUploader(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <Features />

      {/* Integration Showcase */}
      <section id="integrations" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Integration</h2>
            <p className="text-xl text-gray-600">Connect with your favorite tools in minutes</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Low-Code Integration */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Low-Code Platforms</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Direct webhooks for Zapier, Make.com, n8n, and more. Automate your workflow without writing code.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Zapier & Make.com ready</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Custom webhook endpoints</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Real-time notifications</span>
                </li>
              </ul>
            </div>

            {/* AI Integration */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">AI-Optimized Output</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get structured JSON with schema validation. Reduces AI tokens by 80% and improves accuracy.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Pre-validated JSON schema</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>80% token reduction</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>GPT/Claude ready format</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Code Example */}
          <div className="mt-8 bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="text-sm text-gray-400 mb-2">API Example - AI-Optimized Output</div>
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`{
  "statement": {
    "bank": "Chase Bank",
    "account_number": "****1234",
    "period": { "start": "2024-01-01", "end": "2024-01-31" },
    "transactions": [
      {
        "date": "2024-01-15",
        "description": "Amazon Purchase",
        "amount": -45.99,
        "category": "shopping",
        "balance": 1254.01
      }
    ],
    "summary": {
      "starting_balance": 1300.00,
      "ending_balance": 1254.01,
      "total_credits": 0.00,
      "total_debits": -45.99
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingCards />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold text-white">StatementAI</span>
              </div>
              <p className="text-sm text-gray-400">
                Modern bank statement converter with AI integration and low-code support.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-primary-400 transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary-400 transition">Pricing</a></li>
                <li><a href="#integrations" className="hover:text-primary-400 transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">API Reference</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-400 transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 StatementAI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
