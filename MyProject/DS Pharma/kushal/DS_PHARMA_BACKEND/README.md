# DS Pharma Backend

Backend API for DS Pharma application with integrated Marg ERP API support.

## 🏗️ Architecture

This backend serves as a middleware between your frontend and the Marg ERP API, with complete separation of concerns.

![Architecture Diagram](C:/Users/VAIS-DT8-1/.gemini/antigravity/brain/4ced2e99-b75f-475b-aed7-e938eb63ce5e/marg_architecture_diagram_1769667465142.png)

### Flow

```
Frontend → Backend API → Marg Service → Marg ERP API
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/              # Authentication
│   ├── marg/              # 🔒 Isolated Marg API integration
│   │   ├── marg.service.js
│   │   ├── marg.controller.js
│   │   ├── marg.route.js
│   │   └── marg.examples.js
│   └── mastersync/        # 📡 Frontend-facing API
│       ├── masterSync.service.js
│       ├── masterSync.controller.js
│       └── masterSync.route.js
├── middlewares/
├── utils/
├── config/
├── app.js
└── index.js
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Marg API credentials
```

### 3. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Master Sync (For Frontend)

```
POST   /api/v1/master-sync              # Sync all master data
POST   /api/v1/master-sync/products     # Sync products only
POST   /api/v1/master-sync/customers    # Sync customers only
POST   /api/v1/master-sync/suppliers    # Sync suppliers only
GET    /api/v1/master-sync/products/:id # Get specific product
```

### Marg API (Optional Direct Access)

```
GET    /api/v1/marg/test                # Test Marg connection
GET    /api/v1/marg/products            # Fetch from Marg directly
GET    /api/v1/marg/customers           # Fetch from Marg directly
GET    /api/v1/marg/suppliers           # Fetch from Marg directly
```

### Authentication

```
POST   /api/v1/auth/login               # User login
POST   /api/v1/auth/register            # User registration
```

## 🔧 Configuration

Required environment variables in `.env`:

```env
# Marg API
MARG_API_BASE_URL=http://your-marg-api-url
MARG_API_KEY=your_api_key
MARG_SECRET_KEY=your_secret_key

# Database
MONGODB_URI=mongodb://localhost:27017/ds_pharma

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

## 📚 Documentation

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup summary and overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide with examples
- **[marg.examples.js](./src/modules/marg/marg.examples.js)** - Code examples

## 💡 Usage Example

### Frontend Integration

```javascript
// Sync all master data
const syncData = async () => {
  const response = await fetch("http://localhost:3000/api/v1/master-sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (result.success) {
    console.log("Products:", result.data.products);
    console.log("Customers:", result.data.customers);
    console.log("Suppliers:", result.data.suppliers);
  }
};
```

### Backend Module Integration

```javascript
// Use Marg service in any module
import margService from "../marg/marg.service.js";

const products = await margService.fetchProducts();
const customers = await margService.fetchCustomers();
```

## 🎯 Key Features

- ✅ **Isolated Marg Integration** - Marg API code is completely separate
- ✅ **Clean Architecture** - Clear separation of concerns
- ✅ **Reusable Service** - Use Marg service anywhere in your backend
- ✅ **Data Transformation** - Automatic conversion between Marg and your app format
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Authentication** - JWT-based authentication
- ✅ **CORS Support** - Configured for frontend integration

## 🔒 Security

- All endpoints protected with authentication middleware
- Marg API credentials stored in environment variables
- Encryption/decryption handled securely
- CORS configured for specific origins

## 🛠️ Development

### Project Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (to be implemented)
```

### Adding New Features

1. **Add new Marg endpoint**: Edit `src/modules/marg/marg.service.js`
2. **Add new frontend endpoint**: Edit `src/modules/mastersync/`
3. **Add new module**: Create new folder in `src/modules/`

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **axios** - HTTP client for Marg API
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **cookie-parser** - Cookie parsing
- **crypto-js** - Encryption/decryption
- **pako** - Compression/decompression

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🆘 Support

For issues or questions:

1. Check the documentation files
2. Review `marg.examples.js` for usage patterns
3. Check Marg ERP API documentation

---

**Built with ❤️ for DS Pharma**
