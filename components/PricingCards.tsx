'use client'

import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    description: 'Full access to test our service',
    features: [
      'Unlimited conversions for 14 days',
      'All output formats (CSV, Excel, JSON)',
      'Advanced AI extraction',
      'Priority email support',
      'Unlimited pages per statement',
      'Advanced categorization',
      'API access',
      'Webhook integrations'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: 'per month',
    description: 'For freelancers and small businesses',
    features: [
      '100 conversions per month',
      'All output formats',
      'Advanced AI extraction',
      'Priority support',
      'Unlimited pages',
      'Advanced categorization',
      'API access',
      'Webhook integrations',
      'Custom export templates'
    ],
    cta: 'Get Started',
    popular: true
  },
  {
    name: 'Business',
    price: '$99',
    period: 'per month',
    description: 'For growing teams and businesses',
    features: [
      '500 conversions per month',
      'All Pro features',
      'Batch processing',
      '24/7 support',
      'Multi-user accounts',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
      'White-label options'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large organizations',
    features: [
      'Unlimited conversions',
      'All Business features',
      'On-premise deployment',
      'Custom AI models',
      'SSO & SAML',
      'Custom SLA',
      'Dedicated infrastructure',
      'Custom integrations',
      'Training & onboarding'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function PricingCards() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free, upgrade as you grow. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              plan.popular ? 'border-primary-500' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period !== 'contact us' && (
                  <span className="text-gray-600 ml-2">/ {plan.period}</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-lg font-medium transition ${
                plan.popular
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          All plans include: • Bank-grade security • Automatic file deletion • GDPR compliant • 99.9% uptime SLA
        </p>
      </div>
    </section>
  )
}
