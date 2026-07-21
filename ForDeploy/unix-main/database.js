const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Create a database connection
const dbPath = path.join(__dirname, 'restaurant.db');
const db = new sqlite3.Database(dbPath);

// Initialize the database with tables and default admin user
function initializeDatabase() {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create items table
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      category_id INTEGER,
      available BOOLEAN DEFAULT 1,
      image_path TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
  `);

  // Create admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, function(err) {
    if (err) {
      console.error('Error creating admins table:', err.message);
      return;
    }

    // Check if admin user exists
    db.get('SELECT * FROM admins WHERE username = ?', ['admin'], (err, row) => {
      if (err) {
        console.error('Error checking admin user:', err.message);
        return;
      }

      // If admin doesn't exist, create default admin
      if (!row) {
        const hashedPassword = bcrypt.hashSync('Vais@2025', 10);
        db.run(
          'INSERT INTO admins (username, password) VALUES (?, ?)',
          ['admin', hashedPassword],
          function(err) {
            if (err) {
              console.error('Error creating admin user:', err.message);
            } else {
              console.log('Default admin user created');
            }
          }
        );
      }
    });
  });

  // Populate categories from existing HTML
  populateInitialData();
}

// Function to populate initial data from the HTML menu
function populateInitialData() {
  const categories = [
    'Soup', 'Chowmin', 'Tandoori Chicken', 'Roti', 'Fish', 'Roll', 'Momo',
    'Bengali Food', 'Rice', 'Chinese Dishes', 'Main Course – Chicken',
    'Main Course – Veg', 'Main Course – Mutton'
  ];

  // Insert categories
  categories.forEach(category => {
    db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [category], function(err) {
      if (err) {
        console.error(`Error inserting category ${category}:`, err.message);
      }
    });
  });

  // Sample items data structure (would be populated from HTML in a real implementation)
  const menuItems = [
    { name: 'Hot Soup', price: '₹40', category: 'Soup' },
    { name: 'Manchaw Soup', price: '₹60', category: 'Soup' },
    { name: 'Veg Chaw', price: '₹50', category: 'Chowmin' },
    // More items would be added here
  ];

  // Insert sample items
  setTimeout(() => {
    menuItems.forEach(item => {
      db.get('SELECT id FROM categories WHERE name = ?', [item.category], (err, row) => {
        if (err || !row) {
          console.error(`Error finding category for ${item.name}:`, err ? err.message : 'Category not found');
          return;
        }

        db.run(
          'INSERT OR IGNORE INTO items (name, price, category_id, available) VALUES (?, ?, ?, 1)',
          [item.name, item.price, row.id],
          function(err) {
            if (err) {
              console.error(`Error inserting item ${item.name}:`, err.message);
            }
          }
        );
      });
    });
  }, 1000); // Delay to ensure categories are inserted first
}

module.exports = {
  db,
  initializeDatabase
};