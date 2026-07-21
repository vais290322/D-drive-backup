import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Zap,
  Battery,
  Scan,
  Lock,
  Unlock,
  Globe,
  Smartphone,
  HardDrive,
  Trash2,
  Settings,
  Bell,
  Clock,
  Target,
  Users,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Search,
  Filter,
  MapPin,
  Calendar,
  Star,
  Award,
  Layers,
  Database,
  Cloud,
  Fingerprint,
  Key,
  Camera,
  Mic,
  Phone,
  MessageCircle,
  Mail,
  FileText,
  Image,
  Video,
  Music,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router";

const Features = () => {
  const [activeCategory, setActiveCategory] = useState("protection");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [threatLevel, setThreatLevel] = useState("safe");
  const [vpnStatus, setVpnStatus] = useState(false);
  const [batteryOptimized, setBatteryOptimized] = useState(false);
  const [activeDemo, setActiveDemo] = useState("real-time");

  // Scanning simulation
  useEffect(() => {
    let interval;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            setIsScanning(false);
            setThreatLevel(Math.random() > 0.7 ? "warning" : "safe");
            return 100;
          }
          return prev + 3;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setThreatLevel("scanning");
  };

  const categories = [
    { id: "protection", title: "Real-Time Protection", icon: ShieldCheck },
    { id: "privacy", title: "Privacy & Security", icon: Eye },
    { id: "network", title: "Network Security", icon: Wifi },
    { id: "performance", title: "Performance Optimization", icon: Zap },
    { id: "monitoring", title: "Advanced Monitoring", icon: Activity },
    { id: "backup", title: "Data Protection", icon: Database },
  ];

  const protectionFeatures = [
    {
      id: "real-time",
      title: "AI-Powered Real-Time Scanning",
      description:
        "Advanced machine learning algorithms continuously monitor your device for threats",
      features: [
        "Behavioral analysis",
        "Cloud-based detection",
        "Zero-day protection",
        "Heuristic scanning",
      ],
      icon: Scan,
      color: "green",
    },
    {
      id: "malware",
      title: "Comprehensive Malware Protection",
      description:
        "Detect and eliminate all types of malware including viruses, trojans, and spyware",
      features: [
        "Virus detection",
        "Trojan removal",
        "Spyware blocking",
        "Ransomware protection",
      ],
      icon: ShieldAlert,
      color: "red",
    },
    {
      id: "web",
      title: "Safe Web Browsing",
      description:
        "Block malicious websites and protect against phishing attacks",
      features: [
        "URL filtering",
        "Phishing protection",
        "Safe search",
        "Download scanning",
      ],
      icon: Globe,
      color: "blue",
    },
    {
      id: "app",
      title: "App Security Scanner",
      description:
        "Analyze installed apps for security vulnerabilities and suspicious behavior",
      features: [
        "Permission analysis",
        "Behavior monitoring",
        "Update notifications",
        "Security ratings",
      ],
      icon: Smartphone,
      color: "purple",
    },
  ];

  const privacyFeatures = [
    {
      id: "app-lock",
      title: "App Lock & Privacy Guard",
      description:
        "Secure your sensitive apps with fingerprint, PIN, or pattern lock",
      features: [
        "Biometric authentication",
        "Multiple lock types",
        "Intruder detection",
        "Auto-lock timer",
      ],
      icon: Lock,
      color: "indigo",
    },
    {
      id: "permissions",
      title: "Permission Manager",
      description: "Monitor and control what permissions your apps are using",
      features: [
        "Permission tracking",
        "Privacy reports",
        "Access notifications",
        "One-click revoke",
      ],
      icon: Settings,
      color: "orange",
    },
    {
      id: "call-block",
      title: "Call & SMS Blocker",
      description:
        "Block unwanted calls and messages from spam and unknown numbers",
      features: [
        "Spam call blocking",
        "SMS filtering",
        "Blacklist management",
        "Community database",
      ],
      icon: Phone,
      color: "pink",
    },
    {
      id: "photo-vault",
      title: "Photo & File Vault",
      description:
        "Hide and encrypt your private photos, videos, and documents",
      features: [
        "Military-grade encryption",
        "Hidden vault",
        "Secure sharing",
        "Cloud backup",
      ],
      icon: Camera,
      color: "cyan",
    },
  ];

  const networkFeatures = [
    {
      id: "wifi-security",
      title: "WiFi Security Scanner",
      description:
        "Analyze WiFi networks for security vulnerabilities and threats",
      features: [
        "Network vulnerability scan",
        "Router security check",
        "Connection monitor",
        "Safe network alerts",
      ],
      icon: Wifi,
      color: "blue",
    },
    {
      id: "vpn",
      title: "Built-in VPN Protection",
      description:
        "Secure your internet connection with military-grade encryption",
      features: [
        "Global server network",
        "No-log policy",
        "Kill switch",
        "Auto-connect",
      ],
      icon: Shield,
      color: "green",
    },
    {
      id: "firewall",
      title: "Smart Firewall",
      description:
        "Control which apps can access the internet and block suspicious traffic",
      features: [
        "App traffic control",
        "Data usage monitor",
        "Intrusion prevention",
        "Custom rules",
      ],
      icon: Filter,
      color: "red",
    },
    {
      id: "dns",
      title: "Secure DNS Protection",
      description:
        "Filter malicious domains and protect against DNS-based attacks",
      features: [
        "DNS filtering",
        "Malware blocking",
        "Ad blocking",
        "Family safe mode",
      ],
      icon: Globe,
      color: "purple",
    },
  ];

  const performanceFeatures = [
    {
      id: "cleaner",
      title: "Smart Junk Cleaner",
      description: "Remove unnecessary files and optimize storage space",
      features: [
        "Cache cleanup",
        "Duplicate finder",
        "Large file detector",
        "APK cleaner",
      ],
      icon: Trash2,
      color: "orange",
    },
    {
      id: "ram",
      title: "RAM Booster",
      description: "Free up memory and improve device performance",
      features: [
        "One-tap boost",
        "Auto RAM cleanup",
        "Background app killer",
        "Performance monitoring",
      ],
      icon: Activity,
      color: "blue",
    },
    {
      id: "battery",
      title: "Battery Optimizer",
      description: "Extend battery life with intelligent power management",
      features: [
        "Power-hungry app detection",
        "Battery health monitor",
        "Custom power modes",
        "Charging protection",
      ],
      icon: Battery,
      color: "green",
    },
    {
      id: "cpu",
      title: "CPU Cooler",
      description: "Prevent overheating and optimize processor performance",
      features: [
        "Temperature monitoring",
        "Overheat alerts",
        "CPU usage tracking",
        "Cooling modes",
      ],
      icon: Zap,
      color: "red",
    },
  ];

  const getCurrentFeatures = () => {
    switch (activeCategory) {
      case "protection":
        return protectionFeatures;
      case "privacy":
        return privacyFeatures;
      case "network":
        return networkFeatures;
      case "performance":
        return performanceFeatures;
      case "monitoring":
        return [
          {
            id: "real-time-monitor",
            title: "Real-Time System Monitor",
            description:
              "Monitor system resources and security status in real-time",
            features: [
              "CPU usage tracking",
              "Memory monitoring",
              "Network activity",
              "Security alerts",
            ],
            icon: Activity,
            color: "blue",
          },
          {
            id: "threat-map",
            title: "Global Threat Intelligence",
            description: "View real-time threat data from around the world",
            features: [
              "Global threat map",
              "Attack statistics",
              "Trend analysis",
              "Regional reports",
            ],
            icon: MapPin,
            color: "red",
          },
        ];
      case "backup":
        return [
          {
            id: "cloud-backup",
            title: "Secure Cloud Backup",
            description:
              "Automatically backup your important data to the cloud",
            features: [
              "Encrypted storage",
              "Auto backup",
              "Version history",
              "Cross-device sync",
            ],
            icon: Cloud,
            color: "blue",
          },
          {
            id: "recovery",
            title: "Data Recovery Tools",
            description: "Recover deleted files and restore lost data",
            features: [
              "File recovery",
              "Photo restoration",
              "Contact backup",
              "SMS recovery",
            ],
            icon: RotateCcw,
            color: "green",
          },
        ];
      default:
        return protectionFeatures;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green:
        "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
      red: "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400",
      blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
      purple:
        "from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400",
      orange:
        "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
      indigo:
        "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400",
      pink: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400",
      cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400",
    };
    return colors[color] || colors.blue;
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/about")}
          >
            <div className="relative cursor-pointer">
              <Shield className="w-10 h-10 text-red-500" />
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                Vais SecureGuard
              </span>
              <div className="text-xs text-red-400 font-semibold">
                FEATURES OVERVIEW
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/features")}
              className="text-gray-300 hover:text-white transition-colors  cursor-pointer "
            >
              Features
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer "
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/support")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer "
            >
              Support
            </button>
            <button
              onClick={() => navigate("/reviews")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer "
            >
              Reviews
            </button>
          </div>

          <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Now</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
              Advanced Security
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover the comprehensive suite of security and optimization
            features that make Vais SecureGuard the most trusted mobile
            protection solution.
          </p>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-30 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Live Demo */}
            <div className="order-2 lg:order-1">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Activity className="w-6 h-6 text-red-400 mr-2" />
                  Live Security Demo
                </h3>

                {/* Scan Interface */}
                <div className="text-center mb-8">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div
                      className={`absolute inset-0 rounded-full border-4 ${
                        threatLevel === "safe"
                          ? "border-green-500"
                          : threatLevel === "warning"
                            ? "border-yellow-500"
                            : threatLevel === "scanning"
                              ? "border-blue-500 animate-spin"
                              : "border-gray-500"
                      }`}
                    >
                      <div
                        className={`absolute inset-2 rounded-full ${
                          threatLevel === "safe"
                            ? "bg-green-500/20"
                            : threatLevel === "warning"
                              ? "bg-yellow-500/20"
                              : threatLevel === "scanning"
                                ? "bg-blue-500/20"
                                : "bg-gray-500/20"
                        } flex items-center justify-center`}
                      >
                        {isScanning ? (
                          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                        ) : threatLevel === "safe" ? (
                          <ShieldCheck className="w-8 h-8 text-green-400" />
                        ) : threatLevel === "warning" ? (
                          <ShieldAlert className="w-8 h-8 text-yellow-400" />
                        ) : (
                          <Shield className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-white font-medium">
                      {isScanning
                        ? `Scanning... ${scanProgress}%`
                        : threatLevel === "safe"
                          ? "Device Secure"
                          : threatLevel === "warning"
                            ? "Threats Detected"
                            : "Ready to Scan"}
                    </p>
                    {isScanning && (
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={startScan}
                    disabled={isScanning}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isScanning ? "Scanning..." : "Start Security Scan"}
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setVpnStatus(!vpnStatus)}
                    className={`p-4 rounded-xl border ${
                      vpnStatus
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-white/5 border-white/10 text-gray-400"
                    } hover:bg-white/10 transition-all`}
                  >
                    <Shield className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">
                      VPN {vpnStatus ? "ON" : "OFF"}
                    </span>
                  </button>

                  <button
                    onClick={() => setBatteryOptimized(!batteryOptimized)}
                    className={`p-4 rounded-xl border ${
                      batteryOptimized
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-white/5 border-white/10 text-gray-400"
                    } hover:bg-white/10 transition-all`}
                  >
                    <Battery className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">
                      Battery {batteryOptimized ? "Optimized" : "Standard"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Stats */}
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">
                Comprehensive Protection Suite
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                  <Target className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">
                    99.9%
                  </div>
                  <div className="text-gray-400 text-sm">Detection Rate</div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">
                    &lt;1s
                  </div>
                  <div className="text-gray-400 text-sm">Scan Speed</div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                  <Database className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">10M+</div>
                  <div className="text-gray-400 text-sm">Threat Database</div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">#1</div>
                  <div className="text-gray-400 text-sm">Security Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="relative z-30 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Explore All Features
            </h2>
            <p className="text-gray-300 text-lg">
              Choose a category to discover detailed features and capabilities
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform scale-105"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="font-medium">{category.title}</span>
              </button>
            ))}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {getCurrentFeatures().map((feature, index) => (
              <div
                key={feature.id}
                className={`backdrop-blur-xl bg-gradient-to-br ${getColorClasses(feature.color)} rounded-2xl border p-8 hover:scale-105 transform transition-all duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(feature.color)} flex items-center justify-center`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Showcase */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Advanced AI Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powered by cutting-edge artificial intelligence and machine
              learning algorithms for unparalleled protection and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl border border-purple-500/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Neural Network Detection
              </h3>
              <p className="text-gray-300 mb-4">
                Advanced deep learning models trained on millions of malware
                samples for superior threat detection.
              </p>
              <ul className="text-left space-y-2 text-gray-400 text-sm">
                <li>• 99.9% accuracy rate</li>
                <li>• Zero-day threat protection</li>
                <li>• Continuous learning</li>
                <li>• Cloud-based intelligence</li>
              </ul>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Behavioral Analysis
              </h3>
              <p className="text-gray-300 mb-4">
                Monitor app behavior patterns to detect suspicious activities
                before they cause harm.
              </p>
              <ul className="text-left space-y-2 text-gray-400 text-sm">
                <li>• Real-time monitoring</li>
                <li>• Anomaly detection</li>
                <li>• Privacy breach alerts</li>
                <li>• Predictive protection</li>
              </ul>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Global Threat Intelligence
              </h3>
              <p className="text-gray-300 mb-4">
                Connected to a worldwide network sharing threat intelligence for
                instant protection updates.
              </p>
              <ul className="text-left space-y-2 text-gray-400 text-sm">
                <li>• Real-time threat feeds</li>
                <li>• Global malware database</li>
                <li>• Community protection</li>
                <li>• Instant updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl border border-white/20 p-12">
            <ShieldCheck className="w-20 h-20 text-red-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Secure Your Device?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Download Vais SecureGuard now and experience the most advanced
              mobile security solution available.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <button className="group bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download Free</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="text-white border-2 border-white/20 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>View Plans</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Users className="w-5 h-5 text-red-400" />
                <span>10M+ Users</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Shield className="w-5 h-5 text-green-400" />
                <span>100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold text-white">
                  Vais SecureGuard
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Leading the way in mobile security and device optimization with
                advanced AI technology.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Real-Time Protection</li>
                <li>Privacy Guard</li>
                <li>Network Security</li>
                <li>Performance Boost</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li onClick={() => navigate("/privacy-policy")} className="cursor-pointer" >
                  Privacy Policy
                </li>
                <li onClick={() => navigate("/terms-of-service")} className="cursor-pointer" >
                  Terms of Service
                </li>
                <li onClick={() => navigate("/cookie-policy")} className="cursor-pointer">
                  Cookie Policy
                </li>
                <li onClick={() => navigate("/gdpr-compliance")} className="cursor-pointer">
                  GDPR Compliance
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Vais SecureGuard. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
