import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  HelpCircle,
  Search,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Shield,
  Calendar,
  FileText,
  Phone,
  Database,
  Bell,
  MessageSquare,
  UserCheck,
  Smartphone,
  Globe,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';


const FaqPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme !== "dark";
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // FAQ Categories with icons
  const categories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle, color: 'from-purple-500 to-indigo-600' },
    { id: 'general', name: 'General', icon: Settings, color: 'from-blue-500 to-cyan-600' },
    { id: 'students', name: 'Student Management', icon: Users, color: 'from-green-500 to-emerald-600' },
    { id: 'academics', name: 'Academics', icon: BookOpen, color: 'from-orange-500 to-red-600' },
    { id: 'fees', name: 'Fees & Payments', icon: CreditCard, color: 'from-yellow-500 to-orange-600' },
    { id: 'attendance', name: 'Attendance', icon: Calendar, color: 'from-pink-500 to-rose-600' },
    { id: 'reports', name: 'Reports', icon: FileText, color: 'from-indigo-500 to-purple-600' },
    { id: 'security', name: 'Security', icon: Shield, color: 'from-red-500 to-pink-600' },
    { id: 'support', name: 'Support', icon: Phone, color: 'from-teal-500 to-green-600' },
    { id: 'communication', name: 'Communication', icon: MessageSquare, color: 'from-violet-500 to-purple-600' },
    { id: 'teachers', name: 'Teacher Management', icon: UserCheck, color: 'from-cyan-500 to-blue-600' },
    { id: 'library', name: 'Library', icon: Database, color: 'from-emerald-500 to-teal-600' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'from-amber-500 to-yellow-600' },
    { id: 'mobile', name: 'Mobile App', icon: Smartphone, color: 'from-slate-500 to-gray-600' },
    { id: 'integration', name: 'Integration', icon: Globe, color: 'from-blue-500 to-indigo-600' },
    { id: 'performance', name: 'Performance', icon: Zap, color: 'from-lime-500 to-green-600' }
  ];

  // Complete FAQ Data with all 30 questions
  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'How do I get started with the school management system?',
      answer: 'To get started, log in with your administrator credentials. First, set up your school information under Settings > School Information. Then add classes, subjects, and teachers. Finally, begin enrolling students. Our setup wizard will guide you through each step.'
    },
    {
      id: 2,
      category: 'students',
      question: 'How can I enroll new students in bulk?',
      answer: 'You can enroll students in bulk by going to Students > Bulk Upload. Download our Excel template, fill in the student information, and upload the file. The system will validate the data and show you any errors before processing. You can upload up to 500 students at once.'
    },
    {
      id: 3,
      category: 'academics',
      question: 'How do I create and manage class schedules?',
      answer: 'Navigate to Academics > Routines to create class schedules. You can set up different timetables for each class, assign teachers to subjects, and specify classroom locations. The system automatically checks for conflicts and prevents double-booking of teachers or rooms.'
    },
    {
      id: 4,
      category: 'fees',
      question: 'What payment methods are supported for fee collection?',
      answer: 'Our system supports multiple payment methods including bank transfers, online payments through payment gateways, cash payments, and installment plans. You can configure payment deadlines, late fees, and send automated payment reminders to parents.'
    },
    {
      id: 5,
      category: 'attendance',
      question: 'How does the attendance tracking system work?',
      answer: 'Teachers can mark attendance daily through the Attendance module. The system supports multiple attendance statuses (Present, Absent, Late, Excused). You can generate attendance reports, set minimum attendance requirements, and send notifications to parents when students are absent.'
    },
    {
      id: 6,
      category: 'reports',
      question: 'What types of reports can I generate?',
      answer: 'The system generates comprehensive reports including student progress reports, attendance summaries, fee collection reports, teacher performance analytics, class-wise academic reports, and financial statements. All reports can be exported to PDF or Excel formats.'
    },
    {
      id: 7,
      category: 'security',
      question: 'How secure is my school data?',
      answer: 'We implement enterprise-grade security measures including SSL encryption, regular data backups, role-based access control, and secure hosting infrastructure. Your data is stored in compliance with educational data protection regulations and is backed up daily.'
    },
    {
      id: 8,
      category: 'general',
      question: 'Can parents access the system to view their child\'s progress?',
      answer: 'Yes! Parents receive login credentials to access a dedicated parent portal where they can view their child\'s attendance, grades, assignments, fee status, and school announcements. They can also communicate with teachers through the messaging system.'
    },
    {
      id: 9,
      category: 'support',
      question: 'What support options are available if I need help?',
      answer: 'We offer multiple support channels: 24/7 email support, live chat during business hours, phone support for urgent issues, comprehensive documentation, video tutorials, and webinar training sessions. Premium users get priority support and dedicated account managers.'
    },
    {
      id: 10,
      category: 'academics',
      question: 'How do I set up examinations and grade management?',
      answer: 'Go to Academics > Examinations to create exam schedules, set up grading schemes, and configure result templates. Teachers can enter marks online, and the system automatically calculates grades, rankings, and generates report cards. You can also set up continuous assessment and project-based evaluations.'
    },
    {
      id: 11,
      category: 'teachers',
      question: 'How do I manage teacher profiles and assignments?',
      answer: 'Navigate to Teachers section to add new teachers, manage their profiles, assign subjects and classes, track their performance, and manage their schedules. You can also set up teacher evaluation systems and performance tracking.'
    },
    {
      id: 12,
      category: 'library',
      question: 'How does the library management system work?',
      answer: 'The library module allows you to catalog books, manage book issues and returns, track overdue books, calculate fines, and generate library reports. Students and teachers can search for books and request reservations through the system.'
    },
    {
      id: 13,
      category: 'communication',
      question: 'How can I send announcements to parents and students?',
      answer: 'Use the Communication module to send announcements via SMS, email, or in-app notifications. You can target specific classes, create scheduled announcements, and track delivery status. The system also supports emergency broadcast messages.'
    },
    {
      id: 14,
      category: 'fees',
      question: 'How do I set up different fee structures for different classes?',
      answer: 'Go to Fees > Fee Structure to create customized fee plans for each class or student category. You can set up tuition fees, activity fees, library fees, and other charges. The system supports both one-time and recurring fee structures.'
    },
    {
      id: 15,
      category: 'attendance',
      question: 'Can I track attendance for extracurricular activities?',
      answer: 'Yes, the system allows you to create separate attendance registers for sports, clubs, events, and other extracurricular activities. You can generate participation reports and track student involvement in various school activities.'
    },
    {
      id: 16,
      category: 'students',
      question: 'How do I transfer students between classes or schools?',
      answer: 'Use the Student Transfer feature to move students between classes within your school or transfer them to other institutions. The system maintains complete academic history and generates transfer certificates automatically.'
    },
    {
      id: 17,
      category: 'notifications',
      question: 'How do automated notifications work?',
      answer: 'The system sends automatic notifications for various events like low attendance, fee due dates, exam schedules, and important announcements. You can customize notification preferences and delivery methods (SMS, email, or app notifications).'
    },
    {
      id: 18,
      category: 'reports',
      question: 'Can I create custom reports?',
      answer: 'Yes, our advanced reporting module allows you to create custom reports using drag-and-drop report builder. You can select data fields, apply filters, and design layouts according to your specific requirements.'
    },
    {
      id: 19,
      category: 'security',
      question: 'How do user roles and permissions work?',
      answer: 'The system uses role-based access control with predefined roles like Admin, Teacher, Accountant, Librarian, and Parent. Each role has specific permissions, and you can customize access levels for different modules and features.'
    },
    {
      id: 20,
      category: 'mobile',
      question: 'Is there a mobile app available?',
      answer: 'Yes, we offer mobile apps for both Android and iOS platforms. The mobile apps provide access to key features like attendance marking, gradebook, messaging, and notifications, allowing teachers and parents to stay connected on the go.'
    },
    {
      id: 21,
      category: 'integration',
      question: 'Can the system integrate with other educational tools?',
      answer: 'Our system supports integration with popular educational platforms, payment gateways, SMS services, and email providers through APIs. We also offer custom integration services for specific third-party tools your school may be using.'
    },
    {
      id: 22,
      category: 'academics',
      question: 'How do I manage homework and assignments?',
      answer: 'Teachers can create and assign homework through the Assignments module, set due dates, attach files, and track submission status. Students can submit assignments online, and teachers can grade them digitally with feedback.'
    },
    {
      id: 23,
      category: 'performance',
      question: 'How can I optimize system performance?',
      answer: 'The system is optimized for performance with features like data caching, optimized database queries, and CDN delivery. For best performance, ensure stable internet connection and use recommended browsers. Contact support for performance tuning.'
    },
    {
      id: 24,
      category: 'fees',
      question: 'How do I handle fee refunds and adjustments?',
      answer: 'Navigate to Fees > Adjustments to process fee refunds, discounts, or corrections. The system maintains complete audit trails for all financial transactions and can generate refund receipts automatically.'
    },
    {
      id: 25,
      category: 'teachers',
      question: 'How do teachers mark attendance efficiently?',
      answer: 'Teachers can mark attendance using various methods: manual entry, QR code scanning, or biometric integration. The system supports bulk attendance marking and provides attendance analytics to identify patterns and trends.'
    },
    {
      id: 26,
      category: 'communication',
      question: 'How does the parent-teacher communication work?',
      answer: 'The system provides a secure messaging platform where parents and teachers can communicate directly. Teachers can share student progress, homework updates, and behavioral notes, while parents can ask questions and schedule meetings.'
    },
    {
      id: 27,
      category: 'library',
      question: 'How do I manage digital library resources?',
      answer: 'The library module supports both physical and digital resources. You can upload e-books, manage access permissions, track digital resource usage, and provide students with online access to educational materials.'
    },
    {
      id: 28,
      category: 'general',
      question: 'How do I backup and restore school data?',
      answer: 'The system automatically creates daily backups of all school data. Administrators can also initiate manual backups and restore data from specific backup points. All backups are encrypted and stored securely in multiple locations.'
    },
    {
      id: 29,
      category: 'students',
      question: 'How do I manage student disciplinary records?',
      answer: 'Use the Student Management > Disciplinary Records section to track behavioral incidents, disciplinary actions, and student counseling sessions. The system maintains confidential records and generates behavioral reports for parent meetings.'
    },
    {
      id: 30,
      category: 'support',
      question: 'How do I schedule training sessions for my staff?',
      answer: 'Contact our support team to schedule training sessions for your staff. We offer both virtual and on-site training programs covering system administration, daily operations, and advanced features. Training materials and recordings are also available online.'
    }
  ];

  // Filter FAQs based on search term and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse ${isDarkMode ? "bg-purple-500/10" : "bg-purple-300/20"
          }`}></div>
        <div className={`absolute top-40 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 ${isDarkMode ? "bg-cyan-500/10" : "bg-cyan-300/20"
          }`}></div>
        <div className={`absolute -bottom-32 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 ${isDarkMode ? "bg-pink-500/10" : "bg-pink-300/20"
          }`}></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Enhanced Animation */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-spin-slow opacity-20 scale-110"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <HelpCircle className="w-10 h-10 text-white" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}>
            Find answers to common questions about our school management system.
            Can&apos;t find what you&apos;re looking for? Our support team is here to help!
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div className={`mb-10 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
            <div className={`relative backdrop-blur-xl rounded-2xl border shadow-2xl p-6 ${isDarkMode
                ? "bg-slate-800/80 border-slate-700/20"
                : "bg-white/80 border-white/20"
              }`}>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400 animate-pulse" />
                </div>
                <Input
                  type="text"
                  placeholder="Search through our knowledge base..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-12 pr-4 py-4 bg-transparent border-0 text-lg focus:ring-2 focus:ring-purple-500/50 focus:outline-none ${isDarkMode
                      ? "text-white placeholder:text-slate-400"
                      : "text-slate-900 placeholder:text-slate-400"
                    }`}
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <div className={`text-sm px-2 py-1 rounded-lg ${isDarkMode ? "text-slate-400 bg-slate-700" : "text-slate-400 bg-slate-100"
                    }`}>
                    {filteredFAQs.length} results
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className={`mb-10 transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <h3 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? "text-slate-200" : "text-slate-800"
            }`}>
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 max-w-7xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${isActive
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-2xl shadow-purple-500/25'
                      : isDarkMode
                        ? 'bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800 hover:shadow-xl text-slate-300'
                        : 'bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:shadow-xl text-slate-700'
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {!isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                  )}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive
                        ? 'bg-white/20'
                        : isDarkMode
                          ? 'bg-slate-700 group-hover:bg-gradient-to-br group-hover:from-purple-500/10 group-hover:to-blue-500/10'
                          : 'bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-purple-500/10 group-hover:to-blue-500/10'
                      }`}>
                      <IconComponent className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`} />
                    </div>
                    <span className={`text-xs font-medium transition-colors duration-300 ${isActive ? 'text-white' : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Summary */}
        <div className={`mb-8 text-center transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className={`inline-flex items-center space-x-2 backdrop-blur-sm rounded-full px-6 py-3 border ${isDarkMode
              ? "bg-slate-800/60 border-slate-700/50"
              : "bg-white/60 border-slate-200/50"
            }`}>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedCategoryData?.color || 'from-purple-500 to-blue-600'} animate-pulse`}></div>
            <span className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              Showing {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategoryData?.name}`}
            </span>
          </div>
        </div>

        {/* Enhanced FAQ Accordion */}
        {filteredFAQs.length > 0 ? (
          <div className={`transform transition-all duration-1000 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${faq.id}`}
                    className="border-0"
                  >
                    <div
                      className={`group relative backdrop-blur-xl cursor-pointer rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode
                          ? "bg-slate-800/70 border-slate-700/50 hover:shadow-purple-500/10"
                          : "bg-white/70 border-slate-200/50 hover:shadow-purple-500/10"
                        } ${hoveredCard === faq.id ? 'shadow-2xl shadow-purple-500/10' : 'shadow-lg'
                        }`}
                      onMouseEnter={() => setHoveredCard(faq.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >


                      <AccordionTrigger className="px-8 py-6 hover:no-underline [&>svg]:ml-auto">
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${categories.find(c => c.id === faq.category)?.color || 'from-purple-500 to-blue-600'
                          } opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                        <div className="flex items-start gap-4 text-left w-full">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br ${categories.find(c => c.id === faq.category)?.color || 'from-purple-500 to-blue-600'
                            } flex items-center justify-center text-white font-bold text-sm shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 leading-relaxed ${isDarkMode ? "text-slate-200" : "text-slate-800"
                              }`}>
                              {faq.question}
                            </h3>
                            <div className={`text-sm mt-1 capitalize ${isDarkMode ? "text-slate-400" : "text-slate-500"
                              }`}>
                              {categories.find(c => c.id === faq.category)?.name || faq.category}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-8 pb-6">
                        <div className="ml-12 prose prose-slate dark:prose-invert max-w-none">
                          <div className={`p-6 rounded-xl border ${isDarkMode
                              ? "bg-slate-900/50 border-slate-700/50"
                              : "bg-slate-50/50 border-slate-100"
                            }`}>
                            <p className={`leading-relaxed mb-0 ${isDarkMode ? "text-slate-300" : "text-slate-700"
                              }`}>
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        ) : (
          <div className={`transform transition-all duration-1000 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="max-w-md mx-auto text-center py-16">
              <div className="relative mb-8">
                <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center animate-pulse ${isDarkMode
                    ? "bg-gradient-to-br from-slate-700 to-slate-800"
                    : "bg-gradient-to-br from-slate-200 to-slate-300"
                  }`}>
                  <HelpCircle className={`w-12 h-12 ${isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">?</span>
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-slate-200" : "text-slate-800"
                }`}>No results found</h3>
              <p className={`mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                Try adjusting your search terms or selecting a different category.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Contact Support Section */}
        <div className={`my-16 transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl"></div>
            <div className={`relative backdrop-blur-xl rounded-3xl border p-12 text-center overflow-hidden ${isDarkMode
                ? "bg-slate-800/70 border-slate-700/50"
                : "bg-white/70 border-slate-200/50"
              }`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500"></div>
              </div>

              <div className="relative z-10">
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-ping opacity-20 scale-110"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Still need help?
                </h3>
                <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  Our dedicated support team is available 24/7 to assist you with any questions or technical issues.
                </p>

                {/* <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg rounded-xl">
                    <Phone className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                    Contact Support
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    className={`group backdrop-blur-sm border-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg rounded-xl ${isDarkMode
                        ? "bg-slate-800/50 border-purple-800 text-purple-400 hover:bg-purple-900/20"
                        : "bg-white/50 border-purple-200 text-purple-600 hover:bg-purple-50"
                      }`}
                  >
                    <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                    Schedule a Demo
                  </Button>
                </div> */}

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  {/* Contact Support Button */}
                  <Button className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg rounded-xl flex items-center overflow-hidden">
                    <Phone className="w-5 h-5 mr-3 group-hover:animate-bounce" />

                    {/* Default text */}
                    <span className="block group-hover:hidden">Contact Support</span>

                    {/* Hover text */}
                    <span className="hidden group-hover:block">+91 8343939495 </span>

                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>

                  {/* Schedule a Demo Button */}
                  <Button
                    variant="outline"
                    className={`group backdrop-blur-sm border-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg rounded-xl ${isDarkMode
                        ? "bg-slate-800/50 border-purple-800 text-purple-400 hover:bg-purple-900/20"
                        : "bg-white/50 border-purple-200 text-purple-600 hover:bg-purple-50"
                      }`}
                  >
                    <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                    Schedule a Demo
                  </Button>
                </div>


                <div className={`mt-8  flex items-center justify-center space-x-6 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Chat Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>Expert Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FaqPage;