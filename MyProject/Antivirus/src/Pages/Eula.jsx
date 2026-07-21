import React, { useState, useRef } from "react";
import {
  Shield,
  FileText,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Download,
  Printer,
  Globe,
  Clock,
  Scale,
  Users,
  Lock,
  RefreshCw,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Scroll,
  Search,
  BookOpen,
  AlertCircle,
} from "lucide-react";

const Eula = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const contentRef = useRef(null);

  const textClass = darkMode ? "text-white" : "text-gray-900";
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600";
  const cardClass = `bg-${
    darkMode ? "black/20" : "white/20"
  } backdrop-blur-sm rounded-xl border ${
    darkMode ? "border-white/10" : "border-black/10"
  }`;

  const eulaContent = {
    version: "2.1",
    lastUpdated: "August 24, 2025",
    effectiveDate: "September 1, 2025",
    sections: [
      {
        title: "Agreement Overview",
        icon: Scroll,
        content: `This End User License Agreement ("Agreement") is a legal contract between you ("User" or "you") and Vais Engineering Pvt. Ltd . Company regarding your use of Vais SecureGuard software and related services ("Software"). By installing, accessing, or using the Software, you agree to be bound by the terms of this Agreement. If you do not agree to these terms, do not install or use the Software.

This Agreement governs your rights and obligations regarding the Software, including but not limited to installation, use, distribution, and termination. The Software is designed to provide comprehensive cybersecurity protection for your devices and data.`,
      },
      {
        title: "License Grant and Scope",
        icon: Scale,
        content: `Subject to your compliance with this Agreement, Company grants you a limited, non-exclusive, non-transferable, revocable license to use the Software solely for your personal or internal business purposes. This license permits you to:

• Install and use the Software on devices you own or control
• Receive automatic updates and security patches
• Access customer support services
• Use the Software's features as documented

You may not: (a) modify, adapt, alter, translate, or create derivative works of the Software; (b) reverse engineer, disassemble, decompile, or otherwise attempt to derive the source code; (c) distribute, sell, lease, rent, or sublicense the Software; (d) remove or alter any proprietary notices; (e) use the Software for illegal purposes or in violation of applicable laws.`,
      },
      {
        title: "User Responsibilities and Restrictions",
        icon: Users,
        content: `As a user of the Software, you are responsible for:

• Maintaining the security of your account credentials
• Ensuring your system meets minimum requirements
• Reporting security vulnerabilities responsibly
• Complying with all applicable laws and regulations
• Using the Software in accordance with its intended purpose

You agree not to: (a) use the Software to harm, threaten, or harass others; (b) attempt to gain unauthorized access to systems or networks; (c) interfere with or disrupt the Software's operation; (d) use the Software for competitive analysis or benchmarking; (e) share your license with unauthorized users.

The Software may collect system information necessary for security protection. You consent to this data collection as outlined in our Privacy Policy.`,
      },
      {
        title: "Data Collection and Privacy",
        icon: Lock,
        content: `Your privacy is important to us. The Software may collect certain information to provide security services:

• System configuration and hardware information
• Network traffic patterns for threat detection
• File checksums and signatures for malware analysis
• Update and feature usage statistics
• Anonymized threat intelligence data

We do not collect personal files, communications, or browsing history unless explicitly authorized for security scanning. All data collection is governed by our Privacy Policy, which is incorporated into this Agreement by reference.

You may opt-out of certain data collection through the Software's settings, though this may impact security effectiveness. We implement industry-standard encryption and security measures to protect your data.`,
      },
      {
        title: "Updates and Maintenance",
        icon: RefreshCw,
        content: `To maintain optimal security protection, the Software includes automatic update functionality:

• Security definition updates occur multiple times daily
• Software updates are delivered as needed for security and functionality
• Critical security patches may be installed automatically
• Major version updates may require user consent

You acknowledge that security software requires current threat intelligence to be effective. Disabling automatic updates may significantly reduce the Software's protective capabilities and is not recommended.

The Company reserves the right to discontinue support for older software versions. You will receive advance notice of any support discontinuation affecting your installation.`,
      },
      {
        title: "Subscription and Payment Terms",
        icon: Globe,
        content: `If you have purchased a subscription license:

• Subscription fees are billed in advance for the selected term
• Renewal occurs automatically unless cancelled before the renewal date
• Refunds may be available within 30 days of initial purchase
• Price changes will be communicated at least 30 days in advance
• Service may be suspended for non-payment after reasonable notice

Free versions of the Software may include limited features or functionality. Premium features require a valid subscription license.

All fees are exclusive of applicable taxes, which are your responsibility. The Company reserves the right to modify pricing with appropriate notice to existing subscribers.`,
      },
      {
        title: "Warranty and Liability Limitations",
        icon: AlertTriangle,
        content: `THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMPANY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

Company does not warrant that the Software will be error-free, uninterrupted, or completely secure. No security solution can prevent all threats, and you acknowledge that determined attackers may circumvent security measures.

IN NO EVENT SHALL COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

Company's total liability for any claim related to this Agreement shall not exceed the amount paid by you for the Software in the twelve months preceding the claim.`,
      },
      {
        title: "Termination and Post-Termination",
        icon: Clock,
        content: `This Agreement remains in effect until terminated. You may terminate at any time by uninstalling the Software and ceasing all use. Company may terminate for breach of this Agreement or discontinuation of the Software.

Upon termination:
• Your license to use the Software immediately ceases
• You must uninstall the Software from all devices
• Certain provisions survive termination, including warranty disclaimers and limitation of liability
• Subscription refunds, if any, will be calculated on a pro-rata basis

Data collected by the Software may be retained according to our Privacy Policy and applicable legal requirements. You may request data deletion subject to legal and technical constraints.`,
      },
      {
        title: "Legal and Governing Law",
        icon: BookOpen,
        content: `This Agreement is governed by the laws of [State/Country], without regard to conflict of law principles. Any disputes arising from this Agreement shall be resolved through binding arbitration administered by the American Arbitration Association.

If any provision of this Agreement is found unenforceable, the remaining provisions shall remain in full force and effect. This Agreement constitutes the entire agreement between the parties regarding the Software and supersedes all prior agreements.

Company may update this Agreement from time to time. Material changes will be communicated through the Software or by email. Your continued use of the Software after notice of changes constitutes acceptance of the modified terms.

For questions regarding this Agreement, contact us at info@vais.co.in.`,
      },
    ],
    contactInfo: {
      company: "Vais Engineering Pvt. Ltd.",
      address: "Degangan, Kolkata, West Bengal, India",
      email: "info@vais.co.in",
      phone: "+91 83439 39495",
      website: "https://vais.co.in",
    },
  };

  const scrollToSection = (index) => {
    setActiveSection(index);
    const element = document.getElementById(`section-${index}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text version for download
    const textContent = eulaContent.sections
      .map(
        (section) =>
          `${section.title}\n${"=".repeat(section.title.length)}\n${
            section.content
          }\n\n`
      )
      .join("");

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Vais_SecureGuard_EULA.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSections = eulaContent.sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
          : "bg-gradient-to-br from-gray-50 via-red-50 to-gray-100"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.history.back()}>
            <Shield className="w-10 h-10 text-red-500" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>
                Vais SecureGuard
              </span>
              <div className="text-xs text-red-400 font-semibold">
                END USER LICENSE AGREEMENT
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrint}
              className={`p-2 rounded-lg ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
              title="Print EULA"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className={`p-2 rounded-lg ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
              title="Download EULA"
            >
              <Download className="w-4 h-4" />
            </button>

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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${cardClass} p-6 sticky top-8`}>
              <h3 className={`text-lg font-bold ${textClass} mb-4`}>
                Quick Navigation
              </h3>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                      : "bg-white/20 border-black/10 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
              </div>

              {/* Document Info */}
              <div className="mb-6 space-y-2 text-sm">
                <div className={`flex justify-between ${mutedTextClass}`}>
                  <span>Version:</span>
                  <span className="text-red-400">{eulaContent.version}</span>
                </div>
                <div className={`flex justify-between ${mutedTextClass}`}>
                  <span>Updated:</span>
                  <span>{eulaContent.lastUpdated}</span>
                </div>
                <div className={`flex justify-between ${mutedTextClass}`}>
                  <span>Effective:</span>
                  <span>{eulaContent.effectiveDate}</span>
                </div>
              </div>

              {/* Section Links */}
              <div className="space-y-2">
                {eulaContent.sections.map((section, index) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                      className={`w-full flex items-center cursor-pointer space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeSection === index
                          ? "bg-red-500 text-white"
                          : `${mutedTextClass} hover:${textClass} hover:bg-white/5`
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm">{section.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className={`font-semibold ${textClass} mb-3`}>
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div
                    className={`flex items-center space-x-2 ${mutedTextClass}`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>{eulaContent.contactInfo.email}</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${mutedTextClass}`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>{eulaContent.contactInfo.phone}</span>
                  </div>
                  <div
                    className={`flex items-start space-x-2 ${mutedTextClass}`}
                  >
                    <MapPin className="w-3 h-3 mt-0.5" />
                    <span className="text-xs leading-relaxed">
                      {eulaContent.contactInfo.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="text-center mb-12">
              <h1
                className={`text-4xl md:text-5xl font-bold ${textClass} mb-4`}
              >
                End User License Agreement
              </h1>
              <p className={`text-xl ${mutedTextClass} mb-4`}>
                Please read this agreement carefully before using our software
              </p>
              <div
                className={`inline-flex items-center space-x-2 ${cardClass} px-4 py-2`}
              >
                <FileText className="w-4 h-4 text-red-400" />
                <span className={`text-sm ${mutedTextClass}`}>
                  Version {eulaContent.version} • Last updated{" "}
                  {eulaContent.lastUpdated}
                </span>
              </div>
            </div>

            {/* Important Notice */}
            <div
              className={`${cardClass} p-6 mb-8 border-l-4 border-yellow-500`}
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className={`font-semibold ${textClass} mb-2`}>
                    Important Legal Notice
                  </h3>
                  <p className={`${mutedTextClass} text-sm leading-relaxed`}>
                    This is a legally binding agreement. By installing or using
                    Vais SecureGuard, you agree to all terms and conditions
                    outlined below. If you do not agree to these terms, please
                    do not install or use the software.
                  </p>
                </div>
              </div>
            </div>

            {/* EULA Content */}
            <div ref={contentRef} className="space-y-8">
              {(searchTerm ? filteredSections : eulaContent.sections).map(
                (section, index) => {
                  const IconComponent = section.icon;
                  const actualIndex = eulaContent.sections.findIndex(
                    (s) => s.title === section.title
                  );
                  return (
                    <div
                      key={actualIndex}
                      id={`section-${actualIndex}`}
                      className={`${cardClass} p-8 scroll-mt-8`}
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <IconComponent className="w-6 h-6 text-red-400" />
                        </div>
                        <h2 className={`text-2xl font-bold ${textClass}`}>
                          {actualIndex + 1}. {section.title}
                        </h2>
                      </div>
                      <div
                        className={`${mutedTextClass} leading-relaxed whitespace-pre-line`}
                      >
                        {section.content}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Agreement Section */}
            <div className={`${cardClass} p-8 mt-12`}>
              <div className="text-center">
                <h3 className={`text-2xl font-bold ${textClass} mb-6`}>
                  Agreement Confirmation
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
                    />
                    <span className={`${mutedTextClass} text-lg`}>
                      I have read and accept the terms and conditions
                    </span>
                  </label>

                  <button
                    disabled={!accepted}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                      accepted
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gray-500 cursor-not-allowed text-gray-300"
                    }`}
                  >
                    Continue to Software
                  </button>
                </div>

                {accepted && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Agreement accepted successfully</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className={`${mutedTextClass} text-sm`}>
                © {new Date().getFullYear()} {eulaContent.contactInfo.company}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eula;
