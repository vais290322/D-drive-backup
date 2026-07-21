// Fetch and display restaurant settings
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch restaurant settings
    const response = await fetch('/api/settings');
    const settings = await response.json();
    
    if (!response.ok) {
      throw new Error(settings.message || 'Failed to load restaurant settings');
    }
    
    // Update restaurant name if available
    if (settings.restaurant_name) {
      // Store original restaurant name for translation fallback
      const restaurantNameElement = document.getElementById('restaurant-name');
      restaurantNameElement.setAttribute('data-original-name', settings.restaurant_name);
      
      // Use translation if available, otherwise use settings name
      if (window.languageManager) {
        const translatedName = window.languageManager.getTextSync('restaurantName');
        restaurantNameElement.textContent = translatedName !== 'restaurantName' ? translatedName : settings.restaurant_name;
      } else {
        restaurantNameElement.textContent = settings.restaurant_name;
      }
      
      document.title = settings.restaurant_name + ' - Menu';
    }
    
    // Update restaurant logo if available
    if (settings.logo_path) {
      const logoContainer = document.getElementById('restaurant-logo-container');
      const logoImage = document.getElementById('restaurant-logo');
      logoImage.src = settings.logo_path;
      logoContainer.style.display = 'block';
    }
    
    // Update restaurant address in header and footer if available
    if (settings.address) {
      document.getElementById('restaurant-address').textContent = settings.address;
      document.getElementById('header-address').textContent = settings.address;
    }
    
    // Update operational hours if available
    if (settings.operational_hours) {
      const hoursLabel = window.languageManager ? window.languageManager.getTextSync('hoursLabel') : 'Hours';
      document.getElementById('restaurant-hours').textContent = hoursLabel + ': ' + settings.operational_hours;
    }
    
    // Update phone in header and footer if available
    if (settings.phone) {
      // Update in footer
      const phoneContainer = document.getElementById('restaurant-phone-container');
      const phoneElement = document.getElementById('restaurant-phone');
      phoneElement.textContent = settings.phone;
      phoneContainer.style.display = 'flex';
      
      // Update in header
      const headerPhoneContainer = document.getElementById('header-phone-container');
      const headerPhoneElement = document.getElementById('header-phone');
      headerPhoneElement.textContent = settings.phone;
      headerPhoneContainer.style.display = 'flex';
    }
    
    // Update email in header and footer if available
    if (settings.email) {
      // Update footer email
      const emailContainer = document.getElementById('restaurant-email-container');
      const emailElement = document.getElementById('restaurant-email');
      emailElement.textContent = settings.email;
      emailContainer.style.display = 'flex';
      
      // Update header email
      const headerEmailContainer = document.getElementById('header-email-container');
      const headerEmailElement = document.getElementById('header-email');
      headerEmailElement.textContent = settings.email;
      headerEmailContainer.style.display = 'flex';
    }
    
    // WhatsApp functionality removed
    
    // Update GST number if available and show_gst is true
    if (settings.gst_number && settings.show_gst) {
      const gstContainer = document.getElementById('restaurant-gst-container');
      const gstElement = document.getElementById('restaurant-gst');
      gstElement.textContent = settings.gst_number;
      gstContainer.style.display = 'block';
    }
    
    // Update trade license if available and show_trade_license is true
    if (settings.trade_license && settings.show_trade_license) {
      const licenseContainer = document.getElementById('restaurant-license-container');
      const licenseElement = document.getElementById('restaurant-license');
      licenseElement.textContent = settings.trade_license;
      licenseContainer.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Error loading restaurant settings:', error);
  }
});