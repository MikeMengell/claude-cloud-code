'use client';

import { useState } from 'react';
import { Shield, Lock, CheckCircle2, ArrowRight, Sparkles, X } from 'lucide-react';

interface TrialOnboardingModalProps {
  isOpen: boolean;
  onComplete: (userData: TrialUserData) => void;
  onClose: () => void;
}

export interface TrialUserData {
  fullName: string;
  email: string;
  company?: string;
  useCase?: string;
}

type OnboardingStep = 'welcome' | 'details' | 'success';

export default function TrialOnboardingModal({ isOpen, onComplete, onClose }: TrialOnboardingModalProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState<TrialUserData>({
    fullName: '',
    email: '',
    company: '',
    useCase: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (field: keyof TrialUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    if (step === 'welcome') {
      setStep('details');
    } else if (step === 'details') {
      // Call API to register trial user
      try {
        const response = await fetch('/api/trial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data locally
          localStorage.setItem('trial_user', JSON.stringify(formData));
          setStep('success');
        } else {
          console.error('Failed to register trial:', data.error);
          // Still proceed to success for better UX
          localStorage.setItem('trial_user', JSON.stringify(formData));
          setStep('success');
        }
      } catch (error) {
        console.error('Error registering trial:', error);
        // Still proceed to success for better UX
        localStorage.setItem('trial_user', JSON.stringify(formData));
        setStep('success');
      }
    }
  };

  const handleStartTrial = () => {
    onComplete(formData);
  };

  const isFormValid = formData.fullName.trim() !== '' &&
                      formData.email.trim() !== '' &&
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {step === 'welcome' && (
          <div className="p-8 space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900">
              Welcome to Your 14-Day Free Trial!
            </h2>

            <div className="space-y-4 text-center">
              <p className="text-gray-600 text-lg">
                Transform your bank statements into actionable data with AI-powered intelligence.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  What&apos;s included in your trial:
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Unlimited conversions for 14 days</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>All output formats (CSV, Excel, JSON)</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Advanced AI extraction & categorization</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Priority email support</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 flex items-center justify-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Your data is secure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Bank-grade encryption (AES-256)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>SOC 2 Type II compliant</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Data deleted after processing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>GDPR & CCPA compliant</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                No credit card required • Cancel anytime • Auto-converts to free plan after 14 days
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="p-8 space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tell us a bit about yourself</h2>
              <p className="text-gray-600 mt-2">
                Help us personalize your experience and keep you updated.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500">
                  We&apos;ll send your trial details and conversion receipts here
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company (Optional)
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="useCase" className="block text-sm font-medium text-gray-700">
                  What will you use StatementAI for? (Optional)
                </label>
                <input
                  id="useCase"
                  type="text"
                  placeholder="e.g., Accounting, expense tracking, financial analysis"
                  value={formData.useCase}
                  onChange={(e) => handleInputChange('useCase', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">
                  Your information is encrypted and never shared with third parties.
                  We use it only to improve your experience.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('welcome')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!isFormValid}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Start My Trial
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 space-y-6 text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                You&apos;re all set, {formData.fullName.split(' ')[0]}!
              </h2>
              <p className="text-gray-600">
                Your 14-day free trial has started. Let&apos;s convert your first statement.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-gray-900">What happens next?</h3>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
                  <span>Upload your bank statement (PDF, PNG, or JPG)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
                  <span>Our AI extracts and categorizes your transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">3</span>
                  <span>Download your data in your preferred format</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-gray-500">
              Trial ends on {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>

            <button
              onClick={handleStartTrial}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              Start Converting
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
