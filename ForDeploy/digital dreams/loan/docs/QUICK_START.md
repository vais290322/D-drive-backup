# Digital Dreems - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: First Login
1. Open the application
2. Click **"Sign in with Google"**
3. Select your Google account
4. **First user becomes Super Admin automatically**

### Step 2: Add Your First Customer
1. Click **"Customers"** in the navigation
2. Click **"Add Customer"** button
3. Fill in the required fields:
   - Full Name *
   - Primary Mobile *
   - Basic information
4. Click **"Save Customer"**

### Step 3: Add a Product (Optional)
1. Click **"Products"** in the navigation
2. Click **"Add Product"** button
3. Fill in:
   - Category * (Mobile, Laptop, TV, Vehicle, Others)
   - Brand, Model, Serial Number
4. Click **"Save Product"**

### Step 4: Create Your First Loan
1. Click **"Loans"** in the navigation
2. Click **"Create Loan"** button
3. Fill in the **Loan Details** tab:
   - Select Customer *
   - Select Product (optional)
   - Loan Type * (Daily/Weekly/Monthly)
   - Principal Amount *
   - Start Date *
   - First EMI Date *
4. Fill in the **EMI Calculation** tab:
   - Tenure (Months) *
   - Interest Type * (Flat/Reducing)
   - Interest Rate (%) *
   - **System automatically calculates EMI**
5. Fill in **Guarantor** tab (optional)
6. Click **"Create Loan"**

### Step 5: Collect EMI Payment
1. Go to **"Collections"** page
2. Find the loan in the active loans list
3. Click **"Collect"** button
4. Enter:
   - Amount (pre-filled with EMI amount)
   - Payment Mode (Cash/UPI/Bank Transfer)
   - Transaction Reference (optional)
5. Click **"Record Payment"**

## 📊 Dashboard Overview

The dashboard shows:
- **Total Customers**: All registered customers
- **Active Loans**: Currently running loans
- **Completed Loans**: Successfully closed loans
- **Delayed EMIs**: Overdue payments
- **Today's Collection**: Amount collected today
- **Total Outstanding**: Pending payments

## 🔑 Key Features Quick Access

### Customer Management
- **View All**: Customers page
- **Add New**: Click "Add Customer" button
- **Search**: Use search bar (name, mobile, code)
- **Edit**: Click edit icon on customer row
- **View Details**: Click eye icon on customer row
- **Verify KYC**: Open customer detail → Click "Verify KYC"

### Product Management
- **View All**: Products page
- **Add New**: Click "Add Product" button
- **Search**: Use search bar (brand, model, code)
- **Edit**: Click edit icon on product row

### Loan Management
- **View All**: Loans page
- **Create New**: Click "Create Loan" button
- **Filter**: Use status filter (Active/Completed/Defaulted/Closed)
- **View Details**: Click eye icon on loan row
- **Add Penalty**: Open loan detail → Click "Add Penalty"

### Collections
- **View Active Loans**: Collections page
- **Collect EMI**: Click "Collect" button on loan
- **View Payment History**: Open loan detail → Payment History tab

### User Management (Super Admin Only)
- **View Users**: Users page
- **Change Role**: Click edit icon → Select new role → Update

## 💡 Pro Tips

### EMI Calculation
- **Flat Interest**: Simple interest on principal for entire tenure
- **Reducing Balance**: Interest on outstanding principal (lower total interest)

### KYC Verification
- Verify customer KYC before disbursing loans
- Status options: Verified, Pending, Rejected
- Add remarks for verification notes

### Payment Collection
- Default amount is the EMI amount
- Can collect partial payments
- Always add transaction reference for UPI/Bank transfers

### Penalty Management
- Types: Late EMI, Cheque Bounce, ECS Return, Manual
- Penalties automatically add to total payable
- Add reason for manual penalties

## 🎯 Common Workflows

### Workflow 1: New Customer Loan
1. Add Customer → Fill details → Save
2. Verify KYC → Update status to "Verified"
3. Add Product (if applicable) → Save
4. Create Loan → Select customer & product → Calculate EMI → Save
5. Collect EMI → Record payments regularly

### Workflow 2: EMI Collection
1. Go to Collections page
2. Find customer loan
3. Click "Collect" button
4. Verify amount
5. Select payment mode
6. Add transaction reference
7. Record payment

### Workflow 3: Loan Closure
1. Open loan detail page
2. Check ledger breakup
3. Ensure all EMIs paid
4. Verify no pending penalties
5. Loan status automatically updates to "Completed"

## 🔐 Role-Based Access

### Super Admin
- Full access to all features
- Can manage user roles
- Can perform all operations

### Admin
- Manage customers, products, loans
- Collect payments
- Apply penalties
- Cannot modify other admin roles

### Loan Manager
- Create and manage loans
- Collect EMI payments
- Apply penalties
- View customers and products

### Collection Agent
- Collect EMI payments only
- View loan details
- View customer information
- Cannot create or modify loans

### Data Entry Staff
- Add and edit customers
- Add and edit products
- Cannot manage loans or collections

### KYC Verifier
- Verify customer KYC documents
- Update KYC status
- View customer information
- Cannot manage loans

## 📱 Mobile Access

The system is fully responsive:
- Access from any device
- Touch-friendly interface
- Mobile menu in header
- Optimized for small screens

## ⚠️ Important Notes

1. **First User**: Automatically becomes Super Admin
2. **Customer Code**: Auto-generated (CUST000001, CUST000002, etc.)
3. **Product Code**: Auto-generated (PROD000001, PROD000002, etc.)
4. **Loan ID**: Auto-generated (LOAN000001, LOAN000002, etc.)
5. **EMI Calculation**: Always verify calculated values before creating loan
6. **Payment Recording**: Record payments immediately after collection
7. **KYC Verification**: Recommended before loan disbursement

## 🆘 Troubleshooting

### Cannot Login
- Ensure Google account is active
- Check internet connection
- Clear browser cache

### Cannot Create Loan
- Verify customer exists
- Check all required fields are filled
- Ensure dates are valid

### Payment Not Recording
- Check loan is active
- Verify amount is valid
- Ensure payment mode is selected

### Cannot Change User Role
- Only Super Admin can change roles
- User must be logged in at least once
- Refresh page after role change

## 📞 Support

For technical support or questions:
- Contact: Vais Engineering Pvt Ltd
- Check: SYSTEM_GUIDE.md for detailed documentation

---

**Digital Dreems Loan Management CRM**  
Quick Start Guide v1.0.0
