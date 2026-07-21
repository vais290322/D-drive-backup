import React, { useState, useEffect } from 'react'
import { 
  Shield,
  Bug,
  ArrowLeft,
  Eye,
  EyeOff,
  Send,
  AlertTriangle,
  CheckCircle,
  X,
  Upload,
  FileText,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  User,
  MessageSquare,
  Camera,
  Paperclip,
  Info,
  Star,
  ThumbsUp,
  Settings,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  Zap,
  AlertCircle,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router'

const ReportBug = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    deviceInfo: '',
    browserInfo: '',
    email: '',
    firstName: '',
    lastName: '',
    priority: 'medium',
    category: 'general',
    screenshots: [],
    logFiles: [],
    reproduced: false,
    frequency: 'sometimes',
    environment: 'production',
    version: '',
    additionalInfo: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [dragOver, setDragOver] = useState(false)

  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"
  const inputClass = darkMode 
    ? "bg-black/20 border-white/10 text-white placeholder-gray-400" 
    : "bg-white/20 border-black/10 text-gray-900 placeholder-gray-500"
  const cardClass = `bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm rounded-xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`

  const steps = [
    { title: 'Bug Details', icon: Bug, description: 'Describe the issue' },
    { title: 'Technical Info', icon: Settings, description: 'System information' },
    { title: 'Contact & Priority', icon: User, description: 'Contact details' },
    { title: 'Attachments', icon: Paperclip, description: 'Screenshots & logs' }
  ]

  const categories = [
    { id: 'general', label: 'General Issue', icon: Bug },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'ui', label: 'User Interface', icon: Monitor },
    { id: 'security', label: 'Security Feature', icon: Shield },
    { id: 'network', label: 'Network/Connectivity', icon: Globe },
    { id: 'installation', label: 'Installation', icon: Download }
  ]

  const priorities = [
    { id: 'low', label: 'Low', color: 'blue', description: 'Minor issue, workaround available' },
    { id: 'medium', label: 'Medium', color: 'yellow', description: 'Moderate impact on functionality' },
    { id: 'high', label: 'High', color: 'orange', description: 'Significant impact, needs attention' },
    { id: 'critical', label: 'Critical', color: 'red', description: 'System unusable or security issue' }
  ]

  const environments = [
    { id: 'production', label: 'Production' },
    { id: 'beta', label: 'Beta Version' },
    { id: 'development', label: 'Development/Test' }
  ]

  // Auto-detect system info
  useEffect(() => {
    const detectSystemInfo = () => {
      const userAgent = navigator.userAgent
      const platform = navigator.platform
      const language = navigator.language
      
      setFormData(prev => ({
        ...prev,
        deviceInfo: `${platform} - ${userAgent}`,
        browserInfo: `${navigator.vendor} ${navigator.appVersion}`,
        version: 'SecureGuard v2.1.0' // This would be detected from actual app
      }))
    }
    
    detectSystemInfo()
  }, [])

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 0:
        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (formData.title.length < 10) newErrors.title = 'Title should be at least 10 characters'
        break
      case 1:
        // Technical info is mostly auto-filled, optional validation
        break
      case 2:
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
        break
      case 3:
        // Attachments are optional
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrev = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(activeStep)) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
      
      setTimeout(() => {
        setSubmitted(false)
        setActiveStep(0)
        setFormData({
          title: '',
          description: '',
          stepsToReproduce: '',
          expectedBehavior: '',
          actualBehavior: '',
          deviceInfo: '',
          browserInfo: '',
          email: '',
          firstName: '',
          lastName: '',
          priority: 'medium',
          category: 'general',
          screenshots: [],
          logFiles: [],
          reproduced: false,
          frequency: 'sometimes',
          environment: 'production',
          version: '',
          additionalInfo: ''
        })
      }, 5000)
    }, 2000)
  }

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (name === 'screenshots' || name === 'logFiles') {
      setFormData(prev => ({
        ...prev,
        [name]: [...Array.from(files)]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDrop = (e, fileType) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    setFormData(prev => ({
      ...prev,
      [fileType]: [...prev[fileType], ...files]
    }))
  }

  const removeFile = (fileType, index) => {
    setFormData(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }))
  }

  const copySystemInfo = () => {
    const systemInfo = `Device: ${formData.deviceInfo}\nBrowser: ${formData.browserInfo}\nVersion: ${formData.version}\nEnvironment: ${formData.environment}`
    navigator.clipboard.writeText(systemInfo)
  }

  const generateBugId = () => {
    return 'BUG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  const navigate= useNavigate();

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-red-900 to-slate-800' 
        : 'bg-gradient-to-br from-gray-50 via-red-50 to-gray-100'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')} >
            <Shield className="w-10 h-10 text-red-500" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">BUG REPORTING SYSTEM</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${cardClass} px-3 py-1`}>
              <Bug className="w-4 h-4 text-orange-400" />
              <span className={`text-sm ${mutedTextClass}`}>Step {activeStep + 1} of {steps.length}</span>
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
            >
              {darkMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className={`flex items-center space-x-2 ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold ${textClass} mb-4`}>
            Report a Bug
          </h1>
          <p className={`text-xl ${mutedTextClass} mb-6`}>
            Help us improve by providing detailed information about the issue
          </p>
          
          {/* Contact Support Info */}
          <div className={`${cardClass} p-4 mb-8`}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className={mutedTextClass}>info@vais.co.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className={mutedTextClass}>+91  83439 39495</span>
              </div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span className={mutedTextClass}>24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={`${cardClass} p-6 mb-8`}>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isActive = index === activeStep
              const isCompleted = index < activeStep
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${
                    isActive ? 'text-red-400' : isCompleted ? 'text-green-400' : mutedTextClass
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      isActive ? 'bg-red-500/20' : isCompleted ? 'bg-green-500/20' : 'bg-gray-500/20'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <div className="font-semibold">{step.title}</div>
                      <div className={`text-sm ${mutedTextClass}`}>{step.description}</div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 0: Bug Details */}
          {activeStep === 0 && (
            <div className={`${cardClass} p-8 space-y-6`}>
              <h3 className={`text-2xl font-bold ${textClass} mb-6`}>Bug Details</h3>
              
              {/* Category Selection */}
              <div>
                <label className={`block mb-3 font-medium ${textClass}`}>Bug Category</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <label
                        key={category.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.category === category.id
                            ? 'border-red-500 bg-red-500/10'
                            : `border-white/10 ${cardClass} hover:bg-white/5`
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={formData.category === category.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <IconComponent className="w-5 h-5 text-red-400" />
                        <span className={textClass}>{category.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className={`block mb-2 font-medium ${textClass}`}>
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass} ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                  placeholder="Brief, descriptive title of the issue"
                />
                {errors.title && (
                  <p className="mt-1 text-red-400 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={`block mb-2 font-medium ${textClass}`}>
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass} ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe the issue in detail..."
                />
                {errors.description && (
                  <p className="mt-1 text-red-400 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Steps to Reproduce */}
              <div>
                <label htmlFor="stepsToReproduce" className={`block mb-2 font-medium ${textClass}`}>
                  Steps to Reproduce
                </label>
                <textarea
                  id="stepsToReproduce"
                  name="stepsToReproduce"
                  value={formData.stepsToReproduce}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. Enter...&#10;4. Observe..."
                />
              </div>

              {/* Expected vs Actual */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expectedBehavior" className={`block mb-2 font-medium ${textClass}`}>
                    Expected Behavior
                  </label>
                  <textarea
                    id="expectedBehavior"
                    name="expectedBehavior"
                    value={formData.expectedBehavior}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                    placeholder="What should happen?"
                  />
                </div>
                <div>
                  <label htmlFor="actualBehavior" className={`block mb-2 font-medium ${textClass}`}>
                    Actual Behavior
                  </label>
                  <textarea
                    id="actualBehavior"
                    name="actualBehavior"
                    value={formData.actualBehavior}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                    placeholder="What actually happens?"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label htmlFor="frequency" className={`block mb-2 font-medium ${textClass}`}>
                  How often does this occur?
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                >
                  <option value="always">Always</option>
                  <option value="often">Often</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="rarely">Rarely</option>
                  <option value="once">Only once</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 1: Technical Info */}
          {activeStep === 1 && (
            <div className={`${cardClass} p-8 space-y-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${textClass}`}>Technical Information</h3>
                <button
                  type="button"
                  onClick={copySystemInfo}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${cardClass} hover:bg-white/5 transition-colors`}
                >
                  <Copy className="w-4 h-4" />
                  <span className={`text-sm ${mutedTextClass}`}>Copy Info</span>
                </button>
              </div>

              {/* Environment */}
              <div>
                <label className={`block mb-2 font-medium ${textClass}`}>Environment</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {environments.map((env) => (
                    <label
                      key={env.id}
                      className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.environment === env.id
                          ? 'border-red-500 bg-red-500/10'
                          : `border-white/10 ${cardClass} hover:bg-white/5`
                      }`}
                    >
                      <input
                        type="radio"
                        name="environment"
                        value={env.id}
                        checked={formData.environment === env.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className={textClass}>{env.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Auto-detected Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deviceInfo" className={`block mb-2 font-medium ${textClass}`}>
                    Device Information
                  </label>
                  <textarea
                    id="deviceInfo"
                    name="deviceInfo"
                    value={formData.deviceInfo}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                    placeholder="Auto-detected device info"
                  />
                </div>
                <div>
                  <label htmlFor="browserInfo" className={`block mb-2 font-medium ${textClass}`}>
                    Browser Information
                  </label>
                  <textarea
                    id="browserInfo"
                    name="browserInfo"
                    value={formData.browserInfo}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                    placeholder="Auto-detected browser info"
                  />
                </div>
              </div>

              {/* Version */}
              <div>
                <label htmlFor="version" className={`block mb-2 font-medium ${textClass}`}>
                  Software Version
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                  placeholder="e.g., SecureGuard v2.1.0"
                />
              </div>

              {/* Additional Technical Info */}
              <div>
                <label htmlFor="additionalInfo" className={`block mb-2 font-medium ${textClass}`}>
                  Additional Technical Details
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                  placeholder="Any other relevant technical information..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact & Priority */}
          {activeStep === 2 && (
            <div className={`${cardClass} p-8 space-y-6`}>
              <h3 className={`text-2xl font-bold ${textClass} mb-6`}>Contact Information & Priority</h3>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={`block mb-2 font-medium ${textClass}`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass} ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                    placeholder="Your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-red-400 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className={`block mb-2 font-medium ${textClass}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass}`}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={`block mb-2 font-medium ${textClass}`}>
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border backdrop-blur-sm ${inputClass} ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className={`block mb-3 font-medium ${textClass}`}>Issue Priority</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {priorities.map((priority) => (
                    <label
                      key={priority.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.priority === priority.id
                          ? `border-${priority.color}-500 bg-${priority.color}-500/10`
                          : `border-white/10 ${cardClass} hover:bg-white/5`
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority.id}
                        checked={formData.priority === priority.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-3 h-3 rounded-full bg-${priority.color}-500 mt-1`} />
                      <div>
                        <div className={`font-semibold ${textClass}`}>{priority.label}</div>
                        <div className={`text-sm ${mutedTextClass}`}>{priority.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Can reproduce */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="reproduced"
                    checked={formData.reproduced}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className={textClass}>I can consistently reproduce this issue</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Attachments */}
          {activeStep === 3 && (
            <div className={`${cardClass} p-8 space-y-6`}>
              <h3 className={`text-2xl font-bold ${textClass} mb-6`}>Attachments (Optional)</h3>

              {/* Screenshots */}
              <div>
                <label className={`block mb-3 font-medium ${textClass}`}>
                  Screenshots
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
                  }`}
                  onDrop={(e) => handleDrop(e, 'screenshots')}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className={`${mutedTextClass} mb-4`}>
                    Drag and drop images here, or click to browse
                  </p>
                  <input
                    type="file"
                    name="screenshots"
                    onChange={handleChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="screenshots"
                  />
                  <label
                    htmlFor="screenshots"
                  // Add this after the existing screenshots section:

                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer inline-block transition-colors"
                  >
                    Select Files
                  </label>
                </div>

                {/* Screenshot Preview */}
                {formData.screenshots.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.screenshots.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('screenshots', index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Log Files */}
              <div>
                <label className={`block mb-3 font-medium ${textClass}`}>
                  Log Files
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
                  }`}
                  onDrop={(e) => handleDrop(e, 'logFiles')}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className={`${mutedTextClass} mb-4`}>
                    Drag and drop log files here, or click to browse
                  </p>
                  <input
                    type="file"
                    name="logFiles"
                    onChange={handleChange}
                    multiple
                    accept=".log,.txt"
                    className="hidden"
                    id="logFiles"
                  />
                  <label
                    htmlFor="logFiles"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer inline-block transition-colors"
                  >
                    Select Files
                  </label>
                </div>

                {/* Log Files List */}
                {formData.logFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.logFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className={textClass}>{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('logFiles', index)}
                          className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrev}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${
                activeStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
              } transition-colors cursor-pointer`}
              disabled={activeStep === 0}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Success Message */}
        {submitted && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Bug report submitted successfully!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportBug