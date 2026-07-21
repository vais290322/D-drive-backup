import { useState, useEffect } from 'react';
import qrCodeImage from './assets/vaisqr.jpg';
function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const plans = [
    {
      id: 'basic',
      name: 'Due Amount',
      price: '₹6,000',
      features: [
        'Access to all features',
        'Priority support',
        'Instant activation',
      ],
      color: 'from-blue-400 to-cyan-400',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#E8B244] to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 md:w-72 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 md:w-72 md:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 md:w-72 md:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-6xl">
        {/* Header Section */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Lock Icon */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 inline-block border border-white/20 shadow-xl">
              <svg className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 md:mb-4 lg:mb-6 px-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Payment Required
            </span>
          </h1>

          <p className="text-base md:text-xl lg:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed px-4">
            Please make due payment to restore access and bring your site back to life!
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-yellow-500/30 inline-block px-4 md:px-6 py-2 md:py-3 mt-4 mx-4">
            <p className="text-xs md:text-sm lg:text-base text-yellow-300 flex items-center justify-center gap-2 flex-wrap">
              <svg className="w-4 h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className='text-black font-bold'>Site will go live again after successful payment</span>
            </p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-8 md:mb-12">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6 md:p-8 relative transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-black">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent text-white`}>
                    {plan.price}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 md:space-y-4 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-200">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm md:text-lg cursor-pointer text-black hover:text-white transition-colors ">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Button */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
          <button
            onClick={() => setShowPaymentDialog(true)}
            className="group relative inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-6 md:px-10 lg:px-12 py-3 md:py-4 lg:py-5 rounded-full text-base md:text-lg lg:text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 w-full max-w-md mx-auto cursor-pointer">
            <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="relative z-10">Proceed to Payment</span>
            <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="text-black mt-4 md:mt-6 text-xs md:text-sm lg:text-base px-4">
            🔒 Secure payment powered by industry-leading encryption
          </p>

          {/* Contact Button */}
          <button
            onClick={() => setShowContactDialog(true)}
            className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-6 py-2 md:py-3 rounded-full text-white hover:scale-105 transition-all duration-300 text-sm md:text-base cursor-pointer">
            <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </button>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-12 md:mt-16 lg:mt-24 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">Secure & Safe</h3>
            <p className="text-gray-300 text-xs md:text-sm">Bank-level encryption for all transactions</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">Instant Activation</h3>
            <p className="text-gray-300 text-xs md:text-sm">Site goes live immediately after payment</p>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowPaymentDialog(false)}>
          <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 lg:p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Scan to Pay</h2>
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-white p-4 rounded-2xl mb-4 md:mb-6">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <img
                src={qrCodeImage}
                alt="Payment QR Code"
                className="w-full h-auto rounded-lg"
              />
                  <p className="text-sm text-gray-600 font-medium">QR Code</p>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-3 text-center">
              <p className="text-base md:text-lg font-semibold text-yellow-300">Scan QR Code to Complete Payment</p>
              <p className="text-xs md:text-sm text-gray-300">Use any UPI app to scan and pay</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm">Google Pay</div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm">PhonePe</div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm">Paytm</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Dialog */}
      {showContactDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={() => setShowContactDialog(false)}>
          <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 lg:p-8 max-w-md w-full shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Contact Us</h2>
              <button
                onClick={() => setShowContactDialog(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer ">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 md:space-y-6">
              {/* Email */}
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1">Email</h3>
                  <a href="mailto:accounts@vais.co.in" className="text-blue-300 hover:text-blue-200 transition-colors text-sm md:text-base break-all">accounts@vais.co.in</a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1">Phone</h3>
                  <a href="tel:+919339371358" className="text-green-300 hover:text-green-200 transition-colors text-sm md:text-base">+91 9339371358</a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1">Address</h3>
                  <p className="text-gray-300 text-sm md:text-base">Deganga Taki Road North 24 Pargana, West Bengal - 743423</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;