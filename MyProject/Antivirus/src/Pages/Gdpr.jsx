import React, { useState } from "react";
import {
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Lock,
  Globe,
  Scale,
  UserCheck,
  Trash2,
  Edit,
  Ban,
  ArrowRight,
  Send,
} from "lucide-react";

const Gdpr = () => {
  const [showDetails, setShowDetails] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [selectedRight, setSelectedRight] = useState(null);
  const [requestForm, setRequestForm] = useState({
    type: "",
    email: "",
    description: "",
  });

  const toggleSection = (section) => {
    setShowDetails((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDownload = () => {
    const content = `VAIS SECUREGUARD GDPR COMPLIANCE\n\nLast updated: August 20, 2025\n\n1. DATA PROTECTION PRINCIPLES...\n\n[Full GDPR compliance document would be here]`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vais-gdpr-compliance.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRightsRequest = (e) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    alert(
      `GDPR ${requestForm.type} request submitted successfully! We'll respond within 30 days.`
    );
    setRequestForm({ type: "", email: "", description: "" });
  };

  const bgClass = darkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-gray-100 via-red-100 to-gray-200";

  const textClass = darkMode ? "text-white" : "text-gray-900";
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600";

  const gdprPrinciples = [
    {
      id: "lawfulness",
      title: "Lawfulness, Fairness & Transparency",
      icon: <Scale className="w-6 h-6" />,
      color: "blue",
      description:
        "We process data lawfully, fairly, and transparently with clear communication about our practices.",
      implementation: [
        "Clear privacy policies",
        "Explicit consent mechanisms",
        "Transparent data handling",
      ],
    },
    {
      id: "purpose",
      title: "Purpose Limitation",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "green",
      description:
        "Personal data is collected for specified, explicit, and legitimate purposes only.",
      implementation: [
        "Defined data collection purposes",
        "No secondary use without consent",
        "Regular purpose reviews",
      ],
    },
    {
      id: "minimization",
      title: "Data Minimization",
      icon: <Users className="w-6 h-6" />,
      color: "yellow",
      description:
        "We collect only the personal data that is adequate, relevant, and necessary.",
      implementation: [
        "Minimal data collection",
        "Regular data audits",
        "Purpose-driven processing",
      ],
    },
    {
      id: "accuracy",
      title: "Accuracy",
      icon: <Edit className="w-6 h-6" />,
      color: "purple",
      description:
        "Personal data is accurate and kept up to date, with incorrect data rectified or erased.",
      implementation: [
        "Data validation systems",
        "User correction tools",
        "Regular accuracy checks",
      ],
    },
    {
      id: "storage",
      title: "Storage Limitation",
      icon: <Clock className="w-6 h-6" />,
      color: "orange",
      description:
        "Data is kept only as long as necessary for the specified purposes.",
      implementation: [
        "Automated data deletion",
        "Retention schedules",
        "Regular data reviews",
      ],
    },
    {
      id: "security",
      title: "Integrity & Confidentiality",
      icon: <Lock className="w-6 h-6" />,
      color: "red",
      description:
        "Data is processed securely with appropriate technical and organizational measures.",
      implementation: [
        "End-to-end encryption",
        "Access controls",
        "Security monitoring",
      ],
    },
  ];

  const gdprRights = [
    {
      id: "access",
      title: "Right to Access",
      icon: <Eye className="w-6 h-6" />,
      description:
        "You can request copies of your personal data and information about how we process it.",
      timeframe: "Within 1 month",
      action: "Request My Data",
    },
    {
      id: "rectification",
      title: "Right to Rectification",
      icon: <Edit className="w-6 h-6" />,
      description:
        "You can request correction of inaccurate or incomplete personal data.",
      timeframe: "Within 1 month",
      action: "Correct My Data",
    },
    {
      id: "erasure",
      title: "Right to Erasure",
      icon: <Trash2 className="w-6 h-6" />,
      description:
        "You can request deletion of your personal data in certain circumstances.",
      timeframe: "Within 1 month",
      action: "Delete My Data",
    },
    {
      id: "restrict",
      title: "Right to Restrict Processing",
      icon: <Ban className="w-6 h-6" />,
      description:
        "You can request limitation of processing your personal data.",
      timeframe: "Within 1 month",
      action: "Restrict Processing",
    },
    {
      id: "portability",
      title: "Right to Data Portability",
      icon: <Download className="w-6 h-6" />,
      description:
        "You can receive your data in a structured, machine-readable format.",
      timeframe: "Within 1 month",
      action: "Export My Data",
    },
    {
      id: "object",
      title: "Right to Object",
      icon: <AlertCircle className="w-6 h-6" />,
      description:
        "You can object to processing based on legitimate interests or direct marketing.",
      timeframe: "Immediate for marketing",
      action: "Object to Processing",
    },
  ];

  const sections = [
    {
      id: "principles",
      title: "1. GDPR Data Protection Principles",
      icon: <Scale className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>
              Article 5 Compliance
            </h4>
            <p className={mutedTextClass}>
              We strictly adhere to all seven data protection principles
              outlined in Article 5 of the GDPR, ensuring your personal data is
              handled with the highest standards of care and compliance.
            </p>
          </div>

          <div className="grid gap-4">
            {gdprPrinciples.map((principle) => (
              <div
                key={principle.id}
                className={`bg-${principle.color}-500/10 p-4 rounded-lg border border-${principle.color}-500/20`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-${principle.color}-500 mt-1`}>
                    {principle.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-semibold ${textClass} mb-2`}>
                      {principle.title}
                    </h5>
                    <p className={`${mutedTextClass} text-sm mb-3`}>
                      {principle.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {principle.implementation.map((item, idx) => (
                        <span
                          key={idx}
                          className={`text-xs bg-${principle.color}-500/20 text-${principle.color}-400 px-2 py-1 rounded`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "rights",
      title: "2. Your GDPR Rights",
      icon: <UserCheck className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>
              Exercise Your Rights
            </h4>
            <p className={mutedTextClass}>
              Under the GDPR, you have comprehensive rights regarding your
              personal data. Click on any right below to learn more and submit a
              request.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {gdprRights.map((right) => (
              <div
                key={right.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedRight === right.id
                    ? "bg-red-500/20 border-red-500/40"
                    : "bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20"
                }`}
                onClick={() =>
                  setSelectedRight(selectedRight === right.id ? null : right.id)
                }
              >
                <div className="flex items-start space-x-3">
                  <div className="text-red-500">{right.icon}</div>
                  <div className="flex-1">
                    <h5 className={`font-semibold ${textClass} mb-1`}>
                      {right.title}
                    </h5>
                    <p className={`${mutedTextClass} text-sm mb-2`}>
                      {right.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400">
                        Response: {right.timeframe}
                      </span>
                      <ArrowRight className="w-4 h-4 text-red-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedRight && (
            <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20 animate-in slide-in-from-top-2 duration-200">
              <h5 className={`font-semibold ${textClass} mb-4`}>
                Submit {gdprRights.find((r) => r.id === selectedRight)?.title}{" "}
                Request
              </h5>
              <form onSubmit={handleRightsRequest} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${textClass} mb-2`}
                  >
                    Request Type
                  </label>
                  <select
                    value={requestForm.type}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, type: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white"
                    required
                  >
                    <option value="">Select request type</option>
                    <option value="access">Data Access Request</option>
                    <option value="rectification">
                      Data Correction Request
                    </option>
                    <option value="erasure">Data Deletion Request</option>
                    <option value="restrict">Restrict Processing</option>
                    <option value="portability">Data Export Request</option>
                    <option value="object">Object to Processing</option>
                  </select>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textClass} mb-2`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={requestForm.email}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, email: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textClass} mb-2`}
                  >
                    Request Details
                  </label>
                  <textarea
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white h-24"
                    placeholder="Please provide specific details about your request..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer "
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </form>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "processing",
      title: "3. Data Processing & Legal Basis",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>
                Processing Purposes
              </h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Providing security services</li>
                <li>• Account management & authentication</li>
                <li>• Technical support & maintenance</li>
                <li>• Service improvement & analytics</li>
                <li>• Legal compliance & fraud prevention</li>
                <li>• Marketing communications (with consent)</li>
              </ul>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Legal Basis</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>
                  • <strong>Contract:</strong> Service delivery
                </li>
                <li>
                  • <strong>Consent:</strong> Marketing & analytics
                </li>
                <li>
                  • <strong>Legitimate Interest:</strong> Security & fraud
                  prevention
                </li>
                <li>
                  • <strong>Legal Obligation:</strong> Compliance requirements
                </li>
                <li>
                  • <strong>Vital Interests:</strong> Emergency situations
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <h5 className={`font-semibold ${textClass} mb-2`}>
              Data Categories We Process
            </h5>
            <div className="grid md:grid-cols-3 gap-4 mt-3">
              <div>
                <h6 className={`font-medium ${textClass} text-sm mb-1`}>
                  Identity Data
                </h6>
                <p className={`${mutedTextClass} text-xs`}>
                  Name, username, title, date of birth
                </p>
              </div>
              <div>
                <h6 className={`font-medium ${textClass} text-sm mb-1`}>
                  Contact Data
                </h6>
                <p className={`${mutedTextClass} text-xs`}>
                  Email, phone, billing address
                </p>
              </div>
              <div>
                <h6 className={`font-medium ${textClass} text-sm mb-1`}>
                  Technical Data
                </h6>
                <p className={`${mutedTextClass} text-xs`}>
                  IP address, device info, usage data
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "transfers",
      title: "4. International Data Transfers",
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-500/10 p-6 rounded-lg border border-purple-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>
              Transfer Safeguards
            </h4>
            <p className={mutedTextClass}>
              When we transfer personal data outside the European Economic Area
              (EEA), we ensure appropriate safeguards are in place to protect
              your data according to GDPR standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-teal-500/10 p-4 rounded-lg border border-teal-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>
                Transfer Mechanisms
              </h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• European Commission adequacy decisions</li>
                <li>• Standard Contractual Clauses (SCCs)</li>
                <li>• Binding Corporate Rules (BCRs)</li>
                <li>• Certification mechanisms</li>
              </ul>
            </div>
            <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>
                Geographic Locations
              </h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Primary servers: EU (Frankfurt, Dublin)</li>
                <li>• Backup facilities: UK (adequate country)</li>
                <li>• Support centers: US (with SCCs)</li>
                <li>• Analytics partners: Various (with safeguards)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={bgClass}>
      {/* Enhanced Navigation */}
      <nav
        className={`relative z-50 px-6 py-4 border-b ${
          darkMode ? "border-white/10" : "border-black/10"
        } backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.history.back()}
          >
            <Shield className="w-10 h-10 text-red-500 drop-shadow-lg" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>
                Vais SecureGuard
              </span>
              <div className="text-xs text-red-400 font-semibold tracking-wider">
                GDPR COMPLIANCE
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button
              onClick={handleDownload}
              className={`flex items-center space-x-2 ${mutedTextClass} hover:${textClass} transition-colors`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button> */}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
            >
              {darkMode ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
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

      {/* Enhanced Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-purple-500 p-4 rounded-2xl">
              <Scale className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className={`text-5xl font-bold ${textClass} mb-4`}>
            GDPR Compliance
          </h1>
          <div className="flex items-center justify-center space-x-2 text-red-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: August 20, 2025</span>
          </div>
          <p className={`${mutedTextClass} mt-6 text-lg max-w-3xl mx-auto`}>
            We are fully committed to GDPR compliance and protecting your
            fundamental rights to privacy and data protection. Learn about our
            practices and exercise your rights below.
          </p>
        </div>

        {/* Compliance Status Banner */}
        <div
          className={`mb-12 bg-gradient-to-r ${
            darkMode
              ? "from-green-900/30 to-blue-900/30"
              : "from-green-100/50 to-blue-100/50"
          } p-6 rounded-xl border ${
            darkMode ? "border-green-500/20" : "border-green-300/20"
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className={`font-semibold ${textClass}`}>
                  GDPR Compliant Since 2022
                </h3>
                <p className={`${mutedTextClass} text-sm`}>
                  Certified and audited data protection practices
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">100%</div>
                <div className={`text-xs ${mutedTextClass}`}>
                  Compliance Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">&lt;30d</div>
                <div className={`text-xs ${mutedTextClass}`}>Response Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-${
                darkMode ? "black/20" : "white/20"
              } backdrop-blur-sm rounded-xl border ${
                darkMode ? "border-white/10" : "border-black/10"
              } overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full p-6 text-left flex items-center justify-between hover:bg-${
                  darkMode ? "white/5" : "black/5"
                } transition-colors cursor-pointer`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-red-500">{section.icon}</div>
                  <h2 className={`text-xl font-semibold ${textClass}`}>
                    {section.title}
                  </h2>
                </div>
                <div
                  className={`transition-transform duration-200 ${
                    showDetails[section.id] ? "rotate-180" : ""
                  }`}
                >
                  <ArrowLeft className="w-5 h-5 rotate-90 text-red-400" />
                </div>
              </button>

              {showDetails[section.id] && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Data Protection Officer Contact */}
        <div
          className={`mt-16 bg-gradient-to-r ${
            darkMode
              ? "from-red-900/20 to-slate-900/20"
              : "from-red-100/50 to-gray-100/50"
          } p-8 rounded-xl border ${
            darkMode ? "border-red-500/20" : "border-red-300/20"
          }`}
        >
          <h2 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>
            Contact Our Data Protection Officer
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mail className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Email DPO</p>
              <p className={mutedTextClass}>info@vais.co.in</p>
            </div>
            <div className="text-center">
              <Mail className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>GDPR Inquiries</p>
              <p className={mutedTextClass}>info@vais.co.in</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Phone</p>
              <p className={mutedTextClass}>+91 8343939495</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className={`${mutedTextClass} text-sm`}>
              Our DPO is available to assist with all GDPR-related questions and
              requests. We respond to all inquiries within 1 business day.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer
        className={`relative z-10 px-6 py-12 border-t ${
          darkMode ? "border-white/10" : "border-black/10"
        } bg-${darkMode ? "black/20" : "white/20"} backdrop-blur-sm`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-red-500" />
              <span className={`font-bold ${textClass}`}>Vais SecureGuard</span>
            </div>
            <p className={`${mutedTextClass} text-sm`}>
              © {new Date().getFullYear()} Vais SecureGuard. All rights
              reserved. GDPR compliant since 2022 • Privacy by design • Your
              data, your rights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gdpr;
