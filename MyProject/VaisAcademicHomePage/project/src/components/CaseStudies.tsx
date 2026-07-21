import React from 'react';
import { Building2, Users, Clock, TrendingUp } from 'lucide-react';

export default function CaseStudies() {
  const caseStudies = [
    {
      name: 'Brighton International School',
      location: 'Melbourne, Australia',
      background: 'A leading K-12 institution with 2,500 students seeking digital transformation',
      challenges: ['Manual attendance tracking', 'Inefficient parent communication', 'Paper-based records'],
      solution: 'Implemented complete EduManage suite with RFID attendance and parent portal',
      outcomes: [
        { metric: '95%', description: 'Reduction in administrative time' },
        { metric: '32%', description: 'Improvement in attendance rates' },
        { metric: '89%', description: 'Parent satisfaction score' },
        { metric: '$50K', description: 'Annual cost savings' },
      ],
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    },
    {
      name: 'Washington STEM Academy',
      location: 'Seattle, USA',
      background: 'Tech-focused middle school with 1,200 students implementing digital-first approach',
      challenges: ['Complex scheduling needs', 'Growing student body', 'Resource allocation'],
      solution: 'Custom EduManage deployment with advanced analytics and resource tracking',
      outcomes: [
        { metric: '40%', description: 'Increase in resource utilization' },
        { metric: '28%', description: 'Improvement in staff productivity' },
        { metric: '99%', description: 'System uptime' },
        { metric: '3.5K', description: 'Monthly parent portal visits' },
      ],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    },
  ];

  return (
    <div id="case-studies" className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Success Stories
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Transforming Education Management
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            See how schools around the world are revolutionizing their operations with EduManage
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {caseStudies.map((study) => (
            <article key={study.name} className="flex flex-col items-start">
              <div className="w-full">
                <div className="relative w-full">
                  <img
                    src={study.image}
                    alt={study.name}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 dark:ring-gray-700/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime="2023">Case Study 2023</time>
                    <span>{study.location}</span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {study.name}
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {study.background}
                    </p>
                  </div>
                  <div className="mt-8 border-t border-gray-900/5 dark:border-gray-700 pt-8">
                    <h4 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                      Key Outcomes
                    </h4>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {study.outcomes.map((outcome) => (
                        <div
                          key={outcome.description}
                          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
                        >
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {outcome.metric}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {outcome.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

