# Mit Electro World Banking Module Requirements Document

## 1. Module Overview

### 1.1 Module Name
Banking Module - Comprehensive Account & Transaction Management System

### 1.2 Module Description
A complete banking operations module integrated into the Mit Electro World CRM system, providing customer account management, deposit/withdrawal transactions, statement generation, and comprehensive reporting capabilities. This module operates independently while maintaining integration with existing loan and ledger systems.

### 1.3 Module Position
- **Navigation Location**: Top-level section in main navigation menu labeled 'Banking'
- **Access Level**: Available to authorized banking staff roles
- **Integration**: Standalone module with optional links to existing customer records

---

## 2. Core Functional Areas

### 2.1 Customer Management

#### 2.1.1 Add New Customer

**Form Fields**:
- **Full Name** (Required)
  - Text input field
  - Maximum 100 characters
  - Validation: Cannot be empty
\n- **Contact Information**:\n  - **Phone Number** (Required)
    - Format: +91XXXXXXXXXX or 10-digit mobile\n    - Validation: Valid phone format
    - Unique constraint: No duplicate phone numbers
  - **Email Address** (Optional)
    - Format validation: Valid email format
    - Example: customer@example.com
  - **Address** (Required)
    - Multi-line text area
    - Include: Street, City, State, PIN Code\n    - Maximum 500 characters

- **Customer Photograph** (Required)
  - **Upload Functionality**:\n    - File upload button with drag-and-drop support
    - Accepted formats: JPG, PNG, JPEG\n    - Maximum file size: 2MB
    - Image preview before saving
    - Crop/resize option (recommended size: 300x300 pixels)
    - Store image path in database
  - **Display**:
    - Thumbnail preview in customer list
    - Full-size image in customer detail page
    - Option to update/replace photo

- **Account Number** (Required, Manual Entry)
  - **Manual Assignment by Administrator**:\n    - Text input field for custom account number
    - Administrator manually enters unique account number
    - Format: Alphanumeric (e.g., ACC001, BA-2025-001,1234567890)
    - Validation:\n      - Cannot be empty
      - Must be unique (check against existing accounts)
      - Display clear error if duplicate account number entered
      - Minimum 5 characters, maximum 20 characters
  - **No Auto-Generation**: System does not auto-generate account numbers
  - **Uniqueness Check**: Real-time validation on input

**Form Actions**:
- **Save Customer Button**: Save all customer details with validation
- **Reset Button**: Clear all form fields
- **Cancel Button**: Return to customer list without saving

**Validation Rules**:
- All required fields must be filled
- Phone number must be unique\n- Account number must be unique
- Photo must be uploaded
- Display field-specific error messages

**Success Actions**:
- Display success message:'Customer added successfully. Account Number: [AccountNumber]'
- Redirect to customer detail page
- Send welcome notification to customer (optional)

#### 2.1.2 Customer Details View

**Customer Detail Page Components**:
\n**Customer Information Card**:
- **Customer Photo**: Display uploaded photo (300x300 pixels)
- **Account Number**: Prominently displayed at top
- **Full Name**: Large, bold text
- **Contact Information**:
  - Phone Number (with click-to-call icon)
  - Email Address (with click-to-email icon)\n  - Full Address\n- **Account Status**: Active / Inactive / Closed
- **Account Opening Date**: Date customer was added
- **Current Balance**: Display in large, color-coded text
  - Positive balance: Green
  - Zero balance: Gray
  - Negative balance (overdraft): Red
\n**Quick Actions Section**:
- **Deposit Button**: Opens deposit transaction form
- **Withdraw Button**: Opens withdrawal transaction form
- **View Statement Button**: Opens account statement page
- **Edit Customer Button**: Opens edit form for customer details
- **Deactivate/Activate Account Button**: Toggle account status
- **Print Customer Info Button**: Generate printable customer profile

**Recent Transactions Summary**:
- Display last 10 transactions in table format
- Columns: Date, Time, Type (Deposit/Withdraw), Amount, Balance, Reference
- Link to full statement at bottom

**Account Summary Statistics**:
- Total Deposits (All Time)\n- Total Withdrawals (All Time)
- Number of Transactions
- Average Transaction Amount
- Last Transaction Date
\n**Customer List Page**:
\n**List View Table**:
| Photo | Account Number | Customer Name | Phone | Current Balance | Status | Actions |
\n**Table Features**:
- Display customer photo thumbnail (50x50 pixels)
- Sortable columns (Account Number, Name, Balance)
- Search functionality: Search by account number, name, or phone
- Filter options:\n  - All Customers
  - Active Accounts
  - Inactive Accounts
  - Positive Balance
  - Zero Balance
  - Negative Balance
- Pagination (50 customers per page)
- Export customer list as CSV/Excel

**Actions Column**:
- View Details icon\n- Quick Deposit icon
- Quick Withdraw icon\n- View Statement icon
- Edit icon
\n### 2.2 Account Operations

#### 2.2.1 Deposit Transaction\n
**Deposit Form Interface**:

**Customer Selection**:
- **Search by Account Number or Customer Name**:\n  - Dropdown with search functionality
  - Type-ahead search (auto-complete)
  - Display: Account Number - Customer Name - Current Balance
  - Show customer photo thumbnail in dropdown
- **Selected Customer Display**:
  - Show customer photo, name, account number, current balance
  - Confirm correct customer before proceeding
\n**Transaction Details**:
- **Deposit Amount** (Required):
  - Numeric input field
  - Validation: Must be positive number, minimum₹1
  - Display amount in words below input (e.g., 'Five Thousand Rupees Only')
  - Format: ₹ X,XXX.XX\n\n- **Transaction Date** (Required):
  - Date picker\n  - Default: Current date
  - Cannot select future date
\n- **Transaction Time** (Required):
  - Time picker
  - Default: Current time
  - Format: HH:MM AM/PM

- **Reference Note** (Optional):
  - Text area for additional information
  - Maximum 500 characters
  - Example: 'Cash deposit', 'Cheque No. 123456', 'Online transfer from SBI'\n
- **Payment Mode** (Required):
  - Dropdown selection:\n    - Cash
    - Cheque
    - Online Transfer
    - UPI
    - NEFT/RTGS
    - Demand Draft
  - If Cheque selected, show additional fields:
    - Cheque Number
    - Bank Name
    - Cheque Date
\n- **Deposited By** (Optional):
  - Text input for person making deposit (if different from account holder)
  - Example: 'Self', 'John Doe (Son)', 'ABC Company'

**Transaction Summary Preview**:
- Current Balance: ₹ X,XXX.XX
- Deposit Amount: + ₹ X,XXX.XX
- New Balance: ₹ X,XXX.XX (calculated in real-time)
\n**Form Actions**:
- **Confirm Deposit Button**:
  - Display confirmation dialog: 'Confirm deposit of ₹[Amount] to Account [AccountNumber]?'
  - Require confirmation before processing
- **Cancel Button**: Return without saving

**Transaction Processing**:
1. Validate all required fields
2. Calculate new balance: Current Balance + Deposit Amount
3. Create transaction record in database
4. Update customer account balance
5. Generate transaction receipt
6. Log transaction with timestamp and user info

**Success Actions**:
- Display success message: 'Deposit successful. New Balance: ₹[NewBalance]'
- Auto-generate and display transaction receipt
- Option to print receipt\n- **Option to share receipt via WhatsApp**: Generate wa.me link with pre-filled message containing receipt details
- Option to send receipt via SMS/Email
- Redirect to customer detail page or process another transaction

#### 2.2.2 Withdraw Transaction

**Withdrawal Form Interface**:

**Customer Selection**:
- Same as Deposit (search by account number or name)
- Display current balance prominently
- **Balance Check**: Show warning if withdrawal amount exceeds current balance

**Transaction Details**:
- **Withdrawal Amount** (Required):
  - Numeric input field
  - Validation:\n    - Must be positive number, minimum ₹1
    - Cannot exceed current balance (unless overdraft allowed)
    - Display error if insufficient balance
  - Display amount in words\n  - Format: ₹ X,XXX.XX
\n- **Transaction Date** (Required):
  - Date picker, default: Current date
  - Cannot select future date

- **Transaction Time** (Required):
  - Time picker, default: Current time
\n- **Reference Note** (Optional):
  - Text area, maximum 500 characters
  - Example: 'Cash withdrawal', 'Payment to vendor', 'Personal use'

- **Payment Mode** (Required):
  - Dropdown selection:
    - Cash
    - Cheque Issued
    - Online Transfer
    - UPI
    - NEFT/RTGS\n  - If Cheque Issued selected, show additional fields:
    - Cheque Number
    - Payee Name
    - Cheque Date

- **Withdrawn By** (Optional):
  - Text input for person making withdrawal\n  - Example: 'Self', 'Authorized signatory', 'Power of attorney holder'

**Overdraft Handling** (Optional Feature):
- **Allow Overdraft**: Checkbox (admin only)
- **Overdraft Limit**: Display if configured
- **Overdraft Warning**: Show if withdrawal creates negative balance
\n**Transaction Summary Preview**:
- Current Balance: ₹ X,XXX.XX
- Withdrawal Amount: - ₹ X,XXX.XX
- New Balance: ₹ X,XXX.XX (calculated in real-time)
- **Warning**: Display in red if new balance is negative

**Form Actions**:
- **Confirm Withdrawal Button**:
  - Display confirmation dialog: 'Confirm withdrawal of ₹[Amount] from Account [AccountNumber]? New Balance will be ₹[NewBalance]'
  - Require additional confirmation if balance becomes negative
- **Cancel Button**: Return without saving

**Transaction Processing**:
1. Validate all required fields
2. Check sufficient balance (or overdraft limit)
3. Calculate new balance: Current Balance - Withdrawal Amount
4. Create transaction record in database\n5. Update customer account balance\n6. Generate transaction receipt
7. Log transaction with timestamp and user info

**Success Actions**:
- Display success message: 'Withdrawal successful. New Balance: ₹[NewBalance]'
- Auto-generate and display transaction receipt
- Option to print receipt
- **Option to share receipt via WhatsApp**: Generate wa.me link with pre-filled message containing receipt details
- Option to send receipt via SMS/Email
- Redirect to customer detail page or process another transaction

### 2.3 Account Statement\n
#### 2.3.1 Statement Generation

**Statement Page Interface**:

**Customer Selection**:
- Search by account number or customer name
- Display customer photo, name, account number, current balance\n\n**Statement Filters**:
- **Date Range**:
  - **From Date** (date picker)
  - **To Date** (date picker)
  - **Quick Select Buttons** (horizontal button group):
    - Today
    - Last 7 Days
    - Last 30 Days
    - This Month
    - Last Month\n    - This Year
    - All Time
  - **Custom Range**: When user manually selects From Date and To Date
- **Transaction Type**:
  - All Transactions
  - Deposits Only
  - Withdrawals Only
- **Payment Mode**:
  - All Modes
  - Cash
  - Cheque
  - Online Transfer
  - UPI
  - NEFT/RTGS
- **Apply Filters Button**: Refresh statement with selected filters
- **Reset Filters Button**: Clear all filters and show all transactions

**Statement Header** (Uses Company Settings):
- Company Logo (from settings)
- Company Name (from settings)
- Company Address, Phone, Email (from settings)
- Statement Title: 'Account Statement'\n- Customer Photo (100x100 pixels)
- Account Number\n- Customer Name
- Phone Number
- Address
- Statement Period: [From Date] to [To Date]\n- Statement Generation Date: [Current Date]
\n**Transaction History Table**:
| Date | Time | Transaction Type | Payment Mode | Reference Note | Debit (Withdrawal) | Credit (Deposit) | Balance |

**Table Features**:
- Chronological order (newest first or oldest first, user selectable)
- Color-coded transaction types:\n  - Deposits: Green text
  - Withdrawals: Red text
- Running balance column shows balance after each transaction
- Highlight negative balances in red
- Pagination (100 transactions per page)
- Total row at bottom showing sum of debits and credits

**Statement Summary Section**:
- **Opening Balance**: Balance at start of selected period
- **Total Deposits**: Sum of all deposits in period
- **Total Withdrawals**: Sum of all withdrawals in period
- **Closing Balance**: Balance at end of selected period
- **Number of Transactions**: Count of all transactions in period
- **Average Transaction Amount**: (Total Deposits + Total Withdrawals) / Number of Transactions
\n**Statement Footer** (Uses Company Settings):
- Company contact information
- Authorized signature (from settings)
- 'Generated by [Company Name]' text
- Statement generation date and time
-'This is a computer-generated statement and does not require a signature' disclaimer

**Statement Actions**:
- **Print Statement Button**: Generate printable statement in A4 format with company branding
- **Download as PDF Button**: Export statement as PDF using jsPDF with company branding
- **Download as Excel Button**: Export statement as Excel spreadsheet using SheetJS/ExcelJS
- **Send via Email Button**: Email statement PDF to customer's registered email
- **Share via WhatsApp Button**: Generate wa.me link with pre-filled message and statement summary, format: https://wa.me/[CustomerPhone]?text=[EncodedMessage]
  - Message includes: Account Number, Statement Period, Opening Balance, Closing Balance, Total Deposits, Total Withdrawals\n  - Option to attach PDF link if hosted online
- **Send via SMS Button**: Send statement summary via SMS with download link
\n### 2.4 Reports Section

#### 2.4.1 Daily/Monthly Transaction Summaries

**Daily Transaction Summary Report**:
\n**Report Filters**:
- Select Date (date picker, default: Today)
- Transaction Type: All / Deposits / Withdrawals
- Payment Mode: All / Cash / Cheque / Online / UPI / NEFT/RTGS
\n**Report Content**:
- **Summary Statistics**:
  - Total Deposits: ₹ X,XXX.XX (Count: XX transactions)
  - Total Withdrawals: ₹ X,XXX.XX (Count: XX transactions)
  - Net Cash Flow: ₹ X,XXX.XX (Deposits - Withdrawals)
  - Number of Customers Transacted: XX
  - Average Deposit Amount: ₹ X,XXX.XX
  - Average Withdrawal Amount: ₹ X,XXX.XX
\n- **Payment Mode Breakdown**:
  - Cash: ₹ X,XXX.XX (XX transactions)
  - Cheque: ₹ X,XXX.XX (XX transactions)
  - Online Transfer: ₹ X,XXX.XX (XX transactions)
  - UPI: ₹ X,XXX.XX (XX transactions)
  - NEFT/RTGS: ₹ X,XXX.XX (XX transactions)\n
- **Transaction List Table**:
  | Time | Account Number | Customer Name | Type | Amount | Payment Mode | Balance | Reference |
\n**Monthly Transaction Summary Report**:

**Report Filters**:
- Select Month and Year (dropdown)
- Transaction Type: All / Deposits / Withdrawals
\n**Report Content**:
- **Monthly Summary Statistics**:
  - Total Deposits: ₹ X,XXX.XX (Count: XX transactions)
  - Total Withdrawals: ₹ X,XXX.XX (Count: XX transactions)
  - Net Cash Flow: ₹ X,XXX.XX\n  - Number of Active Customers: XX
  - Average Daily Deposits: ₹ X,XXX.XX
  - Average Daily Withdrawals: ₹ X,XXX.XX
  - Highest Single Deposit: ₹ X,XXX.XX (Date, Customer)\n  - Highest Single Withdrawal: ₹ X,XXX.XX (Date, Customer)\n
- **Day-wise Breakdown Table**:
  | Date | Total Deposits | Total Withdrawals | Net Cash Flow | Transactions Count|\n
- **Top10 Customers by Transaction Volume**:
  | Rank | Account Number | Customer Name | Total Deposits | Total Withdrawals | Net Amount |

**Report Actions**:
- Print Report\n- Download as PDF
- Download as Excel
- Email Report\n\n#### 2.4.2 Customer Account Summaries

**All Customers Balance Report**:

**Report Filters**:
- Account Status: All / Active / Inactive\n- Balance Filter: All / Positive Balance / Zero Balance / Negative Balance\n- Sort By: Account Number / Customer Name / Balance (Ascending/Descending)

**Report Content**:
- **Overall Summary**:
  - Total Number of Customers: XX
  - Total Deposits Held: ₹ X,XXX.XX (sum of all positive balances)
  - Total Overdrafts: ₹ X,XXX.XX (sum of all negative balances)
  - Net Position: ₹ X,XXX.XX\n\n- **Customer List Table**:
  | Account Number | Customer Name | Phone | Current Balance | Last Transaction Date | Status |

- **Balance Distribution**:
  - Customers with Balance > ₹1,00,000: XX customers, Total:₹ X,XXX.XX
  - Customers with Balance ₹50,000 - ₹1,00,000: XX customers, Total: ₹ X,XXX.XX
  - Customers with Balance ₹10,000 - ₹50,000: XX customers, Total: ₹ X,XXX.XX
  - Customers with Balance < ₹10,000: XX customers, Total: ₹ X,XXX.XX
- Customers with Zero Balance: XX customers\n  - Customers with Negative Balance: XX customers, Total: ₹ X,XXX.XX

**Individual Customer Summary Report**:

**Report Content** (for selected customer):
- Customer Photo and Details
- Account Number
- Account Opening Date
- Current Balance
- Total Deposits (All Time): ₹ X,XXX.XX (Count: XX)
- Total Withdrawals (All Time): ₹ X,XXX.XX (Count: XX)
- Average Monthly Deposits: ₹ X,XXX.XX
- Average Monthly Withdrawals: ₹ X,XXX.XX
- Last10 Transactions
- Month-wise Transaction Summary (Last 12 Months)

**Report Actions**:
- Print Report
- Download as PDF
- Download as Excel
- Email to Customer

#### 2.4.3 Cash Flow Analysis

**Cash Flow Report**:

**Report Filters**:
- Date Range: From Date - To Date
- Grouping: Daily / Weekly / Monthly / Yearly
\n**Report Content**:
- **Cash Flow Summary**:
  - Total Cash Inflow (Deposits): ₹ X,XXX.XX\n  - Total Cash Outflow (Withdrawals): ₹ X,XXX.XX\n  - Net Cash Flow: ₹ X,XXX.XX
  - Opening Balance (Start of Period): ₹ X,XXX.XX
  - Closing Balance (End of Period): ₹ X,XXX.XX
\n- **Cash Flow Trend Chart**:
  - Line chart showing deposits, withdrawals, and net cash flow over time
  - X-axis: Time period (days/weeks/months)
  - Y-axis: Amount (₹)
  - Three lines: Deposits (green), Withdrawals (red), Net Cash Flow (blue)
\n- **Period-wise Cash Flow Table**:
  | Period | Opening Balance | Deposits | Withdrawals | Net Cash Flow | Closing Balance |

- **Payment Mode Analysis**:
  - Pie chart showing distribution of transactions by payment mode
  - Table with payment mode breakdown:\n    | Payment Mode | Deposits | Withdrawals | Total Transactions |

**Report Actions**:
- Print Report\n- Download as PDF
- Download as Excel
- Email Report

---

## 3. Database Schema

### 3.1 Banking Customers Table

**Table Name**: `banking_customers`

**Columns**:
- `id` (INT, Primary Key, Auto Increment)
- `account_number` (VARCHAR(20), Unique, Not Null) - Manually assigned by admin
- `full_name` (VARCHAR(100), Not Null)
- `phone` (VARCHAR(15), Unique, Not Null)
- `email` (VARCHAR(100), Nullable)
- `address` (TEXT, Not Null)
- `photo_path` (VARCHAR(255), Not Null) - Path to uploaded photo
- `current_balance` (DECIMAL(15,2), Default 0.00)\n- `account_status` (ENUM('Active', 'Inactive', 'Closed'), Default 'Active')
- `account_opening_date` (DATE, Not Null)
- `created_by` (INT, Foreign Key to users table)
- `created_at` (TIMESTAMP, Default CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
\n**Indexes**:
- Primary Key: `id`
- Unique Index: `account_number`
- Unique Index: `phone`
- Index: `account_status`
- Index: `current_balance`
\n### 3.2 Banking Transactions Table

**Table Name**: `banking_transactions`

**Columns**:
- `id` (INT, Primary Key, Auto Increment)\n- `transaction_id` (VARCHAR(50), Unique, Not Null) - Auto-generated unique transaction ID
- `account_number` (VARCHAR(20), Foreign Key to banking_customers.account_number, Not Null)
- `customer_id` (INT, Foreign Key to banking_customers.id, Not Null)
- `transaction_type` (ENUM('Deposit', 'Withdrawal'), Not Null)
- `amount` (DECIMAL(15,2), Not Null)
- `transaction_date` (DATE, Not Null)
- `transaction_time` (TIME, Not Null)
- `payment_mode` (ENUM('Cash', 'Cheque', 'Online Transfer', 'UPI', 'NEFT/RTGS', 'Demand Draft'), Not Null)
- `reference_note` (TEXT, Nullable)
- `cheque_number` (VARCHAR(20), Nullable)
- `bank_name` (VARCHAR(100), Nullable)
- `cheque_date` (DATE, Nullable)
- `transacted_by` (VARCHAR(100), Nullable) - Person making deposit/withdrawal
- `balance_before` (DECIMAL(15,2), Not Null)
- `balance_after` (DECIMAL(15,2), Not Null)
- `processed_by` (INT, Foreign Key to users table) - Staff member who processed transaction
- `created_at` (TIMESTAMP, Default CURRENT_TIMESTAMP)
\n**Indexes**:
- Primary Key: `id`
- Unique Index: `transaction_id`
- Index: `account_number`
- Index: `customer_id`
- Index: `transaction_type`
- Index: `transaction_date`
- Index: `payment_mode`
- Composite Index: (`account_number`, `transaction_date`)

### 3.3 Database Relationships

- `banking_transactions.customer_id` → `banking_customers.id` (Many-to-One)
- `banking_transactions.account_number` → `banking_customers.account_number` (Many-to-One)
- `banking_customers.created_by` → `users.id` (Many-to-One)
- `banking_transactions.processed_by` → `users.id` (Many-to-One)

---

## 4. User Interface Mockups

### 4.1 Main Navigation

**Navigation Menu Structure**:
```
- Dashboard
- Loan Management
- Khatabook Ledger
- Banking← NEW TOP-LEVEL SECTION
  - Add New Customer
  - Customer List
  - Deposit\n  - Withdraw
  - Statement
  - Reports
    - Daily Summary
    - Monthly Summary
    - Customer Summaries
    - Cash Flow Analysis
- Communication\n- Settings
```

### 4.2 Add New Customer Page

**Layout**:
- Page Title: 'Add New Banking Customer'
- Form Layout: Two-column layout
  - Left Column:\n    - Photo Upload Section (large, centered)
    - Preview uploaded photo
  - Right Column:
    - Account Number (manual input)
    - Full Name\n    - Phone Number
    - Email Address
    - Address (full width)
- Action Buttons at Bottom: Save Customer | Reset | Cancel
\n### 4.3 Customer List Page

**Layout**:
- Page Title: 'Banking Customers'
- Search Bar at Top (search by account number, name, phone)\n- Filter Buttons: All | Active | Inactive | Positive Balance | Zero Balance | Negative Balance
- Customer Table with columns: Photo | Account Number | Name | Phone | Balance | Status | Actions
- Pagination at Bottom\n- Export Button: Export as CSV/Excel

### 4.4 Customer Detail Page

**Layout**:
- Page Title: 'Customer Details - [Customer Name]'
- Top Section: Customer Info Card
  - Left: Customer Photo (large)
  - Right: Account Number, Name, Phone, Email, Address, Status, Balance
- Quick Actions Row: Deposit | Withdraw | View Statement | Edit | Deactivate
- Recent Transactions Section (table)
- Account Summary Statistics (cards)

### 4.5 Deposit Transaction Page

**Layout**:
- Page Title: 'Deposit Transaction'
- Customer Selection Section (search dropdown with photo preview)
- Transaction Form:
  - Deposit Amount (large input)
  - Date and Time\n  - Payment Mode\n  - Reference Note
  - Deposited By
- Transaction Summary Preview (Current Balance → New Balance)
- Action Buttons: Confirm Deposit | Cancel\n
### 4.6 Withdraw Transaction Page
\n**Layout**:
- Page Title: 'Withdraw Transaction'\n- Customer Selection Section (search dropdown with photo preview)
- Current Balance Display (prominent)
- Transaction Form:
  - Withdrawal Amount (large input)\n  - Date and Time
  - Payment Mode
  - Reference Note
  - Withdrawn By
- Transaction Summary Preview (Current Balance → New Balance, with warning if negative)
- Action Buttons: Confirm Withdrawal | Cancel

### 4.7 Account Statement Page

**Layout**:
- Page Title: 'Account Statement'
- Customer Selection Section\n- Filter Section:\n  - **Date Range Row**:\n    - From Date (date picker)
    - To Date (date picker)
    - Quick Select Buttons: Today | Last 7 Days | Last 30 Days | This Month | Last Month | This Year | All Time
  - **Additional Filters Row**:
    - Transaction Type dropdown
    - Payment Mode dropdown\n  - **Action Buttons**: Apply Filters | Reset\n- Statement Header (customer info, statement period)\n- Transaction Table (scrollable)
- Statement Summary Section (opening balance, total deposits, total withdrawals, closing balance)
- Action Buttons: Print | Download PDF | Download Excel | Send via Email | Share via WhatsApp\n
### 4.8 Reports Dashboard

**Layout**:\n- Page Title: 'Banking Reports'
- Report Type Selection (tabs or cards):
  - Daily Summary
  - Monthly Summary
  - Customer Summaries
  - Cash Flow Analysis
- Report Filters (based on selected report type)
- Report Content Area (tables, charts, statistics)
- Action Buttons: Print | Download PDF | Download Excel | Email\n
---

## 5. Detailed Workflows

### 5.1 Add Customer Workflow

**Step 1**: User clicks 'Add New Customer' in Banking menu
**Step 2**: System displays customer addition form
**Step 3**: User uploads customer photo
  - System validates file format and size
  - System displays photo preview
**Step 4**: User manually enters unique account number
  - System validates uniqueness in real-time
  - System displays error if duplicate
**Step 5**: User fills in customer details (name, phone, email, address)\n  - System validates required fields
  - System validates phone format and uniqueness
**Step 6**: User clicks 'Save Customer'\n  - System validates all fields\n  - System checks account number uniqueness
  - System saves customer record to database
  - System saves uploaded photo to server
  - System sets account opening date to current date
  - System sets initial balance to 0.00
- System sets account status to 'Active'
**Step 7**: System displays success message
**Step 8**: System redirects to customer detail page

### 5.2 Deposit Workflow

**Step 1**: User clicks 'Deposit' in Banking menu or from customer detail page
**Step 2**: System displays deposit transaction form
**Step 3**: User searches and selects customer by account number or name
  - System displays customer photo, name, account number, current balance
**Step 4**: User enters deposit amount
  - System displays amount in words
  - System calculates and displays new balance preview
**Step 5**: User enters transaction date and time (default: current date/time)
**Step 6**: User selects payment mode\n  - If Cheque selected, user enters cheque details
**Step 7**: User enters reference note (optional)
**Step 8**: User enters deposited by name (optional)
**Step 9**: User clicks 'Confirm Deposit'
  - System displays confirmation dialog
**Step 10**: User confirms transaction
  - System validates all required fields
  - System generates unique transaction ID
  - System records balance before transaction
  - System calculates new balance: Current Balance + Deposit Amount
  - System creates transaction record in database
  - System updates customer current balance
  - System logs transaction with user info and timestamp
**Step 11**: System displays success message
**Step 12**: System generates and displays transaction receipt
**Step 13**: User can:\n  - Print receipt
  - Share receipt via WhatsApp using wa.me link button
  - Send receipt via SMS/Email
**Step 14**: System redirects to customer detail page or allows another transaction

### 5.3 Withdraw Workflow

**Step 1**: User clicks 'Withdraw' in Banking menu or from customer detail page
**Step 2**: System displays withdrawal transaction form
**Step 3**: User searches and selects customer by account number or name
  - System displays customer photo, name, account number, current balance
**Step 4**: User enters withdrawal amount\n  - System validates amount against current balance
  - System displays error if insufficient balance (unless overdraft allowed)
  - System displays amount in words
  - System calculates and displays new balance preview
  - System displays warning if new balance is negative
**Step 5**: User enters transaction date and time (default: current date/time)
**Step 6**: User selects payment mode
  - If Cheque Issued selected, user enters cheque details
**Step 7**: User enters reference note (optional)
**Step 8**: User enters withdrawn by name (optional)
**Step 9**: User clicks 'Confirm Withdrawal'
  - System displays confirmation dialog
  - If balance becomes negative, system displays additional warning
**Step 10**: User confirms transaction
  - System validates all required fields
  - System checks sufficient balance or overdraft limit
  - System generates unique transaction ID
  - System records balance before transaction
  - System calculates new balance: Current Balance - Withdrawal Amount
  - System creates transaction record in database
  - System updates customer current balance
  - System logs transaction with user info and timestamp
**Step 11**: System displays success message
**Step 12**: System generates and displays transaction receipt
**Step 13**: User can:
  - Print receipt
  - Share receipt via WhatsApp using wa.me link button
  - Send receipt via SMS/Email
**Step 14**: System redirects to customer detail page or allows another transaction

### 5.4 View Statement Workflow

**Step 1**: User clicks 'Statement' in Banking menu or from customer detail page
**Step 2**: System displays statement page\n**Step 3**: User searches and selects customer by account number or name
  - System displays customer photo, name, account number, current balance
**Step 4**: User selects date range using quick select buttons or manual date pickers
  - Quick select buttons: Today, Last 7 Days, Last 30 Days, This Month, Last Month, This Year, All Time\n  - Manual selection: From Date and To Date pickers
**Step 5**: User selects additional filters (optional)
  - Transaction Type: All / Deposits / Withdrawals
  - Payment Mode: All / Cash / Cheque / Online / UPI / NEFT/RTGS\n**Step 6**: User clicks 'Apply Filters'
  - System queries database for transactions matching filters
  - System calculates opening balance (balance before first transaction in period)
  - System calculates running balance for each transaction
  - System calculates closing balance (balance after last transaction in period)
  - System calculates summary statistics (total deposits, total withdrawals, transaction count)
**Step 7**: System displays statement with:
  - Statement header (customer info, company branding from settings)
  - Transaction table with running balance
  - Statement summary section\n  - Statement footer (company info from settings)
**Step 8**: User can:
  - Print statement (A4 format with company branding)
  - Download as PDF (using jsPDF with company branding)
  - Download as Excel (using SheetJS/ExcelJS)
  - Send via Email (to customer's registered email)
  - **Share via WhatsApp**: Click WhatsApp button to open wa.me link with pre-filled message containing statement summary
    - Link format: https://wa.me/[CustomerPhone]?text=[EncodedStatementSummary]
    - Message includes: Account Number, Statement Period, Opening Balance, Closing Balance, Total Deposits, Total Withdrawals\n  - Send via SMS (with download link)
**Step 9**: System logs statement generation activity

### 5.5 WhatsApp Sharing Implementation

**Transaction Receipt Sharing via WhatsApp**:
- **Button Label**: 'Share via WhatsApp' with WhatsApp icon
- **Link Generation**:
  - Format: `https://wa.me/[CustomerPhone]?text=[EncodedMessage]`
  - Customer phone number must be in international format (e.g., 919876543210)
  - Message content (URL encoded):
    ```
    Transaction Receipt
    [Company Name]
    \n    Account: [AccountNumber]
    Customer: [CustomerName]
    Type: [Deposit/Withdrawal]
    Amount: ₹[Amount]
    Date: [Date] [Time]
    Payment Mode: [PaymentMode]
    Previous Balance: ₹[BalanceBefore]
    New Balance: ₹[BalanceAfter]
    Reference: [ReferenceNote]
    \n    Thank you for banking with us!
    ```
- **Button Action**: Opens WhatsApp web or app with pre-filled message
- **Fallback**: If customer phone not available, show error message

**Account Statement Sharing via WhatsApp**:
- **Button Label**: 'Share via WhatsApp' with WhatsApp icon
- **Link Generation**:
  - Format: `https://wa.me/[CustomerPhone]?text=[EncodedMessage]`
  - Customer phone number must be in international format\n  - Message content (URL encoded):
    ```
    Account Statement
    [Company Name]
    
    Account: [AccountNumber]
    Customer: [CustomerName]
    Period: [FromDate] to [ToDate]
    \n    Opening Balance: ₹[OpeningBalance]
    Total Deposits: ₹[TotalDeposits]
    Total Withdrawals: ₹[TotalWithdrawals]
    Closing Balance: ₹[ClosingBalance]
    
    Number of Transactions: [Count]
    \n    For detailed statement, please contact us.\n    ```
- **Button Action**: Opens WhatsApp web or app with pre-filled message
- **Optional PDF Link**: If statement PDF is hosted online, include download link in message
- **Fallback**: If customer phone not available, show error message

---

## 6. Security & Access Control

### 6.1 User Roles & Permissions

**Banking Module Permissions**:
\n- **Super Admin**:
  - Full access to all banking functions
  - Add/Edit/Delete customers
  - Process deposits and withdrawals
  - View all statements and reports
  - Configure banking settings
  - Allow overdraft transactions

- **Admin**:
  - Add/Edit customers (cannot delete)
  - Process deposits and withdrawals
  - View all statements and reports
  - Cannot allow overdraft transactions
\n- **Banking Manager**:
  - Add/Edit customers\n  - Process deposits and withdrawals
  - View statements and reports
  - Generate reports
\n- **Banking Cashier**:
  - Process deposits and withdrawals only
  - View customer details (read-only)
  - Generate transaction receipts
  - Cannot add/edit customers
  - Cannot view reports

- **Accountant**:
  - View all statements and reports (read-only)
  - Generate and export reports
  - Cannot process transactions
  - Cannot add/edit customers

- **Other Roles**: No access to Banking module

### 6.2 Security Measures

- **Transaction Confirmation**: All deposit and withdrawal transactions require confirmation dialog
- **Audit Trail**: Log all transactions with user info, IP address, and timestamp
- **Balance Validation**: Prevent withdrawal if insufficient balance (unless overdraft explicitly allowed by authorized user)
- **Unique Account Numbers**: Enforce uniqueness to prevent duplicate accounts
- **Photo Upload Validation**: Validate file format and size to prevent malicious uploads
- **Access Control**: Role-based access control for all banking functions
- **Session Timeout**: Auto-logout after inactivity period
- **Data Encryption**: Encrypt sensitive data at rest and in transit
- **Backup**: Automated daily database backup

---

## 7. Integration with Existing System

### 7.1 Company Settings Integration

- **Statement Header/Footer**: Use company logo, name, address, phone, email from System Settings module
- **Transaction Receipts**: Use company branding from System Settings module
- **Reports**: Include company branding in all generated reports
\n### 7.2 Communication Module Integration

- **Send Receipts**: Use CRM Communication Module to send transaction receipts via SMS/Email
- **Send Statements**: Use CRM Communication Module to send account statements via Email
- **WhatsApp Sharing**: Use wa.me links for WhatsApp sharing of receipts and statements
- **Customer Notifications**: Send account opening confirmation, transaction alerts via preferred channel

### 7.3 Optional CRM Integration

- **Link to Existing Customers**: Option to link banking customer to existing CRM customer record (if same person)
- **Unified Customer View**: Display banking account info in existing customer detail page (if linked)
- **Cross-Module Reporting**: Generate combined reports showing loan, ledger, and banking activities

---

## 8. Technical Implementation

### 8.1 API Endpoints

**Customer Management**:
- POST /api/banking/customers → Add new customer
- GET /api/banking/customers → Get all customers (with filters)
- GET /api/banking/customers/:id → Get customer details
- PUT /api/banking/customers/:id → Update customer details
- DELETE /api/banking/customers/:id → Delete customer (soft delete)
- POST /api/banking/customers/upload-photo → Upload customer photo
- GET /api/banking/customers/search → Search customers by account number or name

**Transaction Management**:
- POST /api/banking/transactions/deposit → Process deposit transaction
- POST /api/banking/transactions/withdraw → Process withdrawal transaction
- GET /api/banking/transactions → Get all transactions (with filters)
- GET /api/banking/transactions/:id → Get transaction details
- GET /api/banking/transactions/customer/:accountNumber → Get transactions for specific customer
\n**Statement & Reports**:
- GET /api/banking/statement/:accountNumber → Generate account statement
- POST /api/banking/statement/download-pdf → Download statement as PDF
- POST /api/banking/statement/download-excel → Download statement as Excel
- POST /api/banking/statement/send-email → Send statement via email\n- GET /api/banking/statement/whatsapp-link → Generate wa.me link for statement sharing
- GET /api/banking/reports/daily-summary → Generate daily transaction summary
- GET /api/banking/reports/monthly-summary → Generate monthly transaction summary
- GET /api/banking/reports/customer-summaries → Generate customer account summaries
- GET /api/banking/reports/cash-flow → Generate cash flow analysis report

**WhatsApp Integration**:
- GET /api/banking/whatsapp/receipt-link → Generate wa.me link for transaction receipt
- GET /api/banking/whatsapp/statement-link → Generate wa.me link for account statement
\n### 8.2 Frontend Pages

**Banking Module Pages**:
1. `/admin/banking/dashboard` - Banking dashboard with quick stats
2. `/admin/banking/customers/add` - Add new customer form
3. `/admin/banking/customers` - Customer list page
4. `/admin/banking/customers/:id` - Customer detail page
5. `/admin/banking/deposit` - Deposit transaction form
6. `/admin/banking/withdraw` - Withdrawal transaction form
7. `/admin/banking/statement` - Account statement page
8. `/admin/banking/reports/daily` - Daily summary report
9. `/admin/banking/reports/monthly` - Monthly summary report
10. `/admin/banking/reports/customers` - Customer summaries report
11. `/admin/banking/reports/cash-flow` - Cash flow analysis report

### 8.3 File Storage

**Customer Photos**:
- Storage Path: `./uploads/banking/customer-photos/`
- Filename Format: `[AccountNumber]_[Timestamp].jpg`
- Thumbnail Generation: Auto-generate 50x50 and 300x300 thumbnails
- Backup: Include in daily database backup

### 8.4 WhatsApp Integration Technical Details

**wa.me Link Generation**:
- **Phone Number Formatting**:
  - Remove all non-numeric characters from customer phone
  - Add country code if not present (default: 91 for India)
  - Format:919876543210 (no + or spaces)
- **Message Encoding**:
  - Use encodeURIComponent() to URL-encode message text
  - Preserve line breaks using %0A
  - Preserve special characters\n- **Link Format**: `https://wa.me/[Phone]?text=[EncodedMessage]`
- **Button Implementation**:
  - Use anchor tag with target='_blank' to open in new tab
  - Include WhatsApp icon (green background, white icon)
  - Responsive button design for mobile and desktop
- **Error Handling**:
  - Validate phone number exists before generating link
  - Show user-friendly error if phone number invalid
  - Log failed attempts for debugging

---
\n## 9. Design Style\n
### 9.1 Visual Design

- **Color Scheme**:
  - Primary: Deep blue (#1e3a8a) for trust and professionalism
  - Secondary: Teal (#14b8a6) for banking-specific elements
  - Success: Green (#10b981) for deposits and positive balances
  - Danger: Red (#ef4444) for withdrawals and negative balances
  - Warning: Yellow (#f59e0b) for alerts and warnings
  - WhatsApp: Green (#25D366) for WhatsApp share buttons
  - Background: White (#ffffff) with light gray (#f3f4f6) for cards

- **Typography**:
  - Headings: Bold, sans-serif font (Inter, Roboto)
  - Body text: Regular, sans-serif font\n  - Numbers: Monospace font for amounts and account numbers
\n- **Layout**:
  - Card-based UI with rounded corners (8px)
  - Subtle shadows for depth (02px 8px rgba(0,0,0,0.1))
  - Generous white space for clarity
  - Responsive grid layout

### 9.2 Interactive Elements

- **Buttons**:
  - Primary actions: Solid blue background with white text
  - Secondary actions: Outlined blue border with blue text
  - Danger actions: Solid red background with white text
  - WhatsApp actions: Solid green (#25D366) background with white text and WhatsApp icon
  - Hover effect: Slight darkening with smooth transition (0.3s)

- **Forms**:
  - Clear labels above input fields
  - Placeholder text for guidance
  - Inline validation with error messages
  - Required fields marked with asterisk (*)

- **Tables**:
  - Alternating row colors for readability
  - Sticky header on scroll
  - Sortable columns with arrow indicators
  - Hover effect on rows

- **Notifications**:
  - Toast notifications for success/error messages
  - Auto-dismiss after 5 seconds\n  - Color-coded by message type (green/red/yellow)
\n---

## 10. Testing Requirements

### 10.1 Functional Testing

- **Customer Management**:
  - Test customer addition with all fields
  - Test photo upload (valid and invalid formats)
  - Test account number uniqueness validation
  - Test phone number uniqueness validation
  - Test customer search functionality
  - Test customer edit and update\n\n- **Transaction Processing**:
  - Test deposit transaction with various payment modes
  - Test withdrawal transaction with sufficient balance
  - Test withdrawal with insufficient balance (should fail)
  - Test balance calculation accuracy
  - Test transaction receipt generation
  - Test transaction logging\n
- **Statement Generation**:
  - Test statement with various date ranges using quick select buttons
  - Test statement with custom date range selection
  - Test statement filters (transaction type, payment mode)
  - Test statement summary calculations
  - Test statement export (PDF, Excel)
  - Test statement sending via communication channels

- **WhatsApp Integration**:
  - Test wa.me link generation for transaction receipts
  - Test wa.me link generation for account statements\n  - Test phone number formatting (with/without country code)
  - Test message encoding (special characters, line breaks)
  - Test WhatsApp button functionality on mobile and desktop
  - Test error handling for invalid/missing phone numbers

- **Reports**:
  - Test daily summary report accuracy
  - Test monthly summary report accuracy
  - Test customer summaries report\n  - Test cash flow analysis report
  - Test report export functionality

### 10.2 Security Testing

- Test role-based access control for all functions
- Test transaction confirmation dialogs
- Test audit trail logging
- Test session timeout\n- Test SQL injection prevention
- Test XSS prevention
- Test file upload security

### 10.3 Performance Testing

- Test page load time with1000+ customers
- Test transaction processing speed
- Test statement generation with10,000+ transactions
- Test report generation performance
- Test database query optimization
- Test wa.me link generation performance
\n---

## 11. Implementation Notes

### 11.1 Critical Requirements

- **Manual Account Number Assignment**: System must allow administrator to manually enter unique account numbers, not auto-generate
- **Photo Upload**: Mandatory photo upload for all customers with proper validation
- **Balance Accuracy**: All balance calculations must be accurate to 2 decimal places
- **Transaction Confirmation**: All financial transactions must require explicit confirmation
- **Audit Trail**: All transactions must be logged with user info and timestamp
- **Company Branding**: All documents (statements, receipts, reports) must use company branding from System Settings
- **Date Range Filter Buttons**: Statement section must include quick select buttons for common date ranges alongside manual date pickers
- **WhatsApp Sharing**: Use wa.me links for sharing transaction receipts and account statements via WhatsApp

### 11.2 Data Migration

- If migrating from existing banking system, provide CSV import tool for customers and transactions
- Validate all imported data before saving
- Generate import report with errors\n\n### 11.3 Future Enhancements

- **Overdraft Management**: Configurable overdraft limits per customer
- **Interest Calculation**: Auto-calculate interest on deposits (savings accounts)
- **Recurring Deposits**: Support for recurring deposit schemes
- **Fixed Deposits**: Support for fixed deposit accounts with maturity tracking
- **Loan Integration**: Link banking accounts to loan accounts for automatic EMI deduction
- **Mobile App**: Mobile application for customers to view balance and statements
- **SMS Alerts**: Auto-send SMS alerts for all transactions
- **Cheque Management**: Track cheque status (issued, cleared, bounced)
- **Multi-Currency Support**: Support for multiple currencies
- **Branch Management**: Support for multiple branches with centralized reporting
- **WhatsApp Business API**: Upgrade to WhatsApp Business API for automated notifications and two-way communication

---
\n## 12. Reference Files

1. Screenshot reference:19238.jpg\n\n---

**Note**: This Banking module is designed as a standalone yet integrated component of the Mit Electro World CRM system. It maintains consistency with existing modules (Loan Management, Khatabook Ledger, Communication) while providing comprehensive banking account and transaction management capabilities. All documents generated by this module will use company branding from the System Settings module, ensuring professional and consistent output across the entire system. WhatsApp sharing functionality uses wa.me links for simple, direct sharing of transaction receipts and account statements without requiring WhatsApp Business API integration.