'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { CostEstimatorSettings } from '@/lib/types'

export default function SettingsPage() {
  const [settings, setSettings] = useState<CostEstimatorSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form state
  const [baseRate, setBaseRate] = useState('')
  const [lowFactor, setLowFactor] = useState('')
  const [mediumFactor, setMediumFactor] = useState('')
  const [highFactor, setHighFactor] = useState('')
  const [veryHighFactor, setVeryHighFactor] = useState('')
  const [llmProvider, setLlmProvider] = useState<'claude' | 'openai'>('claude')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/estimator/settings')
      const data = await response.json()
      if (data.success) {
        const s = data.settings
        setSettings(s)
        setBaseRate(s.baseRate.toString())
        setLowFactor(s.complexityFactors.low.toString())
        setMediumFactor(s.complexityFactors.medium.toString())
        setHighFactor(s.complexityFactors.high.toString())
        setVeryHighFactor(s.complexityFactors.veryHigh.toString())
        setLlmProvider(s.llm.provider)
        setApiKey(s.llm.apiKey)
        setModel(s.llm.model)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      alert('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/estimator/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseRate: parseFloat(baseRate),
          complexityFactors: {
            low: parseFloat(lowFactor),
            medium: parseFloat(mediumFactor),
            high: parseFloat(highFactor),
            veryHigh: parseFloat(veryHighFactor),
          },
          llm: {
            provider: llmProvider,
            apiKey,
            model,
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSettings(data.settings)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/estimator"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Configure cost calculation and LLM integration</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-800 font-medium">Settings saved successfully! All projects have been recalculated.</p>
          </div>
        )}

        {/* Cost Calculation Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cost Calculation</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Rate (per unit)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={baseRate}
                  onChange={e => setBaseRate(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="100.00"
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                This is the base cost per size unit before complexity multiplier
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Complexity Multipliers</h3>
              <p className="text-sm text-gray-600 mb-4">
                Formula: <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  Cost = Size Factor × Complexity Multiplier × Base Rate
                </span>
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Complexity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={lowFactor}
                    onChange={e => setLowFactor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medium Complexity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={mediumFactor}
                    onChange={e => setMediumFactor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    High Complexity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={highFactor}
                    onChange={e => setHighFactor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Very High Complexity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={veryHighFactor}
                    onChange={e => setVeryHighFactor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="8"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Example Calculation</p>
                  <p className="text-sm text-blue-800">
                    If Base Rate = ${baseRate || '100'}, Size = 5 hours, Complexity = High ({highFactor || '4'}x)
                    <br />
                    Cost = 5 × {highFactor || '4'} × ${baseRate || '100'} = ${(5 * parseFloat(highFactor || '4') * parseFloat(baseRate || '100')).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LLM Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">LLM Integration</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LLM Provider
              </label>
              <select
                value={llmProvider}
                onChange={e => {
                  const provider = e.target.value as 'claude' | 'openai'
                  setLlmProvider(provider)
                  // Set default model based on provider
                  if (provider === 'claude' && !model) {
                    setModel('claude-3-5-sonnet-20241022')
                  } else if (provider === 'openai' && !model) {
                    setModel('gpt-4-turbo-preview')
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="claude">Anthropic Claude</option>
                <option value="openai">OpenAI ChatGPT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                placeholder={
                  llmProvider === 'claude' ? 'sk-ant-...' : 'sk-...'
                }
              />
              <p className="text-sm text-gray-600 mt-1">
                {llmProvider === 'claude'
                  ? 'Get your API key from console.anthropic.com'
                  : 'Get your API key from platform.openai.com'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                placeholder={
                  llmProvider === 'claude'
                    ? 'claude-3-5-sonnet-20241022'
                    : 'gpt-4-turbo-preview'
                }
              />
              <p className="text-sm text-gray-600 mt-1">
                {llmProvider === 'claude'
                  ? 'Examples: claude-3-5-sonnet-20241022, claude-3-opus-20240229'
                  : 'Examples: gpt-4-turbo-preview, gpt-4, gpt-3.5-turbo'}
              </p>
            </div>

            {!apiKey && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    You need to configure your API key to use the AI task generation feature.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Link
            href="/estimator"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </main>
    </div>
  )
}
