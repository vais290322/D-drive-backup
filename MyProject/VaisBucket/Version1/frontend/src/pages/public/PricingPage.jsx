import React, { useState } from 'react';
import { Link } from 'react-router';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { CreditCardIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

const tiers = [
    {
        name: 'Free',
        id: 'tier-free',
        href: '/signup',
        priceMonthly: '₹0',
        priceYearly: '₹0',
        description: 'Perfect for getting started with personal projects.',
        features: ['5GB storage', 'Basic file sharing', 'Standard support', 'API access', '100 API calls', 'Single API Key', '10 file uploads/month',],
        featured: false,
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '/signup',
        priceMonthly: '₹99',
        priceYearly: '₹999',
        description: 'For power users who need more space and features.',
        features: [
            '25GB storage',
            'Advanced sharing controls',
            'Priority support',
            'Folder System',
            'API access',
            'Up to 10 API Key',
            '5000 API calls/API Key/month',
            'Developer Support',
            'Unlimited uploads',
        ],
        featured: true,
    },
    {
        name: 'Enterprise',
        id: 'tier-enterprise',
        href: '/contact',
        priceMonthly: '₹299',
        priceYearly: '₹2999',
        description: 'Dedicated support and infrastructure for your company.',
        features: [
            '100GB storage',
            'SSO & Advanced Security',
            '24/7 Dedicated support',
            'Folder System',
            'API access',
            'Unlimited API Key',
            'Unlimited API calls',
            'Custom retention policies',
            'White-label options',
        ],
        featured: false,
    },

]

const features = [
    {
        name: 'Secure & Reliable',
        description: 'Bank-level encryption and 99.9% uptime guarantee.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Lightning Fast',
        description: 'Global CDN ensures your files load instantly anywhere.',
        icon: BoltIcon,
    },
    {
        name: 'Easy Payments',
        description: 'Cancel anytime with no hidden fees or commitments.',
        icon: CreditCardIcon,
    },
]

const faqs = [
    {
        question: 'Can I change plans later?',
        answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
    },
    {
        question: 'Do you offer refunds?',
        answer: 'We offer a 30-day money-back guarantee on all paid plans. No questions asked.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.',
    },
    {
        question: 'Is there a setup fee?',
        answer: 'No setup fees, ever. You only pay for your chosen plan.',
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Simple, transparent pricing
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Choose the plan that's right for you. Change or cancel anytime with no hidden fees.
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="mt-12 flex justify-center">
                        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex gap-1">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={classNames(
                                    billingCycle === 'monthly'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400',
                                    'px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer'
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={classNames(
                                    billingCycle === 'yearly'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400',
                                    'px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer'
                                )}
                            >
                                Yearly
                                <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">Save 17%</span>
                            </button>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="mx-auto mt-16 grid max-w-lg  grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3 gap-4">
                        {tiers.map((tier, tierIndex) => (
                            <div
                                key={tier.id}
                                className={classNames(
                                    tier.featured ? 'relative bg-gray-900 dark:bg-indigo-900 shadow-2xl z-10 scale-105' : 'bg-white/60 dark:bg-gray-800/60 sm:mx-8 lg:mx-0',
                                    tier.featured ? '' : tierIndex === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl' : 'rounded-b-3xl sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
                                    'rounded-3xl p-8 ring-1 ring-gray-900/10 dark:ring-gray-700 sm:p-10 animate-in zoom-in duration-500 fill-mode-both'
                                )}
                                style={{ animationDelay: `₹{tierIndex * 150}ms` }}
                            >
                                {tier.featured && (
                                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-md">
                                        Most Popular
                                    </div>
                                )}
                                <h3
                                    id={tier.id}
                                    className={classNames(
                                        tier.featured ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400',
                                        'text-base font-semibold leading-7'
                                    )}
                                >
                                    {tier.name}
                                </h3>
                                <p className="mt-4 flex items-baseline gap-x-2  ">
                                    <span className={classNames(
                                        tier.featured ? 'text-white' : 'text-gray-900 dark:text-white',
                                        'text-5xl font-bold tracking-tight'
                                    )}>
                                        {billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}
                                    </span>
                                    <span className={classNames(
                                        tier.featured ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400',
                                        'text-base'
                                    )}>
                                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                                    </span>
                                </p>
                                <p className={classNames(
                                    tier.featured ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300',
                                    'mt-6 text-base leading-7'
                                )}>{tier.description}</p>
                                <ul role="list" className={classNames(
                                    tier.featured ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300',
                                    'mt-8 space-y-3 text-sm leading-6'
                                )}>
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <CheckIcon className={classNames(
                                                tier.featured ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400',
                                                'h-6 w-5 flex-none'
                                            )} aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to={tier.href}
                                    aria-describedby={tier.id}
                                    className={classNames(
                                        tier.featured
                                            ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                                            : 'text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700 hover:ring-indigo-300 dark:hover:ring-indigo-600',
                                        'mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform hover:scale-105'
                                    )}
                                >
                                    Get started today
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
                            Why choose us
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Everything you need to succeed
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature) => (
                                <div key={feature.name} className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <feature.icon className="h-5 w-5 flex-none text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                        <p className="flex-auto">{feature.description}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Frequently asked questions
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Have a different question? Contact our support team.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl">
                        <dl className="space-y-8">
                            {faqs.map((faq) => (
                                <div key={faq.question} className="border-b border-gray-200 dark:border-gray-700 pb-8">
                                    <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        {faq.question}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                        {faq.answer}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-600 dark:bg-indigo-900 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to get started?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
                            Join thousands of satisfied customers. Start your free trial today, no credit card required.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/signup"
                                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-transform hover:scale-105"
                            >
                                Start free trial
                            </Link>
                            <Link to="/contact" className="text-sm font-semibold leading-6 text-white hover:text-indigo-100">
                                Contact sales <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;