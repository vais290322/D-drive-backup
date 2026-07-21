# Digital Dreems Loan Management CRM System - User Guide

## System Overview

Digital Dreems is a comprehensive loan management CRM system designed for managing customer information, loan products, loan lifecycle, EMI collections, KYC verification, and business analytics.

**Designed & Developed By:** Vais Engineering Pvt Ltd

## Getting Started

### First Time Setup

1. **Register Your Account**
   - Visit the login page
   - Click "Sign in with Google"
   - The first user to register will automatically become the Super Admin

2. **Access the Dashboard**
   - After successful login, you'll be redirected to the main dashboard
   - The dashboard displays key metrics and quick actions

## User Roles & Permissions

The system supports six different user roles with specific permissions:

### 1. Super Admin
- Full access to all system features
- Can manage all users and assign roles
- Can perform all CRUD operations on all modules

### 2. Admin
- Full access to customers, products, loans, and collections
- Can manage most system features
- Cannot modify other admin roles

### 3. Loan Manager
- Can create and manage loans
- Can collect EMI payments
- Can apply penalties
- Can view all customers and products

### 4. Collection Agent
- Can collect EMI payments
- Can view loan details
- Can view customer information
- Cannot create or modify loans

### 5. Data Entry Staff
- Can add and edit customers
- Can add and edit products
- Cannot manage loans or collections

### 6. KYC Verifier
- Can verify customer KYC documents
- Can update KYC status
- Can view customer information

## Core Modules

### 1. Dashboard

The dashboard provides an overview of your loan management system:

- **Total Customers**: Number of registered customers
- **Active Loans**: Currently active loan accounts
- **Completed Loans**: Successfully closed loans
- **Delayed EMIs**: Overdue payment count
- **Today's Collection**: Total amount collected today
- **Total Outstanding**: Pending payment amount
- **Total Disbursed**: Total loan amount disbursed

**Quick Actions:**
- Add New Customer
- Create New Loan
- Collect EMI

### 2. Customer Management

#### Adding a New Customer

1. Navigate to **Customers** → Click **Add Customer**
2. Fill in the required information across four tabs:

**Basic Info Tab:**
- Full Name (Required)
- Father's Name, Mother's Name, Spouse Name
- Date of Birth, Gender, Marital Status
- Primary Mobile (Required)
- Secondary Mobile, Email
- Nationality

**Address Tab:**
- Permanent Address
- Current Address
- City, District, State
- PIN Code

**KYC Details Tab:**
- Aadhaar Number
- PAN Number
- Voter ID
- Driving License Number

**Bank Details Tab:**
- Bank Name
- Account Holder Name
- Account Number
- IFSC Code
- Branch Name

3. Click **Save Customer**

#### Managing Customers

- **Search**: Use the search bar to find customers by name, mobile, or customer code
- **View**: Click the eye icon to view customer details
- **Edit**: Click the edit icon to modify customer information
- **KYC Verification**: Admins and KYC Verifiers can verify customer documents

### 3. Product Management

Products represent the items/devices that can be financed through loans.

#### Adding a New Product

1. Navigate to **Products** → Click **Add Product**
2. Fill in the product information:
   - Category (Required): Mobile, Laptop, TV, Vehicle, Others
   - Brand, Model
   - Serial Number
   - IMEI 1, IMEI 2 (for mobile devices)
   - Color
   - RAM/ROM Details
   - Purchase Price

3. Click **Save Product**

#### Product Status

- **Available**: Ready to be assigned to a loan
- **Assigned**: Currently linked to an active loan
- **Sold**: Product has been sold

### 4. Loan Management

#### Creating a New Loan

1. Navigate to **Loans** → Click **Create Loan**
2. Complete the three-tab form:

**Loan Details Tab:**
- Select Customer (Required)
- Select Product (Optional)
- Loan Type: Daily, Weekly, or Monthly
- Principal Amount (Required)
- Processing Fee
- Insurance Fee
- Start Date (Required)
- First EMI Date (Required)

**EMI Calculation Tab:**
- Tenure in Months (Required)
- Interest Type: Flat or Reducing
- Interest Rate (%) (Required)

The system automatically calculates:
- Total Interest
- Total Payable Amount
- EMI/Installment Amount

**Guarantor Tab (Optional):**
- Guarantor Name
- Guarantor Mobile
- Guarantor Relation
- Guarantor Address

3. Click **Create Loan**

#### EMI Calculation Methods

**Flat Interest:**
- Interest is calculated on the principal amount for the entire tenure
- Formula: Total Interest = (Principal × Rate × Tenure) / (12 × 100)
- EMI = (Principal + Total Interest + Fees) / Tenure

**Reducing Balance:**
- Interest is calculated on the outstanding principal
- Uses standard EMI formula with monthly compounding
- EMI = [P × r × (1+r)^n] / [(1+r)^n-1]

#### Loan Status

- **Active**: Loan is currently being repaid
- **Completed**: All payments received, loan closed
- **Defaulted**: Payment defaults occurred
- **Closed**: Loan account closed

### 5. User Management

**Access:** Super Admin only

1. Navigate to **Users**
2. View all registered users
3. Click **Edit** icon to change user role
4. Select new role from dropdown
5. Click **Update Role**

## Key Features

### Auto-Generated Codes

The system automatically generates unique codes:
- **Customer Code**: CUST000001, CUST000002, etc.
- **Product Code**: PROD000001, PROD000002, etc.
- **Loan ID**: LOAN000001, LOAN000002, etc.

### Search Functionality

- **Customers**: Search by name, mobile number, or customer code
- **Products**: Search by brand, model, product code, or IMEI
- **Loans**: Filter by status (Active, Completed, Defaulted, Closed)

### Responsive Design

The system is optimized for:
- Desktop computers (primary)
- Laptops
- Tablets
- Mobile devices

### Data Security

- Role-based access control (RBAC)
- Secure authentication via Google SSO
- Row-level security on all database tables
- Encrypted data transmission

## Best Practices

### For Admins

1. **User Management**
   - Assign appropriate roles based on job responsibilities
   - Regularly review user access levels
   - Remove access for inactive users

2. **Data Quality**
   - Ensure complete customer information before loan creation
   - Verify KYC documents promptly
   - Keep product inventory updated

### For Loan Managers

1. **Loan Creation**
   - Verify customer KYC status before creating loans
   - Double-check EMI calculations
   - Document guarantor information when available
   - Ensure first EMI date is realistic

2. **Loan Monitoring**
   - Regularly review active loans
   - Track delayed EMIs
   - Apply penalties as per policy

### For Collection Agents

1. **EMI Collection**
   - Record payments immediately
   - Verify payment mode and reference
   - Provide receipts to customers
   - Note any partial payments

### For Data Entry Staff

1. **Customer Registration**
   - Collect complete information
   - Verify mobile numbers
   - Upload clear document copies
   - Update addresses accurately

2. **Product Entry**
   - Record accurate serial numbers
   - Note IMEI for mobile devices
   - Update product status promptly

## System Specifications

### Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Google SSO
- **Storage**: Supabase Storage for documents

### Color Scheme

- **Primary Color**: Deep Blue (#1e3a8a) - Trust and professionalism
- **Accent Color**: Green (#10b981) - Positive actions and success
- **Background**: White with subtle secondary tones

### Performance

- Fast loading times
- Responsive design for all screen sizes
- Optimized database queries
- Secure data handling

## Support & Maintenance

### Regular Backups

The system automatically backs up data. Admins should:
- Monitor backup status
- Test restore procedures periodically
- Keep backup retention policies updated

### System Updates

- Updates are deployed automatically
- No downtime during updates
- New features announced via dashboard

### Getting Help

For technical support or feature requests:
- Contact: Vais Engineering Pvt Ltd
- System Version: 1.0.0

## Important Notes

1. **First User**: The first registered user automatically becomes Super Admin
2. **KYC Verification**: Required before loan disbursement (recommended)
3. **Product Assignment**: Products are automatically marked as "Assigned" when linked to a loan
4. **EMI Calculations**: Always verify calculated values before loan creation
5. **Data Accuracy**: Ensure all customer and loan information is accurate

## Glossary

- **CRM**: Customer Relationship Management
- **KYC**: Know Your Customer
- **EMI**: Equated Monthly Installment
- **IMEI**: International Mobile Equipment Identity
- **PAN**: Permanent Account Number
- **IFSC**: Indian Financial System Code
- **RLS**: Row Level Security
- **SSO**: Single Sign-On

---

**Digital Dreems Loan Management CRM**  
Version 1.0.0  
Designed & Developed by Vais Engineering Pvt Ltd
