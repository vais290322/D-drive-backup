// Main application JavaScript file

// DOM elements
const mainContent = document.getElementById('main-content');
const navItems = document.querySelectorAll('.nav-item');

// Current page
let currentPage = 'dashboard';

// Import page-specific modules
import('./dashboard.js').then(module => window.initDashboard = module.default);
import('./employees.js').then(module => window.initEmployees = module.default);
import('./calls.js').then(module => window.initCalls = module.default);
import('./weather.js').then(module => window.initWeather = module.default);
import('./news.js').then(module => window.initNews = module.default);
import('./settings.js').then(module => window.initSettings = module.default);

// Load page content
async function loadPage(pageName) {
  try {
    // Load the page content
    const response = await fetch(`pages/${pageName}.html`);
    const html = await response.text();
    
    // Update the main content
    mainContent.innerHTML = html;
    
    // Update active navigation item
    navItems.forEach(item => {
      if (item.dataset.page === pageName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Initialize page-specific JavaScript
    switch(pageName) {
      case 'dashboard':
        if (typeof window.initDashboard === 'function') window.initDashboard();
        break;
      case 'employees':
        if (typeof window.initEmployees === 'function') window.initEmployees();
        break;
      case 'calls':
        if (typeof window.initCalls === 'function') window.initCalls();
        break;
      case 'weather':
        if (typeof window.initWeather === 'function') window.initWeather();
        break;
      case 'news':
        if (typeof window.initNews === 'function') window.initNews();
        break;
      case 'settings':
        if (typeof window.initSettings === 'function') window.initSettings();
        break;
    }
    
    // Save current page
    currentPage = pageName;
    localStorage.setItem('lastPage', pageName);
  } catch (error) {
    console.error('Error loading page:', error);
    mainContent.innerHTML = `
      <div class="error-message">
        <h2>Error Loading Page</h2>
        <p>Failed to load ${pageName} page. Please try again.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

// Add click event listeners to navigation items
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const pageName = item.dataset.page;
    loadPage(pageName);
  });
});

// Load the initial page
document.addEventListener('DOMContentLoaded', () => {
  const lastPage = localStorage.getItem('lastPage') || 'dashboard';
  loadPage(lastPage);
});