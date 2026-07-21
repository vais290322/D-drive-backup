const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Create a database connection
const dbPath = path.join(__dirname, 'restaurant.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Menu data from the original HTML
const menuData = [
  {
    category: 'Soup',
    items: [
      { name: 'Hot Soup', price: '₹40' },
      { name: 'Manchaw Soup', price: '₹60' },
      { name: 'Noodle Soup', price: '₹40/₹60' }
    ]
  },
  {
    category: 'Chowmin',
    items: [
      { name: 'Veg Chaw', price: '₹50' },
      { name: 'Egg Chaw', price: '₹60' },
      { name: 'Chicken Chaw', price: '₹100' }
    ]
  },
  {
    category: 'Tandoori Chicken',
    items: [
      { name: 'Afgani Tikka', price: '₹150' },
      { name: 'Paneer Tikka (8pc)', price: '₹150' },
      { name: 'Paneer Tikka (Whole)', price: '₹350' },
      { name: 'Reshmi Kabab', price: '₹130' },
      { name: 'Hariyali Kabab', price: '₹150' },
      { name: 'Murgh Angara', price: '₹160' },
      { name: 'Tandoor Leg (1pc)', price: '₹90' }
    ]
  },
  {
    category: 'Roti',
    items: [
      { name: 'Tandoori Roti', price: '₹7' },
      { name: 'Rumal Roti', price: '₹15' },
      { name: 'Butter Roti', price: '₹10' },
      { name: 'Naan', price: '₹15' },
      { name: 'Lachha Paratha', price: '₹17' },
      { name: 'Plain Roti', price: '₹5' }
    ]
  },
  {
    category: 'Fish',
    items: [
      { name: 'Hariyali Fish', price: '₹140' },
      { name: 'Fish Tikka', price: '₹140' },
      { name: 'Fish Finger - 2pcs', price: '₹140' },
      { name: 'Fish Fry - 2pcs', price: '₹140' },
      { name: 'Fish Pakuri - 2pcs', price: '₹140' }
    ]
  },
  {
    category: 'Roll',
    items: [
      { name: 'Egg Roll', price: '₹40' },
      { name: 'Egg Chicken Roll', price: '₹60' },
      { name: 'Chicken Tortilla Roll', price: '₹120' }
    ]
  },
  {
    category: 'Momo',
    items: [
      { name: 'Veg Momo', price: '₹70' },
      { name: 'Chicken Momo', price: '₹80' }
    ]
  },
  {
    category: 'Bengali Food',
    items: [
      { name: 'Rice', price: '₹10/₹15' },
      { name: 'Veg Rice', price: '₹30' },
      { name: 'Egg Rice', price: '₹50' },
      { name: 'Fish Rice', price: '₹60' }
    ]
  },
  {
    category: 'Rice',
    items: [
      { name: 'Jeera Rice', price: '₹60' },
      { name: 'Chicken Biryani', price: '₹120' },
      { name: 'Mutton Biryani', price: '₹140' },
      { name: 'Egg Biryani', price: '₹80' },
      { name: 'Biryani Extra (Chicken/Mutton/Potato/Egg)', price: '₹60/₹100/₹10' }
    ]
  },
  {
    category: 'Chinese Dishes',
    items: [
      { name: 'Chilli Chicken', price: '₹140/₹80' },
      { name: 'Chicken 65', price: '₹140' },
      { name: 'Star Fried Chicken', price: '₹140' },
      { name: 'Chicken S & Paper', price: '₹140' },
      { name: 'Chicken Manchurian', price: '₹120/₹80' },
      { name: 'American Cnopey Veg/N-Veg', price: '₹80/₹140' },
      { name: 'Chines Vel', price: '₹60' },
      { name: 'Sevan Chicken', price: '₹130/₹70' },
      { name: 'Shanghai Chicken', price: '₹140' },
      { name: 'Zemo Chicken', price: '₹140/₹80' },
      { name: 'Chicken Hot Garlic', price: '₹140/₹80' },
      { name: 'Chicken Lolypop (4p)', price: '₹140/₹80' },
      { name: 'Chicken Drumup Haven (4p)', price: '₹100' },
      { name: 'Hunan Chicken', price: '₹140/₹80' },
      { name: 'Cuny Pao Chicken', price: '₹140' },
      { name: 'Crispy Cansy Chicken', price: '₹130/₹80' },
      { name: 'Zangli Chicken', price: '₹140' },
      { name: 'Paper Chicken', price: '₹120' },
      { name: 'Veg Chao Chao', price: '₹60' },
      { name: 'Bannana Leaf Steamed Fish (4p)', price: '₹100' }
    ]
  },
  {
    category: 'Main Course – Chicken',
    items: [
      { name: 'Chicken Curry (4pc)', price: '₹160/₹90' },
      { name: 'Chicken Masala (4pc)', price: '₹160/₹90' },
      { name: 'Chicken Kosha (4pc)', price: '₹200/₹100' },
      { name: 'Chicken Dopayaja (4pc)', price: '₹160/₹90' },
      { name: 'Chicken Chap (2pc)', price: '₹200/₹100' },
      { name: 'Chicken Butter (4pc)', price: '₹180/₹100' },
      { name: 'Chicken Butter Masala (4pc)', price: '₹200/₹100' },
      { name: 'Chicken Tikka Masala (8pc)', price: '₹180' }
    ]
  },
  {
    category: 'Main Course – Veg',
    items: [
      { name: 'Veg Kadai', price: '₹100' },
      { name: 'Paneer Butter Masala (6pc)', price: '₹100' },
      { name: 'Kadai Paneer (6pc)', price: '₹140/₹80' },
      { name: 'Palak Paneer (8pc)', price: '₹140/₹80' },
      { name: 'Paneer Dopayaja (8pc)', price: '₹140/₹80' },
      { name: 'Paneer Lababder (8pc)', price: '₹140/₹80' }
    ]
  },
  {
    category: 'Main Course – Mutton',
    items: [
      { name: 'Mutton Curry', price: '₹200/₹120' },
      { name: 'Mutton Masala', price: '₹250/₹150' },
      { name: 'Mutton Corma', price: '₹250/₹150' },
      { name: 'Mutton Rejala', price: '₹250/₹150' },
      { name: 'Mutton Kadai', price: '₹250/₹150' },
      { name: 'Mutton Dopayaja', price: '₹250/₹150' },
      { name: 'Mutton Chap', price: '₹200' }
    ]
  }
];

// Initialize the database
function initializeDatabase() {
  console.log('Initializing database...');
  
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

  // Populate menu data
  populateMenuData();
}

// Populate menu data from the array
function populateMenuData() {
  console.log('Populating menu data...');
  
  // Insert categories and items
  menuData.forEach(categoryData => {
    const categoryName = categoryData.category;
    
    // Insert category
    db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [categoryName], function(err) {
      if (err) {
        console.error(`Error inserting category ${categoryName}:`, err.message);
        return;
      }
      
      // Get the category ID
      db.get('SELECT id FROM categories WHERE name = ?', [categoryName], (err, category) => {
        if (err || !category) {
          console.error(`Error finding category ${categoryName}:`, err ? err.message : 'Category not found');
          return;
        }
        
        // Insert items for this category
        categoryData.items.forEach(item => {
          db.run(
            'INSERT OR IGNORE INTO items (name, price, category_id, available) VALUES (?, ?, ?, 1)',
            [item.name, item.price, category.id],
            function(err) {
              if (err) {
                console.error(`Error inserting item ${item.name}:`, err.message);
              }
            }
          );
        });
      });
    });
  });
  
  console.log('Database population initiated. This may take a moment to complete.');
}

// Initialize the database
initializeDatabase();

// Close the database connection after a delay to allow operations to complete
setTimeout(() => {
  console.log('Database population completed.');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}, 5000);