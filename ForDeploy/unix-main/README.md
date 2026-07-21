# Restaurant Menu Management System

## Overview
This is a complete restaurant menu management system with a backend admin panel for managing menu items and categories. The system allows administrators to add, modify, and delete menu categories and items, as well as toggle item availability. The frontend menu only displays items that are marked as available.

## Features

### Admin Panel
- Secure login with JWT authentication (default credentials: admin/Vais@2025)
- Change password functionality
- Category management (add, edit, delete)
- Item management (add, edit, delete, toggle availability)
- Restaurant settings management (name, logo, contact information, GST number, trade license)
- Responsive design using Bootstrap

### Frontend Menu
- Dynamic loading of menu items from the database
- Only displays items marked as available
- Organizes items by category
- Multi-language support with Google Translate integration
- Language switcher in top-right corner for easy language selection
- Floating category menu for mobile navigation
- Displays restaurant information in footer (configurable from admin panel)
- Option to show/hide GST number and trade license
- Responsive design for all devices with optimized mobile layout

## Language Support

The application includes comprehensive multi-language support powered by Google Translate API:

### Supported Languages
- **English** (Default)
- **Hindi** (हिंदी)
- **Spanish** (Español)
- **French** (Français)
- **German** (Deutsch)
- **Chinese** (中文)
- **Japanese** (日本語)
- **Arabic** (العربية)
- **Portuguese** (Português)
- **Russian** (Русский)

### Translation Features
- Real-time translation of menu items, categories, and descriptions <mcreference link="https://www.npmjs.com/package/@vitalets/google-translate-api" index="2">2</mcreference>
- Automatic language detection and translation
- Persistent language selection across page reloads
- Optimized translation caching for better performance
- Fallback to original text if translation fails

### Implementation
- Uses `@vitalets/google-translate-api` for free translation services <mcreference link="https://www.npmjs.com/package/@vitalets/google-translate-api" index="2">2</mcreference>
- Backup integration with `@google-cloud/translate` for enterprise usage <mcreference link="https://www.npmjs.com/package/@google-cloud/translate" index="1">1</mcreference>
- Client-side translation with efficient API usage
- Rate limiting protection to prevent API quota exhaustion

## Technical Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: HTML, CSS, JavaScript with Bootstrap
- **File Upload**: Multer for image handling
- **Translation**: Google Translate API integration

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Translation Dependencies** (Optional for enhanced translation features)
   ```bash
   npm install @vitalets/google-translate-api @google-cloud/translate
   ```

3. **Environment Configuration** (Optional for Google Cloud Translation)
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Access the Application**
   - Frontend Menu: http://localhost:9712
   - Admin Panel: http://localhost:9712/admin.html

## Translation Usage

### Frontend Language Switching
- Click the language button in the top-right corner
- Select your preferred language from the dropdown
- The entire menu will be translated automatically
- Language preference is saved in browser storage

### Supported Translation Methods
1. **Free Translation** (Default): Uses `@vitalets/google-translate-api` <mcreference link="https://www.npmjs.com/package/@vitalets/google-translate-api" index="2">2</mcreference>
2. **Enterprise Translation**: Uses official Google Cloud Translation API <mcreference link="https://cloud.google.com/translate/docs/reference/libraries/v2/nodejs" index="3">3</mcreference>

### Rate Limiting
- Free API has request limits per IP address <mcreference link="https://www.npmjs.com/package/@vitalets/google-translate-api" index="2">2</mcreference>
- Translations are cached to minimize API calls
- Automatic fallback to original text if limits are exceeded

## Admin Login
- **Username**: admin
- **Password**: Vais@2025

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/change-password` - Change admin password
- `GET /api/auth/verify` - Verify JWT token

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category
- `GET /api/categories/:id/items` - Get all items in a category

### Items
- `GET /api/items` - Get all items (with optional filter for available only)
- `GET /api/items/:id` - Get a specific item
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `PATCH /api/items/:id/toggle-availability` - Toggle item availability
- `DELETE /api/items/:id` - Delete an item

### Settings
- `GET /api/settings` - Get restaurant settings
- `PUT /api/settings` - Update restaurant settings

## Database Schema

### Categories Collection
- `_id` - MongoDB ObjectId
- `name` - Category name
- `created_at` - Creation timestamp

### Items Collection
- `_id` - MongoDB ObjectId
- `name` - Item name
- `price` - Item price
- `category_id` - Reference to categories collection
- `image_path` - Path to item image
- `available` - Boolean flag for availability
- `created_at` - Creation timestamp

### Admins Collection
- `_id` - MongoDB ObjectId
- `username` - Admin username
- `password` - Hashed password
- `created_at` - Creation timestamp

### Settings Collection
- `_id` - MongoDB ObjectId
- `restaurant_name` - Name of the restaurant
- `logo_path` - Path to restaurant logo
- `address` - Restaurant address
- `phone` - Contact phone number
- `email` - Contact email
- `operational_hours` - Business hours
- `gst_number` - GST registration number
- `show_gst` - Boolean to toggle GST display
- `trade_license` - Trade license number
- `show_trade_license` - Boolean to toggle trade license display

## Security Features
- Password hashing using bcrypt
- JWT token-based authentication
- Protected admin routes
- Input validation
- Secure file uploads with type and size validation

## Future Enhancements
- Order management system
- Customer feedback system
- Multi-language support
- Dark mode theme
- Online payment integration
- Table reservation system