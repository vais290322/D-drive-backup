import React from 'react';
import { FaGavel, FaFileContract, FaShippingFast, FaExchangeAlt, FaUserShield, FaInfoCircle, FaLeaf } from 'react-icons/fa';

const TermCondition = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-yellow-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 border border-green-100">
          <div className="flex items-center mb-8">
            <FaGavel className="text-green-600 mr-3 text-3xl" />
            <h1 className="text-3xl font-bold text-green-800">Terms & Conditions</h1>
          </div>

          <p className="text-gray-700 mb-8">
            Welcome to <span className="font-bold text-green-700">Afsana Nursery</span>. These Terms & Conditions govern your use of our website and services. 
            By accessing or using our website, you agree to be bound by these terms. Please read them carefully.
          </p>

          <div className="space-y-8">
            {/* General Terms */}
            <section>
              <div className="flex items-center mb-4">
                <FaFileContract className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">General Terms</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  By accessing and using our website, you confirm that you are at least 12 years of age or have the consent of a legal guardian.
                </p>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these terms at any time without prior notice. Your continued use of the website after any changes indicates your acceptance of the modified terms.
                </p>
                <p className="text-gray-700">
                  All content on this website, including text, graphics, logos, images, and software, is the property of Afsana Nursery and is protected by copyright laws.
                </p>
              </div>
            </section>

            {/* Products & Services */}
            <section>
              <div className="flex items-center mb-4">
                <FaLeaf className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Products & Services</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  We strive to provide accurate descriptions and images of our products. However, colors, sizes, and appearance may vary slightly from what is displayed on your screen.
                </p>
                <p className="text-gray-700 mb-4">
                  Plant health and growth are subject to proper care, environmental conditions, and other factors beyond our control after delivery. We cannot guarantee the survival or growth of plants after they leave our nursery.
                </p>
                <p className="text-gray-700">
                  We reserve the right to discontinue any product or service without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of any product or service.
                </p>
              </div>
            </section>

            {/* Ordering & Payment */}
            <section>
              <div className="flex items-center mb-4">
                <FaUserShield className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Ordering & Payment</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  By placing an order, you are making an offer to purchase products. We reserve the right to accept or decline your order for any reason.
                </p>
                <p className="text-gray-700 mb-4">
                  Prices are subject to change without notice. We make every effort to display accurate pricing, but errors may occur. If we discover an error in the price of products you have ordered, we will inform you and give you the option to reconfirm or cancel your order.
                </p>
                <p className="text-gray-700">
                  Payment must be received in full before the delivery of any products or services. We accept various payment methods as indicated on our website.
                </p>
              </div>
            </section>

            {/* Shipping & Delivery */}
            <section>
              <div className="flex items-center mb-4">
                <FaShippingFast className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Shipping & Delivery</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  Delivery times are estimates only and are not guaranteed. Delays may occur due to weather conditions, transportation issues, or other factors beyond our control.
                </p>
                <p className="text-gray-700 mb-4">
                  Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.
                </p>
                <p className="text-gray-700">
                  We ship only to locations within India. Additional shipping charges may apply for remote areas or expedited delivery.
                </p>
              </div>
            </section>

            {/* Returns & Refunds */}
            <section>
              <div className="flex items-center mb-4">
                <FaExchangeAlt className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Returns & Refunds</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  If you receive damaged or defective products, please contact us within 48 hours of delivery with photos of the damaged items. We will arrange for replacement or refund at our discretion.
                </p>
                <p className="text-gray-700 mb-4">
                  Due to the perishable nature of plants, we do not accept returns unless the product is damaged upon arrival or significantly different from what was described.
                </p>
                <p className="text-gray-700">
                  Refunds will be processed using the original payment method and may take 7-14 business days to appear in your account.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Limitation of Liability</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700 mb-4">
                  In no event shall Afsana Nursery be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p className="text-gray-700">
                  Our total liability for any claims under these terms shall not exceed the amount paid by you for the product or service that is the subject of the claim.
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
                  If you have any questions or concerns about our Terms & Conditions, please contact us at:
                </p>
                <div className="text-gray-700">
                  <p><span className="font-semibold">Email:</span> afsananursery30@gmail.com</p>
                  <p><span className="font-semibold">Phone:</span> +91 7601949430</p>
                  <p><span className="font-semibold">Address:</span> Afsana Nursery, chakla,chanpur, Deganga, North 24 parganas, West Bengal – 743424</p>
                </div>
              </div>
            </section>

            {/* Last Updated */}
            <section>
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-green-600 mr-2 text-xl" />
                <h2 className="text-2xl font-semibold text-green-800">Last Updated</h2>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <p className="text-gray-700">
                  These Terms & Conditions were last updated on June 15, 2023.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermCondition;