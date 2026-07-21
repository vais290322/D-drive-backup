// Multi-language translations for the restaurant website
const translations = {
  en: {
    // Header
    restaurantName: "UNIQUE Restaurant & Dhaba – Bishwanathpur",
    tagline: "Authentic Cuisine • Fresh Ingredients • Memorable Experience",
    homeDelivery: "HOME DELIVERY AVAILABLE",
    
    // Navigation
    menu: "Menu",
    about: "About",
    contact: "Contact",
    admin: "Admin Panel",
    
    // Menu
    loading: "Loading menu items...",
    price: "Price",
    available: "Available",
    unavailable: "Currently Unavailable",
    
    // Contact
    address: "Address",
    phone: "Phone",
    email: "Email",
    whatsapp: "WhatsApp",
    hours: "Hours",
    
    // Footer
    followUs: "Follow Us",
    feedback: "Feedback",
    submitFeedback: "Submit Feedback",
    rating: "Rating",
    comments: "Comments",
    thankYou: "Thank you for your feedback!",
    
    // Language
    language: "Language",
    english: "English",
    hindi: "हिंदी",
    bengali: "বাংলা",
    
    // Form labels
    yourName: "Your Name",
    enterName: "Enter your name",
    mobileNumber: "Mobile Number",
    enterMobile: "Enter your mobile number",
    tellExperience: "Tell us about your experience...",
    
    // Price labels
    half: "Half",
    full: "Full",
    
    // Messages
    noItemsAvailable: "No menu items available at the moment. Please check back later.",
    hoursLabel: "Hours"
  },
  
  hi: {
    // Header
    restaurantName: "यूनीक रेस्टोरेंट और ढाबा – बिश्वनाथपुर",
    tagline: "प्रामाणिक व्यंजन • ताज़ी सामग्री • यादगार अनुभव",
    homeDelivery: "होम डिलीवरी उपलब्ध",
    
    // Navigation
    menu: "मेन्यू",
    about: "हमारे बारे में",
    contact: "संपर्क",
    admin: "एडमिन पैनल",
    
    // Menu
    loading: "मेन्यू आइटम लोड हो रहे हैं...",
    price: "मूल्य",
    available: "उपलब्ध",
    unavailable: "वर्तमान में अनुपलब्ध",
    
    // Contact
    address: "पता",
    phone: "फोन",
    email: "ईमेल",
    whatsapp: "व्हाट्सऐप",
    hours: "समय",
    
    // Footer
    followUs: "हमें फॉलो करें",
    feedback: "प्रतिक्रिया",
    submitFeedback: "प्रतिक्रिया भेजें",
    rating: "रेटिंग",
    comments: "टिप्पणियां",
    thankYou: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
    
    // Language
    language: "भाषा",
    english: "English",
    hindi: "हिंदी",
    bengali: "বাংলা",
    
    // Form labels
    yourName: "आपका नाम",
    enterName: "अपना नाम दर्ज करें",
    mobileNumber: "मोबाइल नंबर",
    enterMobile: "अपना मोबाइल नंबर दर्ज करें",
    tellExperience: "हमें अपने अनुभव के बारे में बताएं...",
    
    // Price labels
    half: "आधा",
    full: "पूरा",
    
    // Messages
    noItemsAvailable: "इस समय कोई मेन्यू आइटम उपलब्ध नहीं है। कृपया बाद में देखें।",
    hoursLabel: "समय"
  },
  
  bn: {
    // Header
    restaurantName: "ইউনিক রেস্তোরাঁ ও ঢাবা – বিশ্বনাথপুর",
    tagline: "খাঁটি রান্না • তাজা উপাদান • স্মরণীয় অভিজ্ঞতা",
    homeDelivery: "হোম ডেলিভারি পাওয়া যায়",
    
    // Navigation
    menu: "মেনু",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    admin: "অ্যাডমিন প্যানেল",
    
    // Menu
    loading: "মেনু আইটেম লোড হচ্ছে...",
    price: "দাম",
    available: "পাওয়া যায়",
    unavailable: "বর্তমানে পাওয়া যাচ্ছে না",
    
    // Contact
    address: "ঠিকানা",
    phone: "ফোন",
    email: "ইমেইল",
    whatsapp: "হোয়াটসঅ্যাপ",
    hours: "সময়",
    
    // Footer
    followUs: "আমাদের ফলো করুন",
    feedback: "মতামত",
    submitFeedback: "মতামত জমা দিন",
    rating: "রেটিং",
    comments: "মন্তব্য",
    thankYou: "আপনার মতামতের জন্য ধন্যবাদ!",
    
    // Language
    language: "ভাষা",
    english: "English",
    hindi: "हिंदी",
    bengali: "বাংলা",
    
    // Form labels
    yourName: "আপনার নাম",
    enterName: "আপনার নাম লিখুন",
    mobileNumber: "মোবাইল নম্বর",
    enterMobile: "আপনার মোবাইল নম্বর লিখুন",
    tellExperience: "আমাদের আপনার অভিজ্ঞতার কথা বলুন...",
    
    // Price labels
    half: "অর্ধেক",
    full: "পূর্ণ",
    
    // Messages
    noItemsAvailable: "এই মুহূর্তে কোনো মেনু আইটেম পাওয়া যাচ্ছে না। অনুগ্রহ করে পরে চেক করুন।",
    hoursLabel: "সময়"
  }
};

// Google Translate API integration
class GoogleTranslateService {
  constructor() {
    this.cache = new Map();
    this.isTranslating = false;
  }

  async translateText(text, targetLang) {
    if (targetLang === 'en' || !text || text.trim() === '') {
      return text;
    }

    const cacheKey = `${text}_${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Using a free translation API service
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        const translatedText = data.responseData.translatedText;
        this.cache.set(cacheKey, translatedText);
        return translatedText;
      }
    } catch (error) {
      console.warn('Translation failed, using fallback:', error);
    }

    // Fallback to static translations if API fails
    return this.getStaticTranslation(text, targetLang) || text;
  }

  getStaticTranslation(text, targetLang) {
    // Find the key for this text in English translations
    const englishTranslations = translations.en;
    const key = Object.keys(englishTranslations).find(k => englishTranslations[k] === text);
    
    if (key && translations[targetLang] && translations[targetLang][key]) {
      return translations[targetLang][key];
    }
    
    return null;
  }
}

// Language management functions
class LanguageManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateService = new GoogleTranslateService();
    this.init();
  }
  
  init() {
    this.createLanguageSwitcher();
    this.translatePage();
  }
  
  createLanguageSwitcher() {
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'language-switcher';
    
    const supportedLanguages = {
      'en': { name: 'English', flag: '🇺🇸' },
      'hi': { name: 'हिंदी', flag: '🇮🇳' },
      'es': { name: 'Español', flag: '🇪🇸' },
      'fr': { name: 'Français', flag: '🇫🇷' },
      'de': { name: 'Deutsch', flag: '🇩🇪' },
      'zh': { name: '中文', flag: '🇨🇳' },
      'ja': { name: '日本語', flag: '🇯🇵' },
      'ar': { name: 'العربية', flag: '🇸🇦' },
      'pt': { name: 'Português', flag: '🇵🇹' },
      'ru': { name: 'Русский', flag: '🇷🇺' },
      'bn': { name: 'বাংলা', flag: '🇧🇩' }
    };
    
    const currentLangName = supportedLanguages[this.currentLanguage]?.name || 'English';
    
    languageSwitcher.innerHTML = `
      <div class="language-dropdown">
        <button class="language-btn" id="languageBtn">
          <span class="language-icon">🌐</span>
          <span class="language-text">${currentLangName}</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="language-options" id="languageOptions">
          ${Object.entries(supportedLanguages).map(([code, lang]) => `
            <div class="language-option" data-lang="${code}">
              <span class="flag">${lang.flag}</span>
              <span>${lang.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Insert language switcher in header
    const header = document.querySelector('.header');
    if (header) {
      header.appendChild(languageSwitcher);
    }
    
    this.addEventListeners();
  }
  
  addEventListeners() {
    const languageBtn = document.getElementById('languageBtn');
    const languageOptions = document.getElementById('languageOptions');
    const languageOptionElements = document.querySelectorAll('.language-option');
    
    languageBtn.addEventListener('click', () => {
      languageOptions.classList.toggle('show');
    });
    
    languageOptionElements.forEach(option => {
      option.addEventListener('click', (e) => {
        const selectedLang = e.currentTarget.dataset.lang;
        this.changeLanguage(selectedLang);
        languageOptions.classList.remove('show');
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-dropdown')) {
        languageOptions.classList.remove('show');
      }
    });
  }
  
  async changeLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    
    // Update language button text
    const supportedLanguages = {
      'en': { name: 'English', flag: '🇺🇸' },
      'hi': { name: 'हिंदी', flag: '🇮🇳' },
      'es': { name: 'Español', flag: '🇪🇸' },
      'fr': { name: 'Français', flag: '🇫🇷' },
      'de': { name: 'Deutsch', flag: '🇩🇪' },
      'zh': { name: '中文', flag: '🇨🇳' },
      'ja': { name: '日本語', flag: '🇯🇵' },
      'ar': { name: 'العربية', flag: '🇸🇦' },
      'pt': { name: 'Português', flag: '🇵🇹' },
      'ru': { name: 'Русский', flag: '🇷🇺' },
      'bn': { name: 'বাংলা', flag: '🇧🇩' }
    };
    
    const languageText = document.querySelector('.language-text');
    if (languageText) {
      languageText.textContent = supportedLanguages[lang]?.name || 'English';
    }
    
    // Show loading indicator
    this.showTranslationLoading(true);
    
    await this.translatePage();
    
    // Hide loading indicator
    this.showTranslationLoading(false);
    
    // Trigger language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }
  
  showTranslationLoading(show) {
    let loadingIndicator = document.getElementById('translation-loading');
    
    if (show && !loadingIndicator) {
      loadingIndicator = document.createElement('div');
      loadingIndicator.id = 'translation-loading';
      loadingIndicator.innerHTML = '🌐 Translating...';
      loadingIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
      `;
      document.body.appendChild(loadingIndicator);
    } else if (!show && loadingIndicator) {
      loadingIndicator.remove();
    }
  }
  
  async translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    
    for (const element of elements) {
      const key = element.dataset.translate;
      let originalText = element.textContent;
      
      // Get original English text if available
      if (translations.en[key]) {
        originalText = translations.en[key];
      }
      
      if (originalText && originalText.trim()) {
        try {
          const translatedText = await this.translateService.translateText(originalText, this.currentLanguage);
          element.textContent = translatedText;
        } catch (error) {
          console.warn('Translation failed for element:', key, error);
          // Fallback to static translation
          if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
            element.textContent = translations[this.currentLanguage][key];
          }
        }
      }
    }
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    for (const element of placeholderElements) {
      const key = element.dataset.translatePlaceholder;
      let originalText = element.getAttribute('data-original-placeholder');
      
      if (!originalText && translations.en[key]) {
        originalText = translations.en[key];
        element.setAttribute('data-original-placeholder', originalText);
      }
      
      if (originalText && originalText.trim()) {
        try {
          const translatedText = await this.translateService.translateText(originalText, this.currentLanguage);
          element.placeholder = translatedText;
        } catch (error) {
          console.warn('Translation failed for placeholder:', key, error);
          // Fallback to static translation
          if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
            element.placeholder = translations[this.currentLanguage][key];
          }
        }
      }
    }
  }
  
  async getText(key) {
    // First try static translations
    if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
      return translations[this.currentLanguage][key];
    }
    
    // If no static translation, try dynamic translation
    if (translations.en[key]) {
      try {
        return await this.translateService.translateText(translations.en[key], this.currentLanguage);
      } catch (error) {
        console.warn('Dynamic translation failed for key:', key, error);
      }
    }
    
    return key;
  }
  
  // Synchronous version for backward compatibility
  getTextSync(key) {
    return translations[this.currentLanguage][key] || translations.en[key] || key;
  }
}

// Initialize language manager when DOM is loaded
let languageManager;
window.languageManager = null;

document.addEventListener('DOMContentLoaded', () => {
  languageManager = new LanguageManager();
  window.languageManager = languageManager;
  
  // Trigger a custom event when language manager is ready
  window.dispatchEvent(new CustomEvent('languageManagerReady'));
});

// Listen for language changes and update dynamic content
window.addEventListener('languageChanged', () => {
  // Re-translate any dynamically loaded content
  if (window.languageManager) {
    window.languageManager.translatePage();
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, LanguageManager };
}