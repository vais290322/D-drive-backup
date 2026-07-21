import React, { useState } from 'react';
import { 
  Shield, 
  Smartphone, 
  Laptop, 
  Server, 
  HardDrive, 
  Cpu, 
  Wifi, 
  Download,
  Monitor,
  Battery,
  Settings,
  Globe,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Cloud,
  Lock,
  ExternalLink
} from 'lucide-react';

const SystemRequirement = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('android');

  const bgClass = darkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-gray-100 via-red-100 to-gray-200";
  
  const textClass = darkMode ? "text-white" : "text-gray-900";
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600";

  const platforms = [
    {
      id: 'android',
      name: 'Android',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  const requirements = {
    android: {
      minimum: [
        { text: 'Android 6.0 or higher', icon: <Shield className="w-5 h-5" /> },
        { text: '2GB RAM', icon: <Cpu className="w-5 h-5" /> },
        { text: '100MB free storage', icon: <HardDrive className="w-5 h-5" /> },
        { text: 'Internet connection', icon: <Wifi className="w-5 h-5" /> },
        { text: 'Google Play Services', icon: <Globe className="w-5 h-5" /> }
      ],
      recommended: [
        { text: 'Android 8.0 or higher', icon: <Shield className="w-5 h-5" /> },
        { text: '4GB RAM or more', icon: <Cpu className="w-5 h-5" /> },
        { text: '500MB free storage', icon: <HardDrive className="w-5 h-5" /> },
        { text: 'Stable internet connection', icon: <Wifi className="w-5 h-5" /> },
        { text: 'Latest Google Play Services', icon: <Globe className="w-5 h-5" /> }
      ]
    },
    ios: {
      minimum: [
        { text: 'iOS 13 or higher', icon: <Shield className="w-5 h-5" /> },
        { text: 'iPhone 6s or newer', icon: <Smartphone className="w-5 h-5" /> },
        { text: '2GB RAM', icon: <Cpu className="w-5 h-5" /> },
        { text: '100MB free storage', icon: <HardDrive className="w-5 h-5" /> },
        { text: 'Internet connection', icon: <Wifi className="w-5 h-5" /> }
      ],
      recommended: [
        { text: 'iOS 15 or higher', icon: <Shield className="w-5 h-5" /> },
        { text: 'iPhone X or newer', icon: <Smartphone className="w-5 h-5" /> },
        { text: '3GB RAM or more', icon: <Cpu className="w-5 h-5" /> },
        { text: '500MB free storage', icon: <HardDrive className="w-5 h-5" /> },
        { text: 'Stable internet connection', icon: <Wifi className="w-5 h-5" /> }
      ]
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Optimized for minimal resource usage and maximum performance',
      color: 'yellow'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Secure by Design',
      description: 'Built with security-first architecture for complete protection',
      color: 'red'
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'Cloud Powered',
      description: 'Advanced threat detection powered by cloud intelligence',
      color: 'blue'
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: 'Battery Friendly',
      description: 'Intelligent power management for all-day protection',
      color: 'green'
    }
  ];

  const compatibleDevices = {
    android: [
      'Samsung Galaxy Series',
      'Google Pixel Series',
      'OnePlus Devices',
      'Xiaomi Smartphones',
      'Huawei Devices',
      'LG Smartphones',
      'Sony Xperia Series'
    ],
    ios: [
      'iPhone 6s and newer',
      'iPad Air 2 and newer',
      'iPad Pro (all models)',
      'iPad mini 4 and newer',
      'iPod touch (7th generation)'
    ]
  };

  return (
    <div className={bgClass}>
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Enhanced Navigation */}
      <nav className={`relative z-50 px-6 py-4 border-b ${darkMode ? 'border-white/10' : 'border-black/10'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.history.back()}>
            <Shield className="w-10 h-10 text-red-500 drop-shadow-lg" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold tracking-wider">SYSTEM REQUIREMENTS</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 ${mutedTextClass} hover:${textClass} transition-colors`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">vais.co.in</span>
            </a>
            
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-red-500 to-blue-500 p-4 rounded-2xl animate-pulse">
              <Settings className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold ${textClass} mb-6 leading-tight`}>
            System Requirements
          </h1>
          <p className={`text-xl ${mutedTextClass} max-w-4xl mx-auto leading-relaxed`}>
            Ensure your device meets these requirements for optimal performance, security, and protection. 
            SecureGuard is designed to work efficiently across a wide range of devices.
          </p>
        </div>

        {/* Platform Selector */}
        <div className="flex justify-center mb-12">
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-2 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
            <div className="flex space-x-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex cursor-pointer items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPlatform === platform.id 
                      ? `bg-gradient-to-r ${platform.gradient} text-white shadow-lg transform scale-105` 
                      : `${mutedTextClass} hover:${textClass} hover:bg-white/5`
                  }`}
                >
                  {platform.icon}
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Minimum Requirements */}
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} hover:transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${textClass}`}>Minimum Requirements</h2>
                <p className={`${mutedTextClass} text-sm`}>Basic specs needed to run SecureGuard</p>
              </div>
            </div>

            <div className="space-y-4">
              {requirements[selectedPlatform].minimum.map((req, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg bg-${darkMode ? 'white/5' : 'black/5'} hover:bg-${darkMode ? 'white/10' : 'black/10'} transition-colors`}>
                  <div className="text-red-400">
                    {req.icon}
                  </div>
                  <span className={textClass}>{req.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Requirements */}
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} hover:transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${textClass}`}>Recommended Specifications</h2>
                <p className={`${mutedTextClass} text-sm`}>For optimal performance and features</p>
              </div>
            </div>

            <div className="space-y-4">
              {requirements[selectedPlatform].recommended.map((req, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg bg-${darkMode ? 'white/5' : 'black/5'} hover:bg-${darkMode ? 'white/10' : 'black/10'} transition-colors`}>
                  <div className="text-green-400">
                    {req.icon}
                  </div>
                  <span className={textClass}>{req.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold ${textClass} mb-8 text-center`}>Why Choose SecureGuard?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} text-center hover:transform hover:scale-105 transition-all duration-300`}>
                <div className={`text-${feature.color}-500 mb-4 flex justify-center`}>
                  {feature.icon}
                </div>
                <h3 className={`font-bold ${textClass} mb-2`}>{feature.title}</h3>
                <p className={`${mutedTextClass} text-sm`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compatible Devices */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold ${textClass} mb-8 text-center`}>Compatible Devices</h2>
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compatibleDevices[selectedPlatform].map((device, index) => (
                <div key={index} className={`flex items-center space-x-3 p-4 rounded-lg bg-${darkMode ? 'white/5' : 'black/5'} hover:bg-${darkMode ? 'white/10' : 'black/10'} transition-colors`}>
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className={textClass}>{device}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className={`bg-gradient-to-r ${darkMode ? 'from-yellow-900/20 to-orange-900/20' : 'from-yellow-100/50 to-orange-100/50'} p-8 rounded-2xl border ${darkMode ? 'border-yellow-500/20' : 'border-yellow-300/20'} mb-16`}>
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <h3 className={`text-2xl font-bold ${textClass}`}>Important Notes</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`flex items-start space-x-3 ${mutedTextClass}`}>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>Requirements may vary based on device manufacturer and specific model configurations</span>
            </div>
            <div className={`flex items-start space-x-3 ${mutedTextClass}`}>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>Some advanced features may require additional system resources and permissions</span>
            </div>
            <div className={`flex items-start space-x-3 ${mutedTextClass}`}>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>Regular app updates may occasionally change minimum system requirements</span>
            </div>
            <div className={`flex items-start space-x-3 ${mutedTextClass}`}>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>For optimal performance, ensure your device has sufficient free storage space</span>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="text-center">
          <div className={`bg-gradient-to-r ${darkMode ? 'from-red-900/30 to-blue-900/30' : 'from-red-100/50 to-blue-100/50'} p-12 rounded-2xl border ${darkMode ? 'border-red-500/20' : 'border-red-300/20'}`}>
            <h2 className={`text-3xl font-bold ${textClass} mb-6`}>Ready to Get Protected?</h2>
            <p className={`text-lg ${mutedTextClass} mb-8 max-w-2xl mx-auto`}>
              Your device meets the requirements? Download SecureGuard now and join millions of protected users worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <Download className="w-6 h-6" />
                <span>Download Free</span>
              </button>
              <a 
                href="https://vais.co.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-white/20 text-blue-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Learn More</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className={`relative z-10 px-6 py-12 border-t ${darkMode ? 'border-white/10' : 'border-black/10'} bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm mt-20`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-red-500" />
              <span className={`font-bold ${textClass}`}>SecureGuard</span>
            </div>
            <p className={`${mutedTextClass} text-sm mb-4`}>
              © {new Date().getFullYear()} SecureGuard by VAIS Engineering Pvt Ltd. All rights reserved.
            </p>
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              <span>Part of VAIS Engineering</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SystemRequirement;