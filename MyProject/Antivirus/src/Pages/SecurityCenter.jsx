import React, { useState, useEffect } from 'react'
import { 
  Shield,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Wifi,
  HardDrive,
  Globe,
  Settings,
  Activity,
  Zap,
  UserCheck,
  Download,
  Clock,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  FileText,
  Smartphone,
  Monitor,
  Server,
  Bug,
  Database
} from 'lucide-react'

const SecurityCenter = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"
  const cardClass = `bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm rounded-xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`

  // Simulate scan progress
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false)
            return 100
          }
          return prev + Math.random() * 10
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isScanning])

  const securityStatus = {
    overall: 'Protected',
    lastScan: '2 hours ago',
    threatsBlocked: 247,
    updates: 'Up to date',
    quarantinedFiles: 8,
    activeSessions: 3,
    dataEncrypted: '2.4TB',
    modules: [
      { name: 'Real-time Protection', status: 'Active', icon: Shield, color: 'green' },
      { name: 'Web Protection', status: 'Active', icon: Globe, color: 'blue' },
      { name: 'Network Security', status: 'Active', icon: Wifi, color: 'purple' },
      { name: 'Drive Scanner', status: 'Active', icon: HardDrive, color: 'orange' }
    ]
  }

  const recentThreats = [
    { name: 'Malware.Generic.KX', type: 'Trojan', blocked: '2 hours ago', severity: 'High' },
    { name: 'Phishing.Email.JS', type: 'Phishing', blocked: '4 hours ago', severity: 'Medium' },
    { name: 'Adware.Popup.Win32', type: 'Adware', blocked: '6 hours ago', severity: 'Low' },
    { name: 'Ransomware.Encrypt.V2', type: 'Ransomware', blocked: '8 hours ago', severity: 'Critical' }
  ]

  const systemStats = [
    { label: 'CPU Usage', value: '23%', icon: Activity, color: 'green' },
    { label: 'Memory', value: '4.2GB', icon: Database, color: 'blue' },
    { label: 'Network', value: '125 MB/s', icon: TrendingUp, color: 'purple' },
    { label: 'Temperature', value: '47°C', icon: Zap, color: 'orange' }
  ]

  const connectedDevices = [
    { name: 'Desktop PC', type: 'Windows 11', status: 'Protected', icon: Monitor },
    { name: 'iPhone 15', type: 'iOS 17', status: 'Protected', icon: Smartphone },
    { name: 'MacBook Pro', type: 'macOS', status: 'Protected', icon: Monitor },
    { name: 'Home Server', type: 'Linux', status: 'Protected', icon: Server },
    { name: 'Android Phone', type: 'Android', status: 'Protected', icon: Smartphone },
  ]

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-500'
      case 'High': return 'text-orange-500'
      case 'Medium': return 'text-yellow-500'
      case 'Low': return 'text-blue-500'
      default: return mutedTextClass
    }
  }

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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <Shield className="w-10 h-10 text-red-500" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">SECURITY CENTER</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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

      {/* Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
        <div className={`${cardClass} p-1`}>
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'threats', label: 'Threats', icon: Bug },
              { id: 'devices', label: 'Devices', icon: Monitor },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg cursor-pointer transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-500 text-white'
                      : `${mutedTextClass} hover:${textClass}`
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Status Overview */}
            <div className={`${cardClass} p-8 mb-8`}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{securityStatus.overall}</div>
                  <div className={`${mutedTextClass} text-sm`}>System Status</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{securityStatus.threatsBlocked}</div>
                  <div className={`${mutedTextClass} text-sm`}>Threats Blocked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{securityStatus.quarantinedFiles}</div>
                  <div className={`${mutedTextClass} text-sm`}>Quarantined Files</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{securityStatus.dataEncrypted}</div>
                  <div className={`${mutedTextClass} text-sm`}>Data Encrypted</div>
                </div>
              </div>
            </div>

            {/* Scan Section */}
            {isScanning && (
              <div className={`${cardClass} p-6 mb-8`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                    <div>
                      <h3 className={`font-semibold ${textClass}`}>System Scan in Progress</h3>
                      <p className={mutedTextClass}>Scanning system files and processes...</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${textClass}`}>{Math.round(scanProgress)}%</div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Security Modules Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {securityStatus.modules.map((module, index) => {
                const IconComponent = module.icon
                return (
                  <div key={index} className={`${cardClass} p-6`}>
                    <div className="flex items-center space-x-4">
                      <IconComponent className={`w-8 h-8 text-${module.color}-400`} />
                      <div>
                        <h3 className={`font-semibold ${textClass}`}>{module.name}</h3>
                        <p className="text-green-400 text-sm">{module.status}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* System Stats */}
            <div className={`${cardClass} p-6 mb-8`}>
              <h3 className={`text-xl font-bold ${textClass} mb-4`}>System Performance</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {systemStats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <IconComponent className={`w-8 h-8 text-${stat.color}-400 mx-auto mb-2`} />
                      <div className={`text-2xl font-bold ${textClass}`}>{stat.value}</div>
                      <div className={`${mutedTextClass} text-sm`}>{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4">
              <button 
                onClick={startScan}
                disabled={isScanning}
                className="p-4 bg-red-500 hover:bg-red-600 disabled:bg-red-700 text-white rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isScanning ? 'Scanning...' : 'Quick Scan'}
              </button>
              <button className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors cursor-pointer">
                Update Database
              </button>
              <button className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors cursor-pointer">
                View Reports
              </button>
              <button className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors cursor-pointer">
                Settings
              </button>
            </div>
          </>
        )}

        {activeTab === 'threats' && (
          <div className={`${cardClass} p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-6`}>Recent Threats Blocked</h3>
            <div className="space-y-4">
              {recentThreats.map((threat, index) => (
                <div key={index} className={`${cardClass} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <div>
                        <h4 className={`font-semibold ${textClass}`}>{threat.name}</h4>
                        <p className={mutedTextClass}>{threat.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={getSeverityColor(threat.severity)}>{threat.severity}</div>
                      <div className={`${mutedTextClass} text-sm`}>{threat.blocked}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className={`${cardClass} p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-6`}>Connected Devices</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {connectedDevices.map((device, index) => {
                const IconComponent = device.icon
                return (
                  <div key={index} className={`${cardClass} p-4`}>
                    <div className="flex items-center space-x-4">
                      <IconComponent className="w-8 h-8 text-blue-400" />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${textClass}`}>{device.name}</h4>
                        <p className={mutedTextClass}>{device.type}</p>
                      </div>
                      <div className="text-green-400">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className={`${cardClass} p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-6`}>Security Reports</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`${cardClass} p-4 cursor-pointer hover:bg-white/5 transition-colors`}>
                <FileText className="w-8 h-8 text-green-400 mb-3" />
                <h4 className={`font-semibold ${textClass} mb-2`}>Weekly Summary</h4>
                <p className={mutedTextClass}>Complete security overview for the past week</p>
              </div>
              <div className={`${cardClass} p-4 cursor-pointer hover:bg-white/5 transition-colors`}>
                <Activity className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className={`font-semibold ${textClass} mb-2`}>Threat Analysis</h4>
                <p className={mutedTextClass}>Detailed analysis of blocked threats</p>
              </div>
              <div className={`${cardClass} p-4 cursor-pointer hover:bg-white/5 transition-colors`}>
                <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className={`font-semibold ${textClass} mb-2`}>Performance Report</h4>
                <p className={mutedTextClass}>System performance and optimization tips</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecurityCenter