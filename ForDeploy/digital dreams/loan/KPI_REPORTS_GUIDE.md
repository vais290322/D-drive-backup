# KPI Reports - Quick Reference Guide

## Dashboard KPI Cards (All Clickable)

### 1. Total Customers 👥
**Click to view:** Complete customer list with KYC status
- Shows all customer details
- KYC verification status
- Contact information
- Registration dates

### 2. Active Loans 📄
**Click to view:** All currently active loans
- Loan amounts and terms
- Customer names
- Interest rates
- Start dates
- **Summary:** Total Active Loans, Total Disbursed, Total Payable

### 3. Completed Loans ✅
**Click to view:** All fully paid loans
- Completed loan history
- Total amounts collected
- Completion dates
- **Summary:** Total Completed, Total Disbursed, Total Collected

### 4. Delayed EMIs ⚠️
**Click to view:** Loans with overdue payments
- Days delayed calculation
- Outstanding amounts
- Customer contact info
- **Summary:** Total Delayed, Total Outstanding, Average Delay

### 5. Today's Collection 💰
**Click to view:** All payments received today
- Payment breakdown by method (Cash/UPI/Bank)
- Transaction times
- Customer details
- **Summary:** Total Collection, Method-wise breakdown

### 6. Total Outstanding 📈
**Click to view:** Complete financial report
- All loan financial details
- Outstanding calculations
- Collection rates
- **Summary:** Disbursed, Collected, Outstanding, Collection %

### 7. Total Disbursed 💼
**Click to view:** Complete financial report
- Total loan amounts disbursed
- Loan-wise breakdown
- Financial summary
- **Summary:** All financial metrics with collection rate

## Report Features

### Every Report Includes:
✅ **Print Button** - Print-optimized layout
✅ **Download Button** - Export to CSV
✅ **Back Button** - Return to dashboard
✅ **Summary Cards** - Key metrics at top
✅ **Detailed Table** - All relevant data
✅ **Proper Formatting** - Currency, dates, status badges

### Print Layout:
- Clean professional design
- Report title and date
- No navigation elements
- Ready for filing

### CSV Export:
- Excel-compatible format
- All data columns included
- Proper headers
- Date-stamped filename

## How to Use

### Step 1: View Dashboard
- See all 7 KPI cards with current numbers
- Notice "Click to view details" hint

### Step 2: Click Any KPI
- Card scales up on hover
- Click to navigate to detailed report

### Step 3: Analyze Data
- View comprehensive data in table format
- Check summary cards for quick insights
- Review all calculations

### Step 4: Export or Print
- Click **Print** for physical copy
- Click **Download** for CSV export
- Use **Back** button to return

## Calculation Details

### Total Disbursed
```
Sum of all loan principal amounts
= Σ(principal_amount) for all loans
```

### Total Outstanding
```
Sum of remaining balances for active loans
= Σ(total_payable - total_paid) for active loans
Uses ledger system for accuracy
```

### Today's Collection
```
Sum of all payments made today
= Σ(amount_paid) where payment_date = today
```

### Delayed EMIs
```
Loans where:
- Status = active
- First EMI date < today
- Outstanding balance > 0
Days delayed = today - first_emi_date
```

### Collection Rate
```
(Total Collected / Total Disbursed) × 100
Shows overall recovery percentage
```

## Report Navigation Map

```
Dashboard
├── Total Customers → Customers Report
├── Active Loans → Active Loans Report
├── Completed Loans → Completed Loans Report
├── Delayed EMIs → Delayed EMIs Report
├── Today's Collection → Today's Collection Report
├── Total Outstanding → Financial Report
└── Total Disbursed → Financial Report
```

## Color Coding

### Status Badges:
- 🟢 **Green** - Success (Completed, Verified)
- 🔵 **Blue** - Active (In Progress)
- 🔴 **Red** - Alert (Delayed, Rejected)
- ⚪ **Gray** - Pending

### Amount Colors:
- 🟢 **Green** - Collected/Disbursed amounts
- 🔵 **Blue** - Outstanding amounts
- 🔴 **Red** - Delayed/Overdue amounts

## Tips for Best Use

1. **Regular Monitoring**: Click KPIs daily to track business health
2. **Print Reports**: Keep physical copies for audits
3. **Export Data**: Download CSV for Excel analysis
4. **Track Trends**: Compare reports over time
5. **Follow Up**: Use Delayed EMIs report for collection calls

## Troubleshooting

### If KPI shows 0 but should have data:
- Check if data is properly loaded
- Verify loan status is correct
- Ensure dates are set properly

### If report is empty:
- Verify filters (e.g., today's date for collections)
- Check if loans exist in that category
- Ensure data is saved correctly

### If amounts don't match:
- All reports use same calculation logic
- Check ledger entries for accuracy
- Verify payment records are complete

## Support

For any issues or questions about the reports:
1. Check this guide first
2. Verify data entry is correct
3. Review calculation logic in reports
4. Contact system administrator if needed

---

**Note:** All reports are real-time and reflect current database state. No caching is used, ensuring data accuracy.
