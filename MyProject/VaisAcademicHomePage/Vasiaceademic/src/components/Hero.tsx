import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Hero() {
  const benefits = [
    'Free scheduling software for school',
    'Enhance parent communication',
    'Attendance software for school',
    'Secure student data management',
    'Best free school management software',
    'Software engineering school online'
  ];

  return (
    <div className="relative bg-white dark:bg-gray-900 pt-16 pb-32 overflow-hidden">
      <div className="relative">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
            <div>
              <div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  Transform Your School Management
                  <span className="text-indigo-600 dark:text-indigo-400"> Digitally</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Streamline your school's operations with our comprehensive management system.
                  From attendance tracking to parent communication, we've got everything covered and best school management software.
                </p>
                <div className="mt-8 flex gap-x-6">
                  <button className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:shadow-none">
                    Get Started
                  </button>
                  <button className="inline-flex items-center gap-x-2 rounded-md px-6 py-3 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    View Demo <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-10">
                <dl className="space-y-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-x-2">
                      <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">{benefit}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
              <img
                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none dark:ring-white/10"
                src="https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                alt="School management dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
