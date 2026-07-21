import React from 'react';
import {
  Users, GraduationCap, Clock, MessageSquare,
  Calendar, CreditCard, BookOpen, Bus,
  UserCog, BookMarked, Shield
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import your ThemeContext.

export default function Features() {
  const { theme } = useTheme(); // Access the current theme.

  const features = [
    {
      name: 'Student Information',
      description: 'Comprehensive student profiles and academic history tracking',
      icon: Users,
    },
    {
      name: 'Academic Records',
      description: 'Digital gradebook with performance analytics and reports',
      icon: GraduationCap,
    },
    {
      name: 'Attendance System',
      description: 'RFID-based attendance with real-time tracking and notifications',
      icon: Clock,
    },
    {
      name: 'Parent Portal',
      description: 'Direct communication channel between teachers and parents',
      icon: MessageSquare,
    },
    {
      name: 'Timetable',
      description: 'Smart scheduling system for classes and activities',
      icon: Calendar,
    },
    {
      name: 'Fee Management',
      description: 'Online payment processing and financial tracking',
      icon: CreditCard,
    },
    {
      name: 'Library System',
      description: 'Digital library management with book tracking',
      icon: BookOpen,
    },
    {
      name: 'Transportation',
      description: 'Real-time bus tracking and route management',
      icon: Bus,
    },
    {
      name: 'Staff Management',
      description: 'Complete HR management for school staff',
      icon: UserCog,
    },
    {
      name: 'Learning Resources',
      description: 'Digital content library for enhanced learning',
      icon: BookMarked,
    },
    {
      name: 'Security',
      description: 'Advanced data protection and access control',
      icon: Shield,
    },
  ];

  return (
    <div
      id="features"
      className={`py-24 sm:py-32 transition-colors ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Comprehensive Solution</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage your school
          </p>
          <p className={`mt-6 text-lg leading-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Our platform provides all the tools necessary for efficient school management,
            from student information to transportation tracking.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt
                  className={`flex items-center gap-x-3 text-base font-semibold leading-7 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  <feature.icon
                    className={`h-5 w-5 flex-none ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`}
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd
                  className={`mt-4 flex flex-auto flex-col text-base leading-7 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
