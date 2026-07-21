// Global variables
let token = localStorage.getItem('token');
let categories = [];
let items = [];

// DOM Elements
const loginSection = document.getElementById('login-section');
const adminDashboard = document.getElementById('admin-dashboard');

// Bootstrap Modal Instances
let addCategoryModal, editCategoryModal, addItemModal, editItemModal, changePasswordModal, deleteConfirmModal;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Bootstrap modals
  addCategoryModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
  editCategoryModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
  addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
  editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
  changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
  deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));

  // Check if user is logged in
  if (token) {
    verifyToken();
  } else {
    showLoginForm();
  }

  // Event Listeners
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  // Login form submission
  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // Logout button
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Change password button
  document.getElementById('change-password-btn').addEventListener('click', () => {
    changePasswordModal.show();
  });

  // Update password button
  document.getElementById('update-password-btn').addEventListener('click', handleChangePassword);

  // Sidebar navigation
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.closest('.nav-link').dataset.section;
      switchSection(section);
    });
  });

  // Mobile toggle
  document.querySelector('.mobile-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('show');
  });

  // Category management
  document.getElementById('save-category-btn').addEventListener('click', handleAddCategory);
  document.getElementById('update-category-btn').addEventListener('click', handleUpdateCategory);

  // Item management
  document.getElementById('save-item-btn').addEventListener('click', handleAddItem);
  document.getElementById('update-item-btn').addEventListener('click', handleUpdateItem);
  document.getElementById('show-all-items').addEventListener('change', loadItems);

  // Filter controls
  document.getElementById('filter-category').addEventListener('change', loadItems);
  document.getElementById('sort-by').addEventListener('change', loadItems);
  document.getElementById('search-items').addEventListener('input', loadItems);

  // Delete confirmation
  document.getElementById('confirm-delete-btn').addEventListener('click', handleConfirmDelete);
}

// Switch between sections
function switchSection(sectionName) {
  // Update active nav link
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

  // Update page title
  const titles = {
    'categories': 'Categories',
    'items': 'Menu Items',
    'settings': 'Settings'
  };
  document.getElementById('page-title').textContent = titles[sectionName] || sectionName;

  // Show/hide content sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionName).classList.add('active');

  // Load section data if needed
  switch(sectionName) {
    case 'categories':
      loadCategories();
      break;
    case 'items':
      loadItems();
      break;
    case 'settings':
      loadSettings();
      break;
  }

  // Close mobile sidebar
  document.querySelector('.sidebar').classList.remove('show');
}

// Load settings
async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to load settings');
    }
    
    // Populate form with settings data
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
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Authentication Functions
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('login-error');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save token and show dashboard
    token = data.token;
    localStorage.setItem('token', token);
    showDashboard();
    errorElement.classList.add('d-none');
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('d-none');
  }
}

async function verifyToken() {
  try {
    const response = await fetch('/api/auth/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    showDashboard();
  } catch (error) {
    handleLogout();
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  token = null;
  showLoginForm();
}

async function handleChangePassword() {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorElement = document.getElementById('change-password-error');

  // Validate passwords
  if (newPassword !== confirmPassword) {
    errorElement.textContent = 'New passwords do not match';
    errorElement.classList.remove('d-none');
    return;
  }

  if (newPassword.length < 6) {
    errorElement.textContent = 'New password must be at least 6 characters long';
    errorElement.classList.remove('d-none');
    return;
  }

  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }

    // Reset form and close modal
    document.getElementById('change-password-form').reset();
    errorElement.classList.add('d-none');
    changePasswordModal.hide();
    alert('Password changed successfully');
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('d-none');
  }
}

// UI Functions
function showLoginForm() {
  loginSection.classList.remove('d-none');
  adminDashboard.classList.add('d-none');
}

function showDashboard() {
  loginSection.classList.add('d-none');
  adminDashboard.classList.remove('d-none');
  
  // Initialize with categories section active
  switchSection('categories');
}

// Category Management Functions
async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    categories = await response.json();

    // Update categories table
    const tableBody = document.getElementById('categories-table-body');
    const mobileCards = document.getElementById('categories-mobile-cards');
    tableBody.innerHTML = '';
    if (mobileCards) mobileCards.innerHTML = '';

    categories.forEach((category, index) => {
      const row = document.createElement('tr');
      row.className = 'draggable-row';
      row.dataset.categoryId = category.id;
      
      // Create cells safely to prevent XSS
      const dragCell = document.createElement('td');
      dragCell.className = 'drag-handle';
      dragCell.textContent = '⋮⋮';
      
      const idCell = document.createElement('td');
      idCell.textContent = category.id;
      
      const nameCell = document.createElement('td');
      nameCell.textContent = category.name; // Safe from XSS
      
      const actionsCell = document.createElement('td');
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-primary btn-action edit-category';
      editBtn.dataset.id = category.id;
      editBtn.textContent = 'Edit';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-danger btn-action delete-category';
      deleteBtn.dataset.id = category.id;
      deleteBtn.textContent = 'Delete';
      
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(dragCell);
      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
      
      // Create mobile cards for categories
      if (mobileCards) {
        const mobileCard = document.createElement('div');
        mobileCard.className = 'item-mobile-card';
        mobileCard.dataset.categoryId = category.id;
        
        mobileCard.innerHTML = `
          <div class="item-mobile-header">
            <div class="item-mobile-name">${category.name}</div>
            <span class="badge bg-primary item-mobile-status">Category</span>
          </div>
          <div class="item-mobile-details">
            <div><strong>ID:</strong> ${category.id}</div>
            <div><strong>Position:</strong> ${index + 1}</div>
          </div>
          <div class="item-mobile-actions">
            <button class="btn btn-sm btn-outline-primary edit-category" data-id="${category.id}">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-category" data-id="${category.id}">Delete</button>
          </div>
        `;
        
        mobileCards.appendChild(mobileCard);
      }
    });

    // Initialize drag and drop functionality
    initializeCategoryDragDrop();

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-category').forEach(button => {
      button.addEventListener('click', () => showEditCategoryModal(button.dataset.id));
    });

    document.querySelectorAll('.delete-category').forEach(button => {
      button.addEventListener('click', () => showDeleteConfirmModal('category', button.dataset.id));
    });

    // Update category dropdowns in item forms
    updateCategoryDropdowns();
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Initialize drag and drop functionality for categories
function initializeCategoryDragDrop() {
  const tableBody = document.getElementById('categories-table-body');
  
  if (tableBody && window.Sortable) {
    new Sortable(tableBody, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'dragging',
      onEnd: async function(evt) {
        // Get the new order of categories
        const rows = tableBody.querySelectorAll('tr');
        const newOrder = Array.from(rows).map((row, index) => ({
          id: parseInt(row.dataset.categoryId),
          order: index + 1
        }));
        
        try {
          // Send the new order to the server
          const response = await fetch('/api/categories/reorder', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ categories: newOrder })
          });
          
          if (!response.ok) {
            throw new Error('Failed to update category order');
          }
          
          console.log('Category order updated successfully');
          // Reload categories to reflect the new order
          loadCategories();
        } catch (error) {
          console.error('Error updating category order:', error);
          // Reload categories to revert the visual change
          loadCategories();
        }
      }
    });
  }
}

// Initialize drag and drop for items
function initializeItemDragDrop() {
  // Wait for DOM to be fully updated
  setTimeout(() => {
    const sortableContainers = document.querySelectorAll('.sortable-items');
    
    sortableContainers.forEach(container => {
      // Destroy existing sortable instance if it exists
      if (container.sortableInstance) {
        container.sortableInstance.destroy();
      }
      
      // Create new sortable instance
      container.sortableInstance = new Sortable(container, {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        forceFallback: true,
        fallbackTolerance: 3,
        onStart: function(evt) {
          evt.item.style.opacity = '0.5';
        },
        onEnd: async function(evt) {
          evt.item.style.opacity = '1';
          
          // Get the category name from the container
          const categoryName = container.getAttribute('data-category');
          
          // Get the new order of items within this category
          const rows = container.querySelectorAll('.draggable-item-row');
          const newOrder = Array.from(rows).map((row, index) => ({
            id: row.getAttribute('data-item-id'),
            order: index
          }));

          try {
            const response = await fetch('/api/items/reorder', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ items: newOrder, category: categoryName })
            });

            if (!response.ok) {
              throw new Error('Failed to reorder items');
            }

            console.log('Items reordered successfully');
          } catch (error) {
            console.error('Error reordering items:', error);
            // Reload items to restore original order
            loadItems();
          }
        }
      });
    });
  }, 100);
}

async function handleAddCategory() {
  const categoryName = document.getElementById('category-name').value;
  const errorElement = document.getElementById('add-category-error');

  if (!categoryName) {
    errorElement.textContent = 'Category name is required';
    errorElement.classList.remove('d-none');
    return;
  }

  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add category');
    }

    // Reset form and close modal
    document.getElementById('add-category-form').reset();
    errorElement.classList.add('d-none');
    addCategoryModal.hide();
    loadCategories();
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('d-none');
  }
}

function showEditCategoryModal(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return;

  document.getElementById('edit-category-id').value = category.id;
  document.getElementById('edit-category-name').value = category.name;
  document.getElementById('edit-category-error').classList.add('d-none');
  editCategoryModal.show();
}

async function handleUpdateCategory() {
  const categoryId = document.getElementById('edit-category-id').value;
  const categoryName = document.getElementById('edit-category-name').value;
  const errorElement = document.getElementById('edit-category-error');

  if (!categoryName) {
    errorElement.textContent = 'Category name is required';
    errorElement.classList.remove('d-none');
    return;
  }

  try {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update category');
    }

    // Close modal and reload categories
    errorElement.classList.add('d-none');
    editCategoryModal.hide();
    loadCategories();
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('d-none');
  }
}

// Item Management Functions
async function loadItems() {
  const showAll = document.getElementById('show-all-items').checked;

  try {
    const response = await fetch(`/api/items?showAll=${showAll}`);
    items = await response.json();

    // Update category filter dropdown
    updateCategoryFilter();

    // Apply filters
    let filteredItems = applyFilters(items);

    // Update items table
    const itemsContainer = document.getElementById('items-table-body');
    const mobileCards = document.getElementById('items-mobile-cards');
    itemsContainer.innerHTML = '';
    if (mobileCards) {
      mobileCards.innerHTML = '';
    }

    // Group items by category
    const itemsByCategory = {};
    filteredItems.forEach(item => {
      const categoryName = item.category_name || 'Uncategorized';
      if (!itemsByCategory[categoryName]) {
        itemsByCategory[categoryName] = [];
      }
      itemsByCategory[categoryName].push(item);
    });

    // Display items grouped by category in compact card format
    Object.keys(itemsByCategory).forEach(categoryName => {
      // Add category header for table
      const categoryHeader = document.createElement('tr');
      const headerCell = document.createElement('td');
      headerCell.colSpan = 10;
      headerCell.className = 'category-header-compact';
      headerCell.textContent = `📁 ${categoryName}`; // Safe from XSS
      categoryHeader.appendChild(headerCell);
      itemsContainer.appendChild(categoryHeader);

      // Add category header for mobile cards
      if (mobileCards) {
        const mobileCategoryHeader = document.createElement('div');
        mobileCategoryHeader.className = 'mobile-category-header';
        mobileCategoryHeader.style.cssText = 'background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); font-weight: bold; font-size: 1rem; padding: 12px 15px; border-left: 4px solid #007bff; margin: 15px 0 10px 0; border-radius: 6px;';
        mobileCategoryHeader.textContent = categoryName;
        mobileCards.appendChild(mobileCategoryHeader);
      }

      // Create items container for this category
      const categoryContainer = document.createElement('tr');
      categoryContainer.innerHTML = `
        <td colspan="10" class="items-grid-container">
          <div class="items-grid sortable-items" data-category="${categoryName}">
            ${itemsByCategory[categoryName].map(item => {
              // Determine food type icon
              let foodTypeIcon = '';
              if (item.food_type === 'veg') {
                foodTypeIcon = '<span class="badge bg-success">🟢 Veg</span>';
              } else if (item.food_type === 'non-veg') {
                foodTypeIcon = '<span class="badge bg-danger">🔴 Non-Veg</span>';
              } else if (item.food_type === 'egg') {
                foodTypeIcon = '<span class="badge bg-warning text-dark">🟡 Egg</span>';
              }

              // Format prices
              const halfPrice = item.price_half ? `₹${item.price_half}` : '';
              const fullPrice = item.price_full ? `₹${item.price_full}` : '';
              const priceDisplay = halfPrice && fullPrice ? `${halfPrice} / ${fullPrice}` : (halfPrice || fullPrice || 'Price not set');

              return `
                <div class="item-card-single-line draggable-item-row ${!item.available ? 'unavailable' : ''}" data-item-id="${item.id}" style="display: flex; align-items: center; padding: 8px; border: 1px solid #dee2e6; margin-bottom: 4px; background: white;">
                  <span class="drag-handle" style="margin-right: 8px; cursor: grab; padding: 4px; color: #6c757d; font-weight: bold; user-select: none;">⋮⋮</span>
                  <span class="item-id" style="margin-right: 8px; font-weight: bold;">#${item.id}</span>
                  <span class="item-name" style="margin-right: 12px; font-weight: 600; min-width: 120px;">${item.name}</span>
                  <span class="item-description d-none d-md-inline" style="margin-right: 12px; flex: 1; color: #6c757d; font-size: 14px;">${item.description || 'No description'}</span>
                  <span style="margin-right: 8px;">${halfPrice}</span>
                  <span style="margin-right: 12px;">${fullPrice}</span>
                  ${foodTypeIcon}
                  <span class="item-status ${item.available ? 'status-available' : 'status-unavailable'}" style="margin: 0 12px;">
                    ${item.available ? '✓' : '✗'}
                  </span>
                  <div class="item-actions" style="margin-left: auto;">
                    <button class="btn btn-xs btn-primary edit-item" data-id="${item.id}" style="margin-right: 4px;">Edit</button>
                    <button class="btn btn-xs btn-${item.available ? 'warning' : 'success'} toggle-item" data-id="${item.id}" style="margin-right: 4px;">
                      ${item.available ? 'Hide' : 'Show'}
                    </button>
                    <button class="btn btn-xs btn-danger delete-item" data-id="${item.id}">Del</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </td>
      `;
      itemsContainer.appendChild(categoryContainer);

      // Create mobile cards for this category
      if (mobileCards) {
        itemsByCategory[categoryName].forEach(item => {
          const mobileCard = document.createElement('div');
          mobileCard.className = 'item-mobile-card';
          mobileCard.dataset.itemId = item.id;
          mobileCard.dataset.categoryId = item.category_id;
          
          const statusBadgeClass = item.available ? 'bg-success' : 'bg-danger';
          const statusText = item.available ? 'Available' : 'Unavailable';
          
          // Determine food type icon
          let foodTypeIcon = '';
          if (item.food_type === 'veg') {
            foodTypeIcon = '<span class="badge bg-success">🟢 Veg</span>';
          } else if (item.food_type === 'non-veg') {
            foodTypeIcon = '<span class="badge bg-danger">🔴 Non-Veg</span>';
          } else if (item.food_type === 'egg') {
            foodTypeIcon = '<span class="badge bg-warning text-dark">🟡 Egg</span>';
          }
          
          mobileCard.innerHTML = `
            <div class="item-mobile-header">
              <div class="item-mobile-name">${item.name}</div>
              <span class="badge ${statusBadgeClass} item-mobile-status">${statusText}</span>
            </div>
            <div class="item-mobile-details">
              <div><strong>ID:</strong> ${item.id}</div>
              <div><strong>Category:</strong> ${item.category_name || 'Uncategorized'}</div>
              ${item.description ? `<div><strong>Description:</strong> ${item.description}</div>` : '<div><strong>Description:</strong> No description available</div>'}
              <div><strong>Food Type:</strong> ${foodTypeIcon}</div>
              ${item.image ? `<div><strong>Image:</strong> <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-left: 8px;"></div>` : ''}
            </div>
            <div class="item-mobile-prices">
              <div><strong>Half Plate:</strong> ₹${item.price_half || 'N/A'}</div>
              <div><strong>Full Plate:</strong> ₹${item.price_full || 'N/A'}</div>
            </div>
            <div class="item-mobile-actions">
              <button class="btn btn-sm btn-outline-primary edit-item" data-id="${item.id}">Edit</button>
              <button class="btn btn-sm btn-outline-${item.available ? 'warning' : 'success'} toggle-item" data-id="${item.id}">
                ${item.available ? 'Hide' : 'Show'}
              </button>
              <button class="btn btn-sm btn-outline-danger delete-item" data-id="${item.id}">Delete</button>
            </div>
          `;
          
          mobileCards.appendChild(mobileCard);
        });
      }
    });

    // Add event listeners to buttons
    document.querySelectorAll('.edit-item').forEach(button => {
      button.addEventListener('click', () => showEditItemModal(button.dataset.id));
    });

    document.querySelectorAll('.toggle-item').forEach(button => {
      button.addEventListener('click', () => toggleItemAvailability(button.dataset.id));
    });

    document.querySelectorAll('.delete-item').forEach(button => {
      button.addEventListener('click', () => showDeleteConfirmModal('item', button.dataset.id));
    });

    // Initialize drag and drop for items
    initializeItemDragDrop();
  } catch (error) {
    console.error('Error loading items:', error);
  }
}

function updateCategoryDropdowns() {
  const addItemCategorySelect = document.getElementById('item-category');
  const editItemCategorySelect = document.getElementById('edit-item-category');

  // Clear existing options
  addItemCategorySelect.innerHTML = '';
  editItemCategorySelect.innerHTML = '';

  // Add options for each category
  categories.forEach(category => {
    const addOption = document.createElement('option');
    addOption.value = category.id;
    addOption.textContent = category.name;
    addItemCategorySelect.appendChild(addOption);

    const editOption = document.createElement('option');
    editOption.value = category.id;
    editOption.textContent = category.name;
    editItemCategorySelect.appendChild(editOption);
  });
}

async function handleAddItem() {
  const name = document.getElementById('item-name').value;
  const description = document.getElementById('item-description').value;
  const priceHalf = document.getElementById('item-price-half').value;
  const priceFull = document.getElementById('item-price-full').value;
  const foodType = document.getElementById('item-food-type').value;
  const categoryId = document.getElementById('item-category').value;
  const available = document.getElementById('item-available').checked;
  const imageFile = document.getElementById('item-image').files[0];
  const errorElement = document.getElementById('add-item-error');

  if (!name || !priceFull || !categoryId) {
    errorElement.textContent = 'Name, full plate price, and category are required';
    errorElement.classList.remove('d-none');
    return;
  }

  // Create FormData object for file upload
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price_half', priceHalf);
  formData.append('price_full', priceFull);
  formData.append('food_type', foodType);
  formData.append('category_id', categoryId);
  formData.append('available', available);
  
  // Only append image if one was selected
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add item');
    }

    // Reset form and close modal
    document.getElementById('add-item-form').reset();
    errorElement.classList.add('d-none');
    addItemModal.hide();
    loadItems();
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('d-none');
  }
}

function showEditItemModal(itemId) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('edit-item-id').value = item.id;
  document.getElementById('edit-item-name').value = item.name;
  document.getElementById('edit-item-description').value = item.description || '';
  document.getElementById('edit-item-price-half').value = item.price_half || '';
  document.getElementById('edit-item-price-full').value = item.price_full;
  document.getElementById('edit-item-food-type').value = item.food_type || 'veg';
  document.getElementById('edit-item-category').value = item.category_id;
  document.getElementById('edit-item-available').checked = item.available === 1;
  document.getElementById('edit-item-error').classList.add('d-none');
  
  // Handle image display
  const currentImageContainer = document.getElementById('current-image-container');
  const currentItemImage = document.getElementById('current-item-image');
  
  if (item.image_path) {
    currentItemImage.src = item.image_path;
    currentImageContainer.style.display = 'block';
  } else {
    currentImageContainer.style.display = 'none';
  }
  
  // Reset the file input
  document.getElementById('edit-item-image').value = '';
  
  editItemModal.show();
}

async function handleUpdateItem() {
  const itemId = document.getElementById('edit-item-id').value;
  const name = document.getElementById('edit-item-name').value;
  const description = document.getElementById('edit-item-description').value;
  const priceHalf = document.getElementById('edit-item-price-half').value;
  const priceFull = document.getElementById('edit-item-price-full').value;
  const foodType = document.getElementById('edit-item-food-type').value;
  const categoryId = document.getElementById('edit-item-category').value;
  const available = document.getElementById('edit-item-available').checked;
  const imageFile = document.getElementById('edit-item-image').files[0];
  const errorElement = document.getElementById('edit-item-error');

  if (!name || !priceFull || !categoryId) {
    errorElement.textContent = 'Name, full plate price, and category are required';
    errorElement.classList.remove('d-none');
    return;
  }

  // Create FormData object for file upload
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price_half', priceHalf);
  formData.append('price_full', priceFull);
  formData.append('food_type', foodType);
  formData.append('category_id', categoryId);
  formData.append('available', available ? '1' : '0'); // Explicitly convert to string '1' or '0'
  
  // Only append image if a new one was selected
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const response = await fetch(`/api/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update item');
    }

    // Close modal and reload items
    errorElement.classList.add('d-none');
    editItemModal.hide();
    loadItems();
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('d-none');
  }
}

async function toggleItemAvailability(itemId) {
  try {
    const response = await fetch(`/api/items/${itemId}/toggle-availability`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to toggle item availability');
    }

    loadItems();
  } catch (error) {
    console.error('Error toggling item availability:', error);
    alert(error.message);
  }
}

// Filter and Sort Functions
function updateCategoryFilter() {
  const filterSelect = document.getElementById('filter-category');
  const currentValue = filterSelect.value;
  
  // Clear existing options except "All Categories"
  filterSelect.innerHTML = '<option value="">All Categories</option>';
  
  // Get unique categories from items
  const uniqueCategories = [...new Set(items.map(item => item.category_name || 'Uncategorized'))];
  uniqueCategories.sort();
  
  // Add category options
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
  
  // Restore previous selection if it still exists
  if (currentValue && uniqueCategories.includes(currentValue)) {
    filterSelect.value = currentValue;
  }
}

function applyFilters(itemsToFilter) {
  let filtered = [...itemsToFilter];
  
  // Get filter values
  const categoryFilter = document.getElementById('filter-category')?.value || '';
  const sortBy = document.getElementById('sort-by')?.value || 'default';
  const searchTerm = document.getElementById('search-items')?.value.toLowerCase() || '';
  
  // Apply category filter
  if (categoryFilter) {
    filtered = filtered.filter(item => (item.category_name || 'Uncategorized') === categoryFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'category':
      filtered.sort((a, b) => {
        const catA = a.category_name || 'Uncategorized';
        const catB = b.category_name || 'Uncategorized';
        return catA.localeCompare(catB);
      });
      break;
    case 'price-asc':
      filtered.sort((a, b) => {
        const priceA = a.price_full || a.price_half || 0;
        const priceB = b.price_full || b.price_half || 0;
        return priceA - priceB;
      });
      break;
    case 'price-desc':
      filtered.sort((a, b) => {
        const priceA = a.price_full || a.price_half || 0;
        const priceB = b.price_full || b.price_half || 0;
        return priceB - priceA;
      });
      break;
    case 'default':
    default:
      // Keep the existing backend sorting (food type priority + price)
      break;
  }
  
  return filtered;
}

// Delete Confirmation Functions
function showDeleteConfirmModal(type, id) {
  const message = type === 'category' 
    ? 'Are you sure you want to delete this category? All items in this category will also be deleted.'
    : 'Are you sure you want to delete this item?';

  document.getElementById('delete-confirm-message').textContent = message;
  document.getElementById('delete-item-id').value = id;
  document.getElementById('delete-item-type').value = type;
  deleteConfirmModal.show();
}

async function handleConfirmDelete() {
  const id = document.getElementById('delete-item-id').value;
  const type = document.getElementById('delete-item-type').value;

  try {
    const endpoint = type === 'category' ? `/api/categories/${id}` : `/api/items/${id}`;
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Failed to delete ${type}`);
    }

    deleteConfirmModal.hide();
    if (type === 'category') {
      loadCategories();
    }
    loadItems();
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    alert(error.message);
    deleteConfirmModal.hide();
  }
}