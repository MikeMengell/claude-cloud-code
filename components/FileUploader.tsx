'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, Download, Check, AlertCircle, Loader2 } from 'lucide-react'

interface FileUploaderProps {
  onClose: () => void
}

type OutputFormat = 'csv' | 'excel' | 'json' | 'ai-optimized'
type ConversionStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

export default function FileUploader({ onClose }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<OutputFormat>('csv')
  const [status, setStatus] = useState<ConversionStatus>('idle')
  const [downloadUrl, setDownloadUrl] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const [conversionResult, setConversionResult] = useState<any>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Please upload a PDF or image file (PNG, JPG)')
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
    setErrorMessage('')
    setStatus('idle')
  }

  const handleConvert = async () => {
    if (!file) return

    setStatus('uploading')
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('format', format)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Conversion failed')
      }

      setStatus('processing')

      const result = await response.json()

      setStatus('completed')
      setConversionResult(result.data)
      setDownloadUrl(result.downloadUrl)

    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during conversion')
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    } else if (conversionResult) {
      // Create a download for JSON format
      const blob = new Blob([JSON.stringify(conversionResult, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `statement.${format === 'ai-optimized' ? 'json' : format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setStatus('idle')
    setDownloadUrl('')
    setConversionResult(null)
    setErrorMessage('')
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      {status === 'idle' && !file && (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your bank statement here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse files
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,image/*"
            onChange={handleFileInput}
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-primary-700 transition"
          >
            Choose File
          </label>
          <p className="text-xs text-gray-400 mt-4">
            Supports PDF, PNG, JPG (max 10MB)
          </p>
        </div>
      )}

      {/* File Selected */}
      {file && status === 'idle' && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="w-12 h-12 text-primary-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={resetUpload}
              className="text-gray-400 hover:text-gray-600"
            >
              Remove
            </button>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'csv', label: 'CSV', desc: 'Universal format' },
                { value: 'excel', label: 'Excel', desc: 'Spreadsheet ready' },
                { value: 'json', label: 'JSON', desc: 'Developer friendly' },
                { value: 'ai-optimized', label: 'AI-Optimized', desc: '80% less tokens' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value as OutputFormat)}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    format === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2"
          >
            <Loader2 className="w-5 h-5" />
            Convert Statement
          </button>
        </div>
      )}

      {/* Processing */}
      {(status === 'uploading' || status === 'processing') && (
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-spin" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {status === 'uploading' ? 'Uploading...' : 'Processing your statement...'}
          </p>
          <p className="text-sm text-gray-600">
            This usually takes 5-10 seconds
          </p>
        </div>
      )}

      {/* Completed */}
      {status === 'completed' && (
        <div className="bg-green-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            Conversion Complete!
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Your statement has been successfully converted
          </p>

          {/* Preview for AI-Optimized */}
          {format === 'ai-optimized' && conversionResult && (
            <div className="bg-white rounded-lg p-4 mb-4 text-left max-h-60 overflow-auto">
              <pre className="text-xs text-gray-700">
                {JSON.stringify(conversionResult, null, 2).slice(0, 500)}...
              </pre>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={resetUpload}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="bg-red-50 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Conversion Failed
          </p>
          <p className="text-sm text-red-600 mb-6">
            {errorMessage}
          </p>
          <button
            onClick={resetUpload}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* General Error Message */}
      {errorMessage && status === 'idle' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
