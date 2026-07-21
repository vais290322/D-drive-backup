import React from 'react';
import { FaShieldAlt, FaUserShield, FaLock, FaCookieBite, FaInfoCircle, FaLeaf } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-yellow-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 border border-green-100">
          <div className="flex items-center mb-8">
            <FaShieldAlt className="text-green-600 mr-3 text-3xl" />
            <h1 className="text-3xl font-bold text-green-800">Privacy Policy</h1>
          </div>

          <p className="text-gray-700 mb-8">
            At <span className="font-bold text-green-700">Afsana Nursery</span>, we value your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.
          </p>

          <div className="space-y-8">
            {/* Information We Collect */}
            <section>
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Information We Collect</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  We may collect the following types of information when you visit our website or place an order:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Personal information such as name, email address, phone number, and shipping address</li>
                  <li>Order information including products purchased, payment details, and transaction history</li>
                  <li>Technical information such as IP address, browser type, device information, and cookies</li>
                  <li>Usage data including pages visited, time spent on our website, and interaction with our content</li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <div className="flex items-center mb-4">
                <FaUserShield className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">How We Use Your Information</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>To process and fulfill your orders, including shipping and delivery</li>
                  <li>To communicate with you about your orders, products, and services</li>
                  <li>To improve our website, products, and customer experience</li>
                  <li>To send you marketing communications (with your consent)</li>
                  <li>To comply with legal obligations and protect our rights</li>
                </ul>
              </div>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section>
              <div className="flex items-center mb-4">
                <FaCookieBite className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Cookies and Tracking Technologies</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>
                <p className="text-gray-700">
                  Our cookies may collect information about your browsing habits to make advertising relevant to you and your interests.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center mb-4">
                <FaLock className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Data Security</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
                <p className="text-gray-700">
                  We regularly review our security practices to ensure the ongoing confidentiality of your data.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center mb-4">
                <FaLeaf className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Your Rights</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>The right to access and receive a copy of your personal information</li>
                  <li>The right to correct or update your personal information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to restrict or object to processing of your personal information</li>
                  <li>The right to data portability</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Contact Us</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  If you have any questions or concerns about our Privacy Policy or how we handle your personal information, please contact us at:
                </p>
                <div className="text-gray-700">
                  <p><span className="font-semibold">Email:</span> afsananursery30@gmail.com</p>
                  <p><span className="font-semibold">Phone:</span> +91 7601949430</p>
                  <p><span className="font-semibold">Address:</span> Afsana Nursery, chakla,chanpur, Deganga, North 24 parganas, West Bengal – 743424</p>
                </div>
              </div>
            </section>

            {/* Policy Updates */}
            <section>
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Policy Updates</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We encourage you to review this policy periodically for any updates. The last update was made on June 15, 2023.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;