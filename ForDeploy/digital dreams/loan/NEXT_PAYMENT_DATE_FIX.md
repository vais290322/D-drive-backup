# Next Payment Date Fix

## Problem Identified

After making a payment on the Collections page, the "Next EMI Date" column was not updating to show the next unpaid EMI. It continued to display the `first_emi_date` (the date of the first EMI when the loan was created), which never changes.

## Root Cause

In `src/pages/Collections.tsx`, the table was displaying `loan.first_emi_date` for all loans:

```tsx
<TableCell>{formatDate(loan.first_emi_date)}</TableCell>
```

This field is static and represents the date when the first EMI was due, not the next upcoming payment date.

## Solution

### 1. Load EMI Schedules for Active Loans

Updated the `loadActiveLoans()` function to fetch the EMI schedule for each active loan and find the next unpaid EMI:

```typescript
const loansWithSchedule = await Promise.all(
  activeLoans.map(async (loan) => {
    try {
      const emiSchedule = await api.emiSchedule.getByLoan(loan.id);
      // Find the next unpaid EMI
      const nextEmi = emiSchedule.find(emi => 
        emi.status === 'pending' || emi.status === 'overdue' || emi.status === 'partial'
      );
      return {
        ...loan,
        next_emi_date: nextEmi?.due_date || loan.first_emi_date,
        next_emi_status: nextEmi?.status || 'pending',
      };
    } catch (error) {
      console.error(`Error loading EMI schedule for loan ${loan.id}:`, error);
      return {
        ...loan,
        next_emi_date: loan.first_emi_date,
        next_emi_status: 'pending',
      };
    }
  })
);
```

### 2. Display Next EMI Date with Status Indicators

Updated the table to show the actual next payment date with visual indicators:

```tsx
<TableCell>
  <div className="flex items-center gap-2">
    <span>{formatDate((loan as any).next_emi_date || loan.first_emi_date)}</span>
    {isOverdue && (
      <Badge variant="destructive" className="text-xs">Overdue</Badge>
    )}
    {isPartial && (
      <Badge variant="secondary" className="text-xs">Partial</Badge>
    )}
  </div>
</TableCell>
```

### 3. Highlight Overdue Loans

Added visual highlighting for overdue loans:

```tsx
<TableRow 
  key={loan.id} 
  className={isOverdue ? 'bg-red-50 dark:bg-red-950/20' : ''}
>
```

### 4. Updated Delayed EMIs Report

Also updated `src/pages/reports/DelayedEMIsReport.tsx` to show the next overdue EMI date instead of the first EMI date:

- Changed column header from "First EMI Date" to "Next Due Date"
- Loads EMI schedule for each delayed loan
- Finds the first overdue or partial EMI
- Displays that EMI's due date
- Updated CSV export to include the correct date

## How It Works Now

### Collections Page Flow:

1. **Page Load**:
   - Fetches all active loans
   - For each loan, loads its EMI schedule
   - Finds the first EMI with status: `pending`, `overdue`, or `partial`
   - Stores the due date and status

2. **Display**:
   - Shows the next unpaid EMI date (not the first EMI date)
   - Displays "Overdue" badge for overdue EMIs
   - Displays "Partial" badge for partially paid EMIs
   - Highlights overdue loan rows with red background

3. **After Payment**:
   - Payment is recorded via `api.payments.create()`
   - `loadActiveLoans()` is called to refresh the data
   - EMI schedules are reloaded
   - Next unpaid EMI is recalculated
   - Table updates to show the new next payment date

### Delayed EMIs Report Flow:

1. **Report Generation**:
   - Identifies all delayed loans
   - For each delayed loan, loads EMI schedule
   - Finds the first overdue or partial EMI
   - Displays that EMI's due date as "Next Due Date"

2. **Export**:
   - CSV export includes the next due date
   - Print view shows the next due date

## Benefits

✅ **Accurate Information**: Users see the actual next payment date, not a historical date

✅ **Real-Time Updates**: After recording a payment, the next EMI date updates automatically

✅ **Visual Indicators**: Overdue and partial payments are clearly marked with badges

✅ **Better UX**: Collection agents can quickly identify which EMIs are overdue

✅ **Improved Reports**: Delayed EMIs report shows relevant due dates

## Testing Recommendations

1. **Create a loan** with monthly EMIs
2. **Record a payment** for the first EMI
3. **Verify** that the Collections page now shows the second EMI date
4. **Record another payment** for the second EMI
5. **Verify** that it now shows the third EMI date
6. **Skip a payment** and wait for it to become overdue
7. **Verify** that the "Overdue" badge appears
8. **Make a partial payment**
9. **Verify** that the "Partial" badge appears

## Files Modified

1. **src/pages/Collections.tsx**
   - Updated `loadActiveLoans()` to fetch EMI schedules
   - Added logic to find next unpaid EMI
   - Updated table to display next EMI date with status badges
   - Added visual highlighting for overdue loans

2. **src/pages/reports/DelayedEMIsReport.tsx**
   - Updated state to include `nextDueDate`
   - Modified `loadData()` to fetch next overdue EMI date
   - Changed table header from "First EMI Date" to "Next Due Date"
   - Updated CSV export to include next due date

## Impact

- ✅ Collections page shows accurate next payment dates
- ✅ Payment dates update automatically after EMI collection
- ✅ Visual indicators help identify overdue and partial payments
- ✅ Improved user experience for collection agents
- ✅ Better reporting with relevant due dates
