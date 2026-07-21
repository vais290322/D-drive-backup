# Banking Module - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │   Customers  │  │   Deposit    │      │
│  │   (Stats &   │  │   (List &    │  │   (Process   │      │
│  │   Actions)   │  │   Details)   │  │   Deposits)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Withdraw   │  │   Statement  │  │   Reports    │      │
│  │   (Process   │  │   (View      │  │   (Analytics │      │
│  │   Withdrawals)│  │   History)   │  │   & Summary) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (TypeScript)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Customer API          Account API         Transaction API   │
│  ├─ getBankCustomers   ├─ getBankAccounts  ├─ processDeposit│
│  ├─ createCustomer     ├─ createAccount    ├─ processWithdraw│
│  ├─ updateCustomer     ├─ updateAccount    ├─ getTransactions│
│  └─ deleteCustomer     └─ deleteAccount    └─ getStatement  │
│                                                               │
│  Report API            Image API                             │
│  ├─ getDashboardStats  ├─ uploadPhoto                        │
│  ├─ getDailySummary    └─ deletePhoto                        │
│  └─ getBalanceSummary                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (Supabase)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ bank_customers   │  │ bank_accounts    │                 │
│  ├──────────────────┤  ├──────────────────┤                 │
│  │ • id             │  │ • id             │                 │
│  │ • full_name      │  │ • customer_id ───┼─────┐           │
│  │ • phone          │  │ • account_number │     │           │
│  │ • email          │  │ • account_type   │     │           │
│  │ • address        │  │ • balance        │     │           │
│  │ • photo_url      │  │ • status         │     │           │
│  │ • created_at     │  │ • opening_date   │     │           │
│  │ • updated_at     │  │ • created_at     │     │           │
│  └──────────────────┘  └──────────────────┘     │           │
│           ↑                      ↑               │           │
│           │                      │               │           │
│           │                      │               │           │
│  ┌────────┴──────────────────────┴───────────────┘           │
│  │                                                            │
│  │  ┌──────────────────┐                                     │
│  │  │ bank_transactions│                                     │
│  │  ├──────────────────┤                                     │
│  │  │ • id             │                                     │
│  └──┼─• account_id     │                                     │
│     │ • transaction_type│                                    │
│     │ • amount         │                                     │
│     │ • balance_after  │                                     │
│     │ • reference_note │                                     │
│     │ • transaction_date│                                    │
│     │ • created_by     │                                     │
│     │ • created_at     │                                     │
│     └──────────────────┘                                     │
│                                                               │
│  RPC Functions:                                              │
│  ├─ process_deposit(account_id, amount, note, user)         │
│  └─ process_withdrawal(account_id, amount, note, user)      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   STORAGE LAYER (Supabase)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Bucket: app-7mzgg63hukg1_banking_images                     │
│  ├─ customers/                                               │
│  │  ├─ [timestamp]_[random].jpg                             │
│  │  ├─ [timestamp]_[random].png                             │
│  │  └─ [timestamp]_[random].webp                            │
│  │                                                            │
│  Settings:                                                   │
│  ├─ Max Size: 1 MB                                          │
│  ├─ Formats: JPEG, PNG, WEBP, GIF                           │
│  └─ Access: Public read, authenticated write                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagrams

### Deposit Transaction Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Select Account
     ↓
┌─────────────────┐
│  Deposit Form   │
└────┬────────────┘
     │ 2. Enter Amount & Note
     ↓
┌─────────────────┐
│  Validation     │
│  • Amount > 0   │
│  • Account exists│
└────┬────────────┘
     │ 3. Show Confirmation
     ↓
┌─────────────────┐
│ Confirm Dialog  │
│ • Review details│
│ • Show preview  │
└────┬────────────┘
     │ 4. User confirms
     ↓
┌─────────────────┐
│ API Call        │
│ processDeposit()│
└────┬────────────┘
     │ 5. Execute RPC
     ↓
┌─────────────────┐
│ Database RPC    │
│ • Lock account  │
│ • Add to balance│
│ • Insert txn    │
│ • Return result │
└────┬────────────┘
     │ 6. Success response
     ↓
┌─────────────────┐
│ Update UI       │
│ • Show toast    │
│ • Refresh data  │
│ • Reset form    │
└─────────────────┘
```

### Withdrawal Transaction Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Select Account
     ↓
┌─────────────────┐
│ Withdraw Form   │
└────┬────────────┘
     │ 2. Enter Amount & Note
     ↓
┌─────────────────┐
│  Validation     │
│  • Amount > 0   │
│  • Balance check│
│  • Account active│
└────┬────────────┘
     │ 3. Show Confirmation
     ↓
┌─────────────────┐
│ Confirm Dialog  │
│ • Review details│
│ • Show new bal  │
└────┬────────────┘
     │ 4. User confirms
     ↓
┌─────────────────┐
│ API Call        │
│processWithdrawal│
└────┬────────────┘
     │ 5. Execute RPC
     ↓
┌─────────────────┐
│ Database RPC    │
│ • Lock account  │
│ • Check balance │
│ • Deduct amount │
│ • Insert txn    │
│ • Return result │
└────┬────────────┘
     │ 6. Success response
     ↓
┌─────────────────┐
│ Update UI       │
│ • Show toast    │
│ • Refresh data  │
│ • Reset form    │
└─────────────────┘
```

### Customer Creation Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Click Add Customer
     ↓
┌─────────────────┐
│ Customer Form   │
└────┬────────────┘
     │ 2. Fill Details
     ↓
┌─────────────────┐
│ Photo Upload    │
│ (Optional)      │
└────┬────────────┘
     │ 3. Select Image
     ↓
┌─────────────────┐
│ Image Validation│
│ • Size < 1 MB   │
│ • Valid format  │
│ • Valid filename│
└────┬────────────┘
     │ 4. Upload to Storage
     ↓
┌─────────────────┐
│ Supabase Storage│
│ • Generate URL  │
│ • Return path   │
└────┬────────────┘
     │ 5. Get photo URL
     ↓
┌─────────────────┐
│ Create Customer │
│ • Save details  │
│ • Save photo URL│
└────┬────────────┘
     │ 6. Customer created
     ↓
┌─────────────────┐
│ Create Account  │
│ • Manual number │
│ • Opening balance│
│ • Link customer │
└────┬────────────┘
     │ 7. Account created
     ↓
┌─────────────────┐
│ Success         │
│ • Show toast    │
│ • Navigate list │
└─────────────────┘
```

## 🔄 Component Relationships

```
BankingDashboard
├── Statistics Cards (8)
│   ├── Total Customers
│   ├── Total Accounts
│   ├── Active Accounts
│   ├── Total Balance
│   ├── Deposits Today
│   ├── Withdrawals Today
│   ├── Transactions Today
│   └── Net Change Today
├── Quick Actions
│   ├── Add Customer → CustomerForm
│   ├── Make Deposit → Deposit
│   ├── Make Withdrawal → Withdraw
│   ├── View Statement → Statement
│   └── View Reports → Reports
└── Customer Management Link → Customers

Customers
├── Search Bar
├── Customer Table
│   ├── Customer Row
│   │   ├── Photo/Avatar
│   │   ├── Name (Link to Details)
│   │   ├── Contact Info
│   │   ├── Accounts List
│   │   ├── Total Balance
│   │   └── Actions
│   │       ├── View → CustomerDetails
│   │       ├── Edit → CustomerForm
│   │       └── Delete → Confirmation Dialog
└── Add Customer Button → CustomerForm

CustomerForm
├── Personal Information Section
│   ├── Full Name Input
│   ├── Phone Input
│   ├── Email Input
│   └── Address Textarea
├── Photo Upload Section
│   ├── Photo Preview
│   ├── Upload Button
│   ├── Progress Bar
│   └── Remove Button
├── Account Information Section (New Only)
│   ├── Account Number Input
│   ├── Account Type Select
│   └── Opening Balance Input
└── Action Buttons
    ├── Submit Button
    └── Cancel Button

CustomerDetails
├── Personal Information Card
├── Photo Display
├── Accounts List
│   └── Account Card
│       ├── Account Number
│       ├── Balance
│       ├── Status Badge
│       └── Statement Link
├── Recent Transactions Table
└── Quick Actions
    ├── Edit Customer
    ├── Make Deposit
    ├── Make Withdrawal
    └── View Statement

Deposit
├── Account Selection
│   ├── Search by Number
│   └── Select from List
├── Account Details Display
├── Deposit Form
│   ├── Amount Input
│   └── Reference Note Textarea
├── Confirmation Dialog
│   ├── Transaction Summary
│   ├── Balance Preview
│   └── Confirm/Cancel Buttons
└── Success Toast

Withdraw
├── Account Selection
│   ├── Search by Number
│   └── Select from List
├── Account Details Display
├── Withdrawal Form
│   ├── Amount Input
│   ├── Balance Warning (if insufficient)
│   └── Reference Note Textarea
├── Confirmation Dialog
│   ├── Transaction Summary
│   ├── Balance Preview
│   └── Confirm/Cancel Buttons
└── Success Toast

Statement
├── Account Selection
│   ├── Search by Number
│   └── Select from List
├── Account Information Card
│   ├── Customer Name
│   ├── Account Number
│   ├── Account Type
│   ├── Current Balance
│   └── Status Badge
├── Transaction History Table
│   └── Transaction Row
│       ├── Date
│       ├── Time
│       ├── Type Badge
│       ├── Amount
│       ├── Balance After
│       └── Reference Note
└── Print Button

Reports
├── Statistics Cards (4)
├── Tabs
│   ├── Daily Summary Tab
│   │   ├── Date Range Selector
│   │   └── Daily Summary Table
│   ├── Customer Balances Tab
│   │   └── Customer Balance Table
│   └── Cash Flow Tab
│       ├── Inflow Card
│       ├── Outflow Card
│       └── Net Flow Card
└── Print Button
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Client-Side Validation                            │
│  ├─ Form validation (required fields)                       │
│  ├─ Amount validation (positive numbers)                    │
│  ├─ Balance check (before withdrawal)                       │
│  ├─ File validation (size, type, filename)                  │
│  └─ Account number uniqueness check                         │
│                                                               │
│  Layer 2: Confirmation Dialogs                              │
│  ├─ Deposit confirmation                                    │
│  ├─ Withdrawal confirmation                                 │
│  ├─ Delete confirmation                                     │
│  └─ Transaction preview                                     │
│                                                               │
│  Layer 3: API Layer Validation                              │
│  ├─ Data type checking                                      │
│  ├─ Null/undefined handling                                 │
│  ├─ Error catching and logging                              │
│  └─ Response validation                                     │
│                                                               │
│  Layer 4: Database Constraints                              │
│  ├─ NOT NULL constraints                                    │
│  ├─ UNIQUE constraints (account_number)                     │
│  ├─ CHECK constraints (balance >= 0)                        │
│  ├─ Foreign key constraints                                 │
│  └─ Enum constraints (status, transaction_type)             │
│                                                               │
│  Layer 5: Atomic Transactions                               │
│  ├─ Row-level locking (FOR UPDATE)                          │
│  ├─ Transaction rollback on error                           │
│  ├─ Balance calculation in single transaction               │
│  └─ SECURITY DEFINER RPC functions                          │
│                                                               │
│  Layer 6: Audit Trail                                       │
│  ├─ Transaction timestamps                                  │
│  ├─ Created by tracking                                     │
│  ├─ Updated at timestamps                                   │
│  └─ Complete transaction history                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Responsive Design Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   RESPONSIVE BREAKPOINTS                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Mobile (< 768px)                                            │
│  ├─ Single column layouts                                   │
│  ├─ Stacked cards                                           │
│  ├─ Hamburger menu                                          │
│  ├─ Full-width buttons                                      │
│  └─ Scrollable tables                                       │
│                                                               │
│  Tablet (768px - 1279px)                                    │
│  ├─ 2-column grids                                          │
│  ├─ Side-by-side cards                                      │
│  ├─ Expanded navigation                                     │
│  └─ Responsive tables                                       │
│                                                               │
│  Desktop (≥ 1280px)                                         │
│  ├─ 3-4 column grids                                        │
│  ├─ Full sidebar navigation                                 │
│  ├─ Multi-panel layouts                                     │
│  └─ Full-width tables                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                  PERFORMANCE STRATEGIES                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Database Level                                              │
│  ├─ Indexes on frequently queried columns                   │
│  ├─ Efficient JOIN queries                                  │
│  ├─ Limit results (pagination ready)                        │
│  └─ Optimized RPC functions                                 │
│                                                               │
│  API Level                                                   │
│  ├─ Batch requests where possible                           │
│  ├─ Error handling without retries                          │
│  ├─ Efficient data transformations                          │
│  └─ Minimal API calls                                       │
│                                                               │
│  UI Level                                                    │
│  ├─ Loading states for better UX                            │
│  ├─ Skeleton screens                                        │
│  ├─ Lazy loading of images                                  │
│  ├─ Debounced search inputs                                 │
│  └─ Optimistic UI updates                                   │
│                                                               │
│  Caching Strategy                                            │
│  ├─ Supabase client-side caching                            │
│  ├─ React state management                                  │
│  ├─ Browser storage for preferences                         │
│  └─ Image caching via CDN                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Component State (useState)                                  │
│  ├─ Form data                                               │
│  ├─ Loading states                                          │
│  ├─ Dialog open/close                                       │
│  ├─ Search terms                                            │
│  └─ Filtered data                                           │
│                                                               │
│  Server State (API calls)                                    │
│  ├─ Customer data                                           │
│  ├─ Account data                                            │
│  ├─ Transaction data                                        │
│  ├─ Statistics                                              │
│  └─ Reports                                                 │
│                                                               │
│  Navigation State (React Router)                             │
│  ├─ Current route                                           │
│  ├─ Route parameters                                        │
│  └─ Navigation history                                      │
│                                                               │
│  UI State (Toast, Dialogs)                                  │
│  ├─ Toast notifications                                     │
│  ├─ Confirmation dialogs                                    │
│  ├─ Error messages                                          │
│  └─ Success messages                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Error Handling Flow

```
┌─────────────┐
│   Error     │
│  Occurs     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Catch     │
│   Error     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│    Log      │
│  to Console │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Extract    │
│  Message    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Show      │
│   Toast     │
│ (Destructive)│
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Reset     │
│   Loading   │
│   State     │
└─────────────┘
```

## 🎉 Success Flow

```
┌─────────────┐
│  Operation  │
│  Succeeds   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Update    │
│    Data     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Show      │
│   Toast     │
│  (Success)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Refresh   │
│    UI       │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Reset     │
│    Form     │
└─────────────┘
```

---

**Architecture Version**: 1.0.0
**Last Updated**: 2025-11-23
**Status**: Production Ready
