# Quick Start Guide
## Digital Dreems Loan Management CRM

---

## 🚀 Getting Started

### 1. Application Overview

The Digital Dreems CRM now features:
- ✨ **Modern Sidebar Navigation** - Easy access to all features
- 📱 **WhatsApp Integration** - Send messages and manage contacts
- 💰 **Loan Management** - Complete loan lifecycle tracking
- 👥 **Customer Management** - Comprehensive CRM features
- 📊 **Analytics Dashboard** - Real-time business insights

---

## 📱 WhatsApp Integration Setup

### Why You See the Error

When you first access the WhatsApp features, you'll see an error message:

```
❌ WhatsApp Service Not Running
Cannot connect to WhatsApp service at http://localhost:3001
```

**This is normal!** The WhatsApp service needs to be started separately.

### How to Fix It

#### Option 1: Using Startup Scripts (Recommended)

**For Linux/macOS:**
```bash
chmod +x start-whatsapp.sh
./start-whatsapp.sh
```

**For Windows:**
```cmd
start-whatsapp.bat
```

#### Option 2: Manual Start

```bash
# Navigate to whatsapp service directory
cd whatsapp-service

# Install dependencies (first time only)
npm install

# Start the service
npm run dev
```

The service will start on `http://localhost:3001`

### Verify It's Working

1. Open your browser to: `http://localhost:3001/api/whatsapp/status`
2. You should see a JSON response
3. Go back to the CRM and click "Retry Connection"
4. You should now see the QR code or connection status

---

## 🎯 Navigation Guide

### Sidebar Menu

The new sidebar provides quick access to all features:

| Icon | Menu Item | Description |
|------|-----------|-------------|
| 📊 | **Dashboard** | Overview and analytics |
| 👥 | **Customers** | Manage customer database |
| 📦 | **Products** | Loan products/devices |
| 📄 | **Loans** | Loan applications and tracking |
| 💰 | **Collections** | EMI collection and payments |
| ⚙️ | **Users** | User management and roles |
| 📱 | **WhatsApp QR** | Connect WhatsApp account |
| 💬 | **Send Messages** | Send WhatsApp messages |
| 📝 | **Message Logs** | View message history |
| ⚙️ | **Auto-Reply** | Configure auto-responses |
| 📇 | **Contacts** | Manage WhatsApp contacts |

### Desktop Features

- **Collapse Sidebar**: Click the "◀ Collapse" button at the bottom
- **Hover Effects**: Hover over menu items for visual feedback
- **Active Highlighting**: Current page is highlighted in primary color

### Mobile Features

- **Hamburger Menu**: Tap the menu icon (top-left)
- **Overlay Navigation**: Sidebar slides in from left
- **Auto-Close**: Sidebar closes when you select a page

---

## 💡 Common Tasks

### 1. Connecting WhatsApp

1. Start the WhatsApp service (see above)
2. Navigate to **WhatsApp QR** in the sidebar
3. Scan the QR code with your phone
4. Wait for "Connected" status

### 2. Sending a Message

1. Navigate to **Send Messages**
2. Choose tab: Single, Media, or Bulk
3. Enter phone number (with country code)
4. Type your message
5. Click "Send Message"

### 3. Adding a Customer

1. Navigate to **Customers**
2. Click "Add Customer" button
3. Fill in customer details
4. Upload KYC documents
5. Click "Save"

### 4. Creating a Loan

1. Navigate to **Loans**
2. Click "Create Loan" button
3. Select customer and product
4. Enter loan details
5. System calculates EMI automatically
6. Click "Create Loan"

### 5. Collecting EMI

1. Navigate to **Collections**
2. Find the loan
3. Click "Collect EMI"
4. Enter payment details
5. Print receipt

---

## 🎨 UI Features

### Animations

The interface includes smooth animations:
- Page transitions (fade-in)
- Button hover effects (scale + shadow)
- Sidebar collapse/expand
- Loading states with spinners
- Success/error notifications

### Responsive Design

- **Desktop**: Full sidebar with all features
- **Tablet**: Collapsible sidebar
- **Mobile**: Overlay sidebar with backdrop

### Dark Mode

- Toggle in user profile section (coming soon)
- Automatic system preference detection

---

## 🔧 Troubleshooting

### WhatsApp Service Won't Start

**Problem:** Service fails to start

**Solutions:**
1. Check if Node.js 18+ is installed: `node --version`
2. Verify port 3001 is available
3. Check for error messages in terminal
4. Try: `npm install` in whatsapp-service folder

### QR Code Not Showing

**Problem:** QR code doesn't appear

**Solutions:**
1. Verify service is running on port 3001
2. Click "Retry Connection" button
3. Check browser console for errors
4. Refresh the page

### Sidebar Not Visible

**Problem:** Sidebar doesn't show after login

**Solutions:**
1. Verify you're logged in
2. Check you're not on login page
3. Clear browser cache
4. Try different browser

### Messages Not Sending

**Problem:** WhatsApp messages fail to send

**Solutions:**
1. Verify WhatsApp is connected (green status)
2. Check phone number format (with country code)
3. Ensure WhatsApp service is running
4. Check message logs for errors

---

## 📊 System Requirements

### Frontend (CRM Application)

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Minimum screen resolution: 1024x768
- Internet connection

### Backend (WhatsApp Service)

- Node.js 18 or higher
- npm or pnpm package manager
- Port 3001 available
- Stable internet connection

### WhatsApp Requirements

- WhatsApp account
- Smartphone with WhatsApp installed
- Camera to scan QR code
- Active internet connection

---

## 🎓 Best Practices

### WhatsApp Usage

1. **Rate Limiting**: Don't send too many messages at once
2. **Bulk Messages**: Use the queue system for bulk sending
3. **Templates**: Create templates for common messages
4. **Stay Connected**: Keep the service running continuously

### Data Management

1. **Regular Backups**: Export data regularly
2. **KYC Verification**: Verify all customer documents
3. **Loan Tracking**: Update loan status promptly
4. **EMI Collection**: Record payments immediately

### Security

1. **Strong Passwords**: Use secure passwords
2. **Role-Based Access**: Assign appropriate user roles
3. **Document Security**: Protect sensitive documents
4. **Regular Updates**: Keep system updated

---

## 📞 Support

### Getting Help

If you encounter issues:

1. **Check Documentation**: Review this guide and other docs
2. **Check Logs**: Look at browser console and service logs
3. **Restart Services**: Try restarting the WhatsApp service
4. **Contact Support**: Reach out to Vais Engineering

### Useful Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# View WhatsApp service logs
cd whatsapp-service
npm run dev

# Check if port 3001 is in use (Linux/macOS)
lsof -i :3001

# Check if port 3001 is in use (Windows)
netstat -ano | findstr :3001
```

---

## 🎉 You're Ready!

Your Digital Dreems CRM is now set up with:

✅ Modern sidebar navigation
✅ WhatsApp integration (once service is started)
✅ Complete loan management
✅ Customer relationship management
✅ Analytics and reporting

**Next Steps:**

1. Start the WhatsApp service
2. Connect your WhatsApp account
3. Add your first customer
4. Create your first loan
5. Start managing your business!

---

**Designed & Developed by:** Vais Engineering Pvt Ltd  
**Copyright:** © 2025 All Rights Reserved

**Need Help?** Contact support@vaisengineering.com
