// Global variables
let restaurantSettings = null;
const authToken = localStorage.getItem('token');

// Initialize settings functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener for save settings button
  const saveBtn = document.getElementById('save-settings-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveSettings);
  }
});

// This function is called by admin.js when settings section is activated
// No need to add event listener for settings navigation here

// Load restaurant settings from the server
async function loadSettings() {
  console.log('loadSettings called');
  try {
    console.log('Fetching settings from /api/settings');
    const response = await fetch('/api/settings');
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Settings data received:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to load settings');
    }
    
    restaurantSettings = data;
    
    // Populate form with settings data
    console.log('Populating restaurant name:', data.restaurant_name);
    document.getElementById('restaurant-name').value = data.restaurant_name || '';
    document.getElementById('restaurant-address').value = data.address || '';
    document.getElementById('restaurant-phone').value = data.phone || '';
    document.getElementById('restaurant-email').value = data.email || '';

    document.getElementById('restaurant-hours').value = data.operational_hours || '';
    document.getElementById('restaurant-gst').value = data.gst_number || '';
    document.getElementById('restaurant-license').value = data.trade_license || '';
    document.getElementById('show-gst').checked = data.show_gst || false;
    document.getElementById('show-trade-license').checked = data.show_trade_license || false;
    
    // Handle logo display
    const currentLogoContainer = document.getElementById('current-logo-container');
    const currentLogo = document.getElementById('current-restaurant-logo');
    
    if (data.logo_path) {
      currentLogo.src = data.logo_path;
      currentLogoContainer.style.display = 'block';
    } else {
      currentLogoContainer.style.display = 'none';
    }
    
    // Hide error and success messages
    document.getElementById('settings-error').classList.add('d-none');
    document.getElementById('settings-success').classList.add('d-none');
  } catch (error) {
    console.error('Error loading settings:', error);
    console.error('Error details:', error.message);
    const errorElement = document.getElementById('settings-error');
    if (errorElement) {
      errorElement.textContent = error.message || 'Failed to load settings';
      errorElement.classList.remove('d-none');
    } else {
      console.error('settings-error element not found');
    }
  }
}

// Save restaurant settings to the server
async function saveSettings() {
  const name = document.getElementById('restaurant-name').value;
  const address = document.getElementById('restaurant-address').value;
  const phone = document.getElementById('restaurant-phone').value;
  const email = document.getElementById('restaurant-email').value;

  const operationalHours = document.getElementById('restaurant-hours').value;
  const gstNumber = document.getElementById('restaurant-gst').value;
  const tradeLicense = document.getElementById('restaurant-license').value;
  const showGst = document.getElementById('show-gst').checked;
  const showLicense = document.getElementById('show-trade-license').checked;
  const logoFile = document.getElementById('restaurant-logo').files[0];
  
  console.log('Form data before submission:');

  console.log('Phone:', phone);
  console.log('Email:', email);
  const errorElement = document.getElementById('settings-error');
  const successElement = document.getElementById('settings-success');
  
  // Validate required fields
  if (!name) {
    errorElement.textContent = 'Restaurant name is required';
    errorElement.classList.remove('d-none');
    successElement.classList.add('d-none');
    return;
  }
  
  // Create FormData object for file upload
  const formData = new FormData();
  formData.append('restaurant_name', name);
  formData.append('address', address);
  formData.append('phone', phone);
  formData.append('email', email);

  formData.append('operational_hours', operationalHours);
  formData.append('gst_number', gstNumber);
  formData.append('trade_license', tradeLicense);
  formData.append('show_gst', showGst);
  formData.append('show_trade_license', showLicense);
  
  // Only append logo if a new one was selected
  if (logoFile) {
    formData.append('logo', logoFile);
  }
  
  try {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    console.log('Server response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save settings');
    }
    
    // Update settings and show success message
    restaurantSettings = data;
    console.log('Updated settings:', restaurantSettings);
    errorElement.classList.add('d-none');
    successElement.textContent = 'Settings saved successfully';
    successElement.classList.remove('d-none');
    
    // Reload settings to update the form
    loadSettings();
  } catch (error) {
    console.error('Error saving settings:', error);
    errorElement.textContent = error.message || 'Failed to save settings';
    errorElement.classList.remove('d-none');
    successElement.classList.add('d-none');
  }
}