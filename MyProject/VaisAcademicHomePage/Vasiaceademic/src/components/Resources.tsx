import React from 'react';
import { BookOpen, Video, FileText, GraduationCap } from 'lucide-react';

export default function Resources() {
  const resources = [
    {
      title: 'School Management Best Practices Guide',
      type: 'Guide',
      format: 'PDF',
      icon: FileText,
      description: 'Comprehensive guide covering digital transformation in education',
      topics: ['Digital Strategy', 'Implementation', 'Change Management'],
      level: 'Intermediate',
      category: 'Management',
    },
    {
      title: 'Data Security in Education',
      type: 'Whitepaper',
      format: 'PDF',
      icon: FileText,
      description: 'In-depth analysis of security considerations for educational institutions',
      topics: ['Security', 'Compliance', 'Data Protection'],
      level: 'Advanced',
      category: 'Security',
    },
    {
      title: 'EduManage Implementation Tutorial',
      type: 'Video Series',
      format: 'Video',
      icon: Video,
      description: 'Step-by-step guide to implementing EduManage in your school',
      topics: ['Setup', 'Configuration', 'Training'],
      level: 'Beginner',
      category: 'Tutorial',
    },
    {
      title: 'Parent Communication Strategies',
      type: 'Course',
      format: 'Interactive',
      icon: GraduationCap,
      description: 'Learn effective digital communication strategies for schools',
      topics: ['Communication', 'Engagement', 'Best Practices'],
      level: 'Intermediate',
      category: 'Communication',
    },
  ];

  const categories = ['All', 'Management', 'Security', 'Tutorial', 'Communication'];

  return (
    <div id="resources" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Resources
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Educational Resources & Guides
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Access our comprehensive library of resources to help you get the most out of EduManage
          </p>
        </div>

        <div className="mt-10 flex justify-center space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 text-sm font-medium rounded-full
                        hover:bg-indigo-50 hover:text-indigo-600
                        dark:hover:bg-indigo-900 dark:hover:text-indigo-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        transition-colors duration-200
                        text-gray-600 dark:text-gray-400"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1
                         ring-gray-200 dark:ring-gray-700 p-8"
            >
              <div className="flex items-center gap-x-4">
                <resource.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-900 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/10">
                    {resource.type}
                  </span>
                  <span className="ml-2 inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-600/10">
                    {resource.level}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Key Topics:
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resource.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-600/10"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-sm font-semibold">
                  Access Resource →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
