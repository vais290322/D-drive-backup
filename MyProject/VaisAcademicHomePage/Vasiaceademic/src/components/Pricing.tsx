import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Ensure your ThemeContext 
// provides `theme`.
import {logo} from "../assets"
export default function Pricing() {
  const { theme } = useTheme(); // Access the theme from context.

  const tiers = [
    {
      name: 'Basic',
      id: 'tier-basic',
      price: { monthly: '$299', annually: '$2,990' },
      description: 'Perfect for small schools getting started with digital management.',
      features: [
        'Up to 500 students',
        'Basic attendance system',
        'Student information management',
        'Parent communication portal',
        'Basic reporting',
        'Email support',
      ],
      featured: false,
    },
    {
      name: 'Advance',
      id: 'tier-professional',
      price: { monthly: '$499', annually: '$4,990' },
      description: 'Ideal for medium-sized schools requiring advanced features.',
      features: [
        'Up to 2000 students',
        'RFID attendance system',
        'Advanced analytics',
        'Library management',
        'Online fee payment',
        'Transportation tracking',
        'Priority support',
        'Staff management',
      ],
      featured: true,
    },
    {
      name: 'Elite',
      id: 'tier-enterprise',
      price: { monthly: 'Custom', annually: 'Custom' },
      description: 'Customized solutions for large educational institutions.',
      features: [
        'Unlimited students',
        'Custom modules',
        // 'API access',
        // 'White-labeling',
        'Advanced security',
        'Dedicated support',
        'On-premise option',
        'Custom integrations',
      ],
      featured: false,
    },
  ];

  return (
    <div
      id="pricing"
      className={`py-24 sm:py-32 transition-colors ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose the right plan for your school
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8">
          Flexible pricing options to match your school's needs and budget
        </p>
        <div className="isolate mx-auto gap-2 mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl p-8 ring-1 xl:p-10 ${
                theme === 'dark'
                  ? 'bg-gray-800 ring-gray-700'
                  : 'bg-white ring-gray-200'
              }  `}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8">{tier.name}</h3>
                  {tier.featured && (
                    <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                      Most popular
                    </p>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price.monthly}
                  </span>
                  {tier.price.monthly !== 'Custom' && (
                    <span className="text-sm font-semibold leading-6">
                      /month
                    </span>
                  )}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${
                          theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                        }`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.featured
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-indigo-400 ring-1 ring-indigo-400 hover:ring-indigo-300'
                    : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                }`}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
