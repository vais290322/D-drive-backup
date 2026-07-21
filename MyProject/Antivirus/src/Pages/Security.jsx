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
  Globe,
  Smartphone,
  FileText,
  Settings,
  RefreshCw,
  Zap,
  Activity,
  TrendingUp,
  Database,
  Server,
  Monitor,
  AlertCircle,
  Clock,
  MapPin,
  Users,
  Bug,
  Download,
  Upload,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Key,
  Fingerprint,
  UserCheck,
  Mail,
  Calendar,
  BarChart3
} from 'lucide-react'

const Security = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [realTimeData, setRealTimeData] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkActivity: 0
  })
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"
  const cardClass = `bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm rounded-xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        cpuUsage: Math.floor(Math.random() * 30) + 10,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        networkActivity: Math.floor(Math.random() * 100) + 50
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Simulate scan progress
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 800)
      return () => clearInterval(interval)
    }
  }, [isScanning])

  const securityFeatures = [
    {
      title: 'Device Protection',
      icon: Smartphone,
      color: 'green',
      status: 'Protected',
      score: 98,
      details: [
        'Real-time scanning active',
        'Latest virus definitions',
        'Behavioral monitoring enabled',
        'App screening active'
      ]
    },
    {
      title: 'Web Security',
      icon: Globe,
      color: 'blue',
      status: 'Protected',
      score: 96,
      details: [
        'Safe browsing enabled',
        'Phishing protection active',
        'Download scanner on',
        'Web shield active'
      ]
    },
    {
      title: 'Network Security',
      icon: Wifi,
      color: 'purple',
      status: 'Protected',
      score: 94,
      details: [
        'Network monitoring active',
        'Firewall enabled',
        'VPN protection ready',
        'WiFi security active'
      ]
    },
    {
      title: 'Identity Protection',
      icon: Lock,
      color: 'orange',
      status: 'Protected',
      score: 97,
      details: [
        'Password manager active',
        'Data encryption on',
        'Privacy shield enabled',
        'Identity monitoring active'
      ]
    }
  ]

  const securityStats = {
    scannedFiles: '2,156,432',
    threatsBlocked: '8,843',
    lastUpdate: '15 minutes ago',
    securityScore: '96',
    quarantinedFiles: 23,
    activeSessions: 5,
    dataEncrypted: '4.8TB',
    uptime: '99.9%'
  }

  const recentThreats = [
    { name: 'Trojan.Generic.KXP', severity: 'High', time: '12 minutes ago', action: 'Quarantined' },
    { name: 'Phishing.Email.Suspicious', severity: 'Medium', time: '1 hour ago', action: 'Blocked' },
    { name: 'Malware.Download.Win32', severity: 'High', time: '2 hours ago', action: 'Removed' },
    { name: 'Adware.Browser.Extension', severity: 'Low', time: '4 hours ago', action: 'Cleaned' }
  ]

  const networkActivity = [
    { location: 'United States', requests: 1247, status: 'Safe' },
    { location: 'Canada', requests: 89, status: 'Safe' },
    { location: 'Germany', requests: 156, status: 'Safe' },
    { location: 'Unknown', requests: 3, status: 'Blocked' }
  ]

  const systemHealth = [
    { name: 'CPU Usage', value: realTimeData.cpuUsage, unit: '%', icon: Cpu, color: 'blue' },
    { name: 'Memory', value: realTimeData.memoryUsage, unit: '%', icon: MemoryStick, color: 'green' },
    { name: 'Network', value: realTimeData.networkActivity, unit: 'MB/s', icon: Network, color: 'purple' },
    { name: 'Storage', value: 67, unit: '%', icon: HardDrive, color: 'orange' }
  ]

  const securityModules = [
    { name: 'Real-time Protection', status: 'Active', lastUpdate: '2 min ago', icon: Shield },
    { name: 'Web Protection', status: 'Active', lastUpdate: '5 min ago', icon: Globe },
    { name: 'Email Scanner', status: 'Active', lastUpdate: '1 min ago', icon: Mail },
    { name: 'Firewall', status: 'Active', lastUpdate: '3 min ago', icon: Server },
    { name: 'Identity Guard', status: 'Active', lastUpdate: '7 min ago', icon: UserCheck },
    { name: 'Behavioral Analysis', status: 'Active', lastUpdate: '4 min ago', icon: Activity }
  ]

  const startScan = (type) => {
    setIsScanning(true)
    setScanProgress(0)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-500'
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
              <div className="text-xs text-red-400 font-semibold">SECURITY DASHBOARD</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${cardClass} px-3 py-1`}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className={`text-sm ${mutedTextClass}`}>Live Protection</span>
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

      {/* Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
        <div className={`${cardClass} p-1`}>
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'threats', label: 'Threats', icon: Bug },
              { id: 'network', label: 'Network', icon: Wifi },
              { id: 'system', label: 'System Health', icon: Activity },
              { id: 'reports', label: 'Reports', icon: BarChart3 }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center cursor-pointer space-x-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-red-500 text-white'
                      : `${mutedTextClass} hover:${textClass}`
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
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
            {/* Security Score Card */}
            <div className={`${cardClass} p-8 mb-8`}>
              <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-6">
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${textClass}`}>{securityStats.scannedFiles}</h3>
                  <p className={mutedTextClass}>Files Scanned</p>
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${textClass}`}>{securityStats.threatsBlocked}</h3>
                  <p className={mutedTextClass}>Threats Blocked</p>
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${textClass}`}>{securityStats.quarantinedFiles}</h3>
                  <p className={mutedTextClass}>Quarantined</p>
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${textClass}`}>{securityStats.activeSessions}</h3>
                  <p className={mutedTextClass}>Active Sessions</p>
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${textClass}`}>{securityStats.dataEncrypted}</h3>
                  <p className={mutedTextClass}>Data Encrypted</p>
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${textClass}`}>{securityStats.uptime}</h3>
                  <p className={mutedTextClass}>Uptime</p>
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${textClass}`}>{securityStats.lastUpdate}</h3>
                  <p className={mutedTextClass}>Last Update</p>
                </div>
                <div className="text-center">
                  <h3 className={`text-3xl font-bold text-green-400`}>{securityStats.securityScore}%</h3>
                  <p className={mutedTextClass}>Security Score</p>
                </div>
              </div>
            </div>

            {/* Scan Progress */}
            {isScanning && (
              <div className={`${cardClass} p-6 mb-8`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                    <div>
                      <h3 className={`font-semibold ${textClass}`}>Security Scan in Progress</h3>
                      <p className={mutedTextClass}>Analyzing files and system integrity...</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${textClass}`}>{Math.round(scanProgress)}%</div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Security Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className={`${cardClass} p-6`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 bg-${feature.color}-500/20 rounded-lg`}>
                          <IconComponent className={`w-8 h-8 text-${feature.color}-400`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${textClass}`}>{feature.title}</h3>
                          <p className="text-green-400 text-sm">{feature.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold text-${feature.color}-400`}>{feature.score}%</div>
                        <div className={`text-xs ${mutedTextClass}`}>Protection Level</div>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircle className={`w-4 h-4 text-${feature.color}-400 flex-shrink-0`} />
                          <span className={`${mutedTextClass} text-sm`}>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Security Modules Status */}
            <div className={`${cardClass} p-6 mb-8`}>
              <h3 className={`text-xl font-bold ${textClass} mb-6`}>Security Modules Status</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityModules.map((module, index) => {
                  const IconComponent = module.icon
                  return (
                    <div key={index} className={`${cardClass} p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-blue-400" />
                          <div>
                            <h4 className={`font-medium ${textClass} text-sm`}>{module.name}</h4>
                            <p className="text-green-400 text-xs">{module.status}</p>
                          </div>
                        </div>
                        <div className={`text-xs ${mutedTextClass}`}>{module.lastUpdate}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <button 
                onClick={() => startScan('quick')}
                disabled={isScanning}
                className="p-4 bg-red-500 hover:bg-red-600 disabled:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm">Quick Scan</span>
              </button>
              <button 
                onClick={() => startScan('full')}
                disabled={isScanning}
                className="p-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm">Full Scan</span>
              </button>
              <button className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                <Download className="w-5 h-5" />
                <span className="text-sm">Update</span>
              </button>
              <button className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Reports</span>
              </button>
              <button className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </button>
              <button className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Optimize</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'threats' && (
          <div className={`${cardClass} p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-6`}>Recent Security Threats</h3>
            <div className="space-y-4">
              {recentThreats.map((threat, index) => (
                <div key={index} className={`${cardClass} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <div>
                        <h4 className={`font-semibold ${textClass}`}>{threat.name}</h4>
                        <p className={`${mutedTextClass} text-sm`}>{threat.action} • {threat.time}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className={`${cardClass} p-6`}>
              <h3 className={`text-xl font-bold ${textClass} mb-6`}>Network Activity</h3>
              <div className="space-y-4">
                {networkActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className={`font-medium ${textClass}`}>{activity.location}</h4>
                        <p className={`${mutedTextClass} text-sm`}>{activity.requests} requests</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      activity.status === 'Safe' ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className={`${cardClass} p-6`}>
              <h3 className={`text-xl font-bold ${textClass} mb-6`}>System Health Monitoring</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemHealth.map((metric, index) => {
                  const IconComponent = metric.icon
                  return (
                    <div key={index} className={`${cardClass} p-4 text-center`}>
                      <IconComponent className={`w-8 h-8 text-${metric.color}-400 mx-auto mb-3`} />
                      <div className={`text-2xl font-bold ${textClass}`}>{metric.value}{metric.unit}</div>
                      <div className={`${mutedTextClass} text-sm`}>{metric.name}</div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-${metric.color}-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className={`${cardClass} p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-6`}>Security Reports & Analytics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${cardClass} p-6 cursor-pointer hover:bg-white/5 transition-colors`}>
                <Calendar className="w-8 h-8 text-green-400 mb-4" />
                <h4 className={`font-semibold ${textClass} mb-2`}>Daily Summary</h4>
                <p className={`${mutedTextClass} text-sm`}>Today's security activity and threat analysis</p>
              </div>
              <div className={`${cardClass} p-6 cursor-pointer hover:bg-white/5 transition-colors`}>
                <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className={`font-semibold ${textClass} mb-2`}>Weekly Trends</h4>
                <p className={`${mutedTextClass} text-sm`}>Security trends and performance metrics</p>
              </div>
              <div className={`${cardClass} p-6 cursor-pointer hover:bg-white/5 transition-colors`}>
                <BarChart3 className="w-8 h-8 text-purple-400 mb-4" />
                <h4 className={`font-semibold ${textClass} mb-2`}>Detailed Analysis</h4>
                <p className={`${mutedTextClass} text-sm`}>Comprehensive security audit report</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Security