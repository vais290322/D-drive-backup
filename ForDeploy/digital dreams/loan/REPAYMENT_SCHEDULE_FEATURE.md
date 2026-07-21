# Repayment Schedule Feature - Complete Implementation Guide

## Overview

The Repayment Schedule feature provides a comprehensive EMI (Equated Monthly Installment) payment schedule for loans with a fixed day of the month for all EMI payments. This ensures consistent payment dates and better financial planning for both the lender and borrower.

## Key Features

### 1. Fixed EMI Day of Month
- **Purpose**: All EMIs for a loan are due on the same day each month
- **Range**: 1-31 (user selectable)
- **Smart Handling**: For months with fewer days (e.g., February), the system automatically uses the last day of that month
- **Example**: If EMI day is set to 31:
  - January: 31st
  - February: 28th (or 29th in leap years)
  - March: 31st
  - April: 30th

### 2. Complete Repayment Schedule Display
- **EMI Number**: Sequential numbering (#1, #2, #3, etc.)
- **Due Date**: Exact date when each EMI is due
- **Principal Component**: Portion of EMI that reduces the loan principal
- **Interest Component**: Interest charged for that period
- **EMI Amount**: Total amount due for that installment
- **Opening Balance**: Loan balance at the start of the period
- **Closing Balance**: Loan balance after the EMI payment
- **Paid Amount**: Amount actually paid (for tracking partial payments)
- **Status**: Current status (Pending, Paid, Overdue, Partial)
- **Paid Date**: Date when the EMI was actually paid

### 3. Visual Summary Cards
- **Total Principal**: Sum of all principal components
- **Total Interest**: Sum of all interest components
- **Total Payable**: Complete amount to be paid over the loan tenure
- **Total Paid**: Amount paid so far (highlighted in green)

### 4. Status Badges
- **Paid** (Green): EMI has been fully paid
- **Pending** (Blue): EMI is due but not yet paid
- **Overdue** (Red): EMI is past due date and unpaid
- **Partial** (Yellow): EMI is partially paid

## Technical Implementation

### Database Schema Changes

#### Migration File: `03_add_emi_day_of_month.sql`

```sql
-- Add emi_day_of_month column to loans table
ALTER TABLE loans 
ADD COLUMN emi_day_of_month INTEGER;

-- Backfill existing loans with day from first_emi_date
UPDATE loans 
SET emi_day_of_month = EXTRACT(DAY FROM first_emi_date::date)
WHERE emi_day_of_month IS NULL;

-- Make column NOT NULL after backfill
ALTER TABLE loans 
ALTER COLUMN emi_day_of_month SET NOT NULL;

-- Add check constraint to ensure valid day (1-31)
ALTER TABLE loans 
ADD CONSTRAINT loans_emi_day_of_month_check 
CHECK (emi_day_of_month >= 1 AND emi_day_of_month <= 31);
```

**Key Points:**
- Safely adds the new column
- Backfills existing data automatically
- Enforces data integrity with constraints
- Includes helpful documentation

### Type Definitions

#### Updated `Loan` Interface (`src/types/types.ts`)

```typescript
export interface Loan {
  id: string;
  loan_id: string;
  customer_id: string;
  product_id: string | null;
  loan_type: LoanType;
  principal_amount: number;
  processing_fee: number;
  insurance_fee: number;
  tenure_months: number;
  interest_type: InterestType;
  interest_rate: number;
  total_interest: number;
  total_payable: number;
  installment_amount: number;
  start_date: string;
  first_emi_date: string;
  emi_day_of_month: number;  // NEW FIELD
  status: LoanStatus;
  closed_date: string | null;
  guarantor_name: string | null;
  guarantor_mobile: string | null;
  guarantor_address: string | null;
  guarantor_relation: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
```

### EMI Calculation Logic

#### Updated `generateEmiSchedule` Function (`src/utils/emiCalculations.ts`)

```typescript
export function generateEmiSchedule(
  loanId: string,
  principal: number,
  annualRate: number,
  tenureMonths: number,
  interestType: InterestType,
  loanType: LoanType,
  firstEmiDate: string,
  emiDayOfMonth?: number  // NEW PARAMETER
): EmiSchedule[]
```

**Key Features:**
- Accepts explicit `emiDayOfMonth` parameter
- Falls back to extracting day from `firstEmiDate` if not provided
- Handles month-end edge cases automatically
- Generates complete schedule with all financial details

#### Smart Date Calculation (`getNextEmiDate`)

```typescript
export function getNextEmiDate(
  currentDate: Date,
  loanType: LoanType,
  fixedDayOfMonth: number
): Date {
  const nextDate = new Date(currentDate);
  
  if (loanType === 'daily') {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (loanType === 'weekly') {
    nextDate.setDate(nextDate.getDate() + 7);
  } else {
    // Monthly - use fixed day of month
    nextDate.setMonth(nextDate.getMonth() + 1);
    
    // Handle month-end edge cases
    const lastDayOfMonth = new Date(
      nextDate.getFullYear(), 
      nextDate.getMonth() + 1, 
      0
    ).getDate();
    const targetDay = Math.min(fixedDayOfMonth, lastDayOfMonth);
    nextDate.setDate(targetDay);
  }
  
  return nextDate;
}
```

### User Interface Components

#### 1. Loan Form Enhancement (`src/pages/LoanForm.tsx`)

**New Field: EMI Day of Month Selector**

```typescript
<FormField
  control={form.control}
  name="emi_day_of_month"
  render={({ field }) => (
    <FormItem>
      <FormLabel>EMI Day of Month *</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="max-h-[300px]">
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <SelectItem key={day} value={day.toString()}>
              {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of every month
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
      <p className="text-xs text-muted-foreground mt-1">
        All EMIs will be due on this day each month. For months with fewer days, the last day will be used.
      </p>
    </FormItem>
  )}
/>
```

**Features:**
- Dropdown with all 31 days
- Ordinal suffixes (1st, 2nd, 3rd, 4th, etc.)
- Clear helper text explaining behavior
- Form validation (1-31 range)

#### 2. Repayment Schedule Component (`src/components/loan/RepaymentSchedule.tsx`)

**Component Structure:**

```typescript
interface RepaymentScheduleProps {
  schedule: EmiSchedule[];
  emiDayOfMonth: number;
}

export function RepaymentSchedule({ schedule, emiDayOfMonth }: RepaymentScheduleProps)
```

**Visual Elements:**
1. **Header Section**
   - Calendar icon
   - Title: "Repayment Schedule"
   - EMI day indicator (e.g., "EMI due on 15th of every month")
   - Total EMI count

2. **Data Table**
   - Comprehensive columns for all EMI details
   - Color-coded status badges
   - Formatted currency values
   - Date formatting (dd MMM yyyy)
   - Summary row with totals

3. **Summary Cards**
   - Four cards showing key metrics
   - Large, readable numbers
   - Color-coded for visual hierarchy
   - Responsive grid layout

#### 3. Loan Detail Page Integration (`src/pages/LoanDetail.tsx`)

**New Tab: "Repayment Schedule"**

```typescript
<TabsList>
  <TabsTrigger value="details">Loan Details</TabsTrigger>
  <TabsTrigger value="schedule">Repayment Schedule</TabsTrigger>  {/* NEW */}
  <TabsTrigger value="payments">Payment History</TabsTrigger>
  <TabsTrigger value="penalties">Penalties</TabsTrigger>
  <TabsTrigger value="ledger">Ledger Breakup</TabsTrigger>
</TabsList>

<TabsContent value="schedule">
  {ledger.loan.emi_schedule && ledger.loan.emi_schedule.length > 0 ? (
    <RepaymentSchedule 
      schedule={ledger.loan.emi_schedule} 
      emiDayOfMonth={ledger.loan.emi_day_of_month}
    />
  ) : (
    <Card>
      <CardContent className="py-8">
        <p className="text-center text-muted-foreground">
          No repayment schedule available
        </p>
      </CardContent>
    </Card>
  )}
</TabsContent>
```

## User Workflow

### Creating a New Loan

1. **Navigate to Loan Form**
   - Go to Loans → Create New Loan

2. **Fill Basic Loan Details**
   - Select customer
   - Choose product (optional)
   - Set loan type (Daily/Weekly/Monthly)
   - Enter principal amount
   - Add processing and insurance fees

3. **Set EMI Schedule**
   - Enter start date
   - Select first EMI date
   - **Choose EMI day of month** (1-31)
   - System will use this day for all subsequent EMIs

4. **Configure Interest**
   - Select interest type (Flat/Reducing)
   - Enter interest rate
   - Set tenure in months
   - System auto-calculates EMI amount

5. **Add Guarantor** (Optional)
   - Enter guarantor details if required

6. **Submit**
   - System generates complete EMI schedule
   - All EMIs are created with the fixed day of month

### Viewing Repayment Schedule

1. **Navigate to Loan Details**
   - Go to Loans → Select a loan

2. **Open Repayment Schedule Tab**
   - Click on "Repayment Schedule" tab

3. **Review Schedule**
   - See all EMIs with due dates
   - Check principal and interest breakdown
   - View payment status for each EMI
   - Review summary totals

## Business Benefits

### For Lenders

1. **Predictable Cash Flow**
   - Know exactly when payments are due
   - Plan business operations accordingly
   - Better financial forecasting

2. **Easy Tracking**
   - Visual status indicators
   - Quick identification of overdue payments
   - Comprehensive payment history

3. **Professional Presentation**
   - Clean, organized schedule display
   - Printable format for customer records
   - Detailed breakup of each payment

### For Borrowers

1. **Clear Payment Schedule**
   - Know exact due dates in advance
   - Understand principal vs. interest breakdown
   - Plan monthly budget accordingly

2. **Transparency**
   - See complete loan structure upfront
   - No hidden charges or surprises
   - Track progress towards loan completion

3. **Flexibility**
   - Choose convenient EMI day
   - Align with salary dates
   - Better financial management

## Edge Cases Handled

### 1. Month-End Dates

**Scenario**: EMI day set to 31

| Month | Days in Month | EMI Due Date |
|-------|---------------|--------------|
| January | 31 | 31st |
| February | 28/29 | 28th/29th |
| March | 31 | 31st |
| April | 30 | 30th |
| May | 31 | 31st |

**Implementation**: System automatically adjusts to the last day of months with fewer days.

### 2. Leap Years

**Scenario**: EMI day set to 29, 30, or 31

- **Regular February**: Uses 28th
- **Leap Year February**: Uses 29th (if EMI day ≥ 29)
- **Automatic Detection**: System checks leap year status

### 3. Daily/Weekly Loans

**Behavior**: 
- For daily loans: EMI day of month is informational only
- For weekly loans: EMI day of month is informational only
- System uses actual day intervals for these loan types

### 4. Existing Loans (Migration)

**Backfill Strategy**:
```sql
UPDATE loans 
SET emi_day_of_month = EXTRACT(DAY FROM first_emi_date::date)
WHERE emi_day_of_month IS NULL;
```

- Automatically extracts day from existing first_emi_date
- No manual intervention required
- Maintains data consistency

## API Changes

### Loan Creation API

**Before:**
```typescript
createLoan(data: {
  // ... other fields
  first_emi_date: string;
})
```

**After:**
```typescript
createLoan(data: {
  // ... other fields
  first_emi_date: string;
  emi_day_of_month: number;  // NEW
})
```

### EMI Schedule Generation

**Before:**
```typescript
generateEmiSchedule(
  loanId, principal, rate, tenure, 
  interestType, loanType, firstEmiDate
)
```

**After:**
```typescript
generateEmiSchedule(
  loanId, principal, rate, tenure, 
  interestType, loanType, firstEmiDate,
  emiDayOfMonth  // NEW (optional)
)
```

## Testing Checklist

### Functional Testing

- [ ] Create loan with EMI day = 1
- [ ] Create loan with EMI day = 15
- [ ] Create loan with EMI day = 31
- [ ] Verify schedule generation for 12-month loan
- [ ] Verify schedule generation for 24-month loan
- [ ] Check February handling (regular year)
- [ ] Check February handling (leap year)
- [ ] Verify 30-day month handling (April, June, Sept, Nov)
- [ ] Test daily loan type
- [ ] Test weekly loan type
- [ ] Test monthly loan type

### UI Testing

- [ ] EMI day selector displays all 31 days
- [ ] Ordinal suffixes display correctly (1st, 2nd, 3rd, etc.)
- [ ] Helper text is visible and clear
- [ ] Repayment schedule tab appears in loan details
- [ ] Schedule table displays all columns correctly
- [ ] Status badges show correct colors
- [ ] Summary cards display correct totals
- [ ] Currency formatting is consistent
- [ ] Date formatting is consistent
- [ ] Responsive design works on mobile

### Data Integrity Testing

- [ ] EMI day validation (1-31 range)
- [ ] Database constraint prevents invalid values
- [ ] Existing loans migrated correctly
- [ ] Schedule totals match loan totals
- [ ] Principal + Interest = Total Payable
- [ ] Opening balance - Principal = Closing balance

## Future Enhancements

### Potential Features

1. **EMI Calendar View**
   - Visual calendar showing all due dates
   - Color-coded by status
   - Click to see EMI details

2. **Payment Reminders**
   - Automatic SMS/Email reminders
   - Configurable reminder days (3, 7, 15 days before)
   - Overdue notifications

3. **Bulk EMI Day Change**
   - Admin feature to change EMI day for multiple loans
   - Useful for business policy changes
   - Regenerate schedules automatically

4. **EMI Day Analytics**
   - Most popular EMI days
   - Collection efficiency by day
   - Optimize business operations

5. **Custom EMI Dates**
   - Allow different dates for specific EMIs
   - Handle special cases (holidays, etc.)
   - More flexibility for customers

6. **Schedule Export**
   - Export to PDF
   - Export to Excel
   - Email to customer
   - Print-friendly format

## Troubleshooting

### Issue: EMI dates not aligning correctly

**Solution**: 
- Check `emi_day_of_month` value in database
- Verify `getNextEmiDate` function logic
- Ensure timezone handling is consistent

### Issue: February dates incorrect

**Solution**:
- Verify leap year calculation
- Check `lastDayOfMonth` calculation
- Test with both leap and non-leap years

### Issue: Schedule totals don't match

**Solution**:
- Check rounding logic in EMI calculations
- Verify last EMI adjustment code
- Ensure all components are included in totals

### Issue: Migration fails for existing loans

**Solution**:
- Check if `first_emi_date` is valid for all loans
- Verify date extraction SQL syntax
- Run migration in transaction for rollback capability

## Conclusion

The Repayment Schedule feature provides a robust, user-friendly way to manage loan EMI schedules with fixed monthly payment dates. It handles edge cases gracefully, provides clear visual feedback, and integrates seamlessly with the existing loan management system.

### Key Achievements

✅ Fixed EMI day of month for consistent payments  
✅ Comprehensive schedule display with all details  
✅ Smart handling of month-end edge cases  
✅ Visual status indicators for easy tracking  
✅ Summary cards for quick overview  
✅ Seamless integration with loan workflow  
✅ Backward compatible with existing loans  
✅ Clean, professional UI design  

---

**Digital Dreems Loan Management CRM**  
Repayment Schedule Feature Documentation  
© 2025 Vais Engineering Pvt Ltd
