'use client'

import { FileText, Zap, Shield, Database, TrendingUp, Cpu, Globe, Lock } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Multi-Format Support',
    description: 'Convert PDF, images, and scanned documents to CSV, Excel, or JSON.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Cpu,
    title: 'AI-Powered Extraction',
    description: 'Advanced OCR and pattern recognition for 99.9% accuracy across all bank formats.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process statements in seconds, not hours. Batch processing for multiple files.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    icon: Database,
    title: 'Structured Data',
    description: 'Get clean, validated JSON with schema compliance for AI and automation tools.',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: TrendingUp,
    title: 'Smart Categorization',
    description: 'Automatic transaction categorization with merchant recognition and tagging.',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    icon: Globe,
    title: 'Multi-Currency',
    description: 'Support for 150+ currencies with automatic conversion and formatting.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, SOC 2 compliance, and automatic file deletion.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data is processed and immediately deleted. Zero data retention policy.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  }
]

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-20 bg-white/50 rounded-3xl my-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to convert and integrate bank statements into your workflow
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
