# WhatsApp SaaS — Setup Guide

A multi-user WhatsApp SaaS platform built with Node.js, Express, MongoDB & whatsapp-web.js.

---

## 📁 Folder Structure

```
whatsappapi/
├── server.js                  ← Express app entry point
├── .env                       ← Environment variables
├── .env.example               ← Env template
├── package.json
├── src/
│   ├── config/
│   │   └── db.js              ← MongoDB connection
│   ├── models/
│   │   ├── User.js            ← User (email, passwordHash, apiKey)
│   │   └── Template.js        ← Message templates
│   ├── middleware/
│   │   ├── auth.js            ← JWT middleware
│   │   └── apiKeyAuth.js      ← API key middleware
│   ├── services/
│   │   └── whatsappManager.js ← Per-user WhatsApp client manager
│   └── routes/
│       ├── auth.js            ← /api/auth/register, /login
│       ├── whatsapp.js        ← /api/whatsapp/qr, /status, /disconnect
│       ├── templates.js       ← /api/templates CRUD
│       ├── messages.js        ← /api/messages/send, /send-template
│       └── public.js          ← /api/public/send (API key auth)
└── public/
    ├── index.html             ← Login
    ├── register.html          ← Register
    ├── dashboard.html         ← Connect WhatsApp (QR)
    ├── send.html              ← Send messages
    ├── templates.html         ← Manage templates
    ├── css/
    │   └── style.css
    └── js/
        └── api.js             ← Shared fetch + auth utility
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017`
  - Install: [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
  - Or use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier — paste the connection URI in `.env`

---

## 🚀 Quick Start

```bash
# 1. Navigate to project
cd whatsappapi

# 2. Install dependencies (already done if you ran npm install)
npm install

# 3. Configure environment (already created with defaults)
# Edit .env if needed:
#   MONGO_URI=mongodb://127.0.0.1:27017/whatsappapi
#   JWT_SECRET=your_secret_here
#   PORT=3000

# 4. Start the server
npm start
# or for auto-reload during development:
npm run dev
```

Open your browser: **http://localhost:3000**

---

## 🔑 Public API Reference

Every user gets a unique **API key** (shown on the Dashboard page after login).

### Send a raw message
```http
POST /api/public/send
x-api-key: <your-api-key>
Content-Type: application/json

{
  "to": "919876543210",
  "message": "Hello from the API!"
}
```

### Send a template message
```http
POST /api/public/send-template
x-api-key: <your-api-key>
Content-Type: application/json

{
  "to": "919876543210",
  "templateName": "Order Ready",
  "variables": {
    "name": "Rahul",
    "orderId": "ORD-001"
  }
}
```

> **Phone format**: Include the country code without '+' or spaces.  
> Example: India 98765-43210 → `919876543210`

---

## 📋 Template Variables

When creating templates, use `{{variableName}}` syntax for dynamic values.

**Template body:**
```
Hello {{name}}, your order {{orderId}} is ready for pickup!
```

**When sending with variables** `{ "name": "John", "orderId": "ABC-123" }`:
```
Hello John, your order ABC-123 is ready for pickup!
```

Unknown variables are left as-is (e.g. `{{unknown}}`).

---

## 🔐 JWT Auth Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

All dashboard API routes require `Authorization: Bearer <token>` header.

---

## 📱 WhatsApp Session Persistence

Sessions are stored in `.wwebjs_auth/session-<userId>/` using LocalAuth.  
After the first QR scan, reconnection is **automatic** on server restart.

---

## ⚠️ Notes

- WhatsApp scanning **requires a real phone** with WhatsApp installed.
- This platform is intended for **single-user messaging** (no bulk/spam features).
- Keep your `.env` and API keys **private**.
