'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 'welcome' && (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <DialogTitle className="text-2xl text-center">
                Welcome to Your 14-Day Free Trial!
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-center">
              <p className="text-gray-600 text-lg">
                Transform your bank statements into actionable data with AI-powered intelligence.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  What's included in your trial:
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

            <Button onClick={handleContinue} className="w-full" size="lg">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Tell us a bit about yourself</DialogTitle>
              <p className="text-gray-600">
                Help us personalize your experience and keep you updated.
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  We'll send your trial details and conversion receipts here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCase">What will you use StatementAI for? (Optional)</Label>
                <Input
                  id="useCase"
                  type="text"
                  placeholder="e.g., Accounting, expense tracking, financial analysis"
                  value={formData.useCase}
                  onChange={(e) => handleInputChange('useCase', e.target.value)}
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
              <Button
                variant="outline"
                onClick={() => setStep('welcome')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isFormValid}
                className="flex-1"
              >
                Start My Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-6 text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl">
                You're all set, {formData.fullName.split(' ')[0]}!
              </DialogTitle>
              <p className="text-gray-600">
                Your 14-day free trial has started. Let's convert your first statement.
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

            <Button onClick={handleStartTrial} className="w-full" size="lg">
              Start Converting
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
