# EMI Repayment Schedule - Visual Guide

## 🎯 Feature Overview

The EMI Repayment Schedule feature provides a comprehensive view of all loan payments with a fixed day of the month for consistent EMI collection.

---

## 📋 Loan Form - EMI Day Selection

### Location
**Loans → Create New Loan → Loan Details Tab**

### New Field: EMI Day of Month

```
┌─────────────────────────────────────────────────────────┐
│  EMI Day of Month *                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Select day                                    ▼  │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Dropdown Options:                                      │
│  • 1st of every month                                   │
│  • 2nd of every month                                   │
│  • 3rd of every month                                   │
│  • ...                                                  │
│  • 31st of every month                                  │
│                                                         │
│  ℹ️ All EMIs will be due on this day each month.       │
│     For months with fewer days, the last day will      │
│     be used.                                            │
└─────────────────────────────────────────────────────────┘
```

### Example Selection
```
Selected: 15th of every month

Result:
✓ January 15, 2025
✓ February 15, 2025
✓ March 15, 2025
✓ April 15, 2025
... and so on
```

---

## 📊 Repayment Schedule Display

### Location
**Loans → Select Loan → Repayment Schedule Tab**

### Header Section
```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Repayment Schedule                    Total EMIs            │
│  EMI due on 15th of every month                12               │
└─────────────────────────────────────────────────────────────────┘
```

### Schedule Table
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ EMI # │ Due Date      │ Principal │ Interest │ EMI Amount │ Opening   │ Closing   │ Paid    │ Status  │ Paid Date    │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  #1   │ 15 Jan 2025   │ ₹8,333    │ ₹1,000   │ ₹9,333     │ ₹100,000  │ ₹91,667   │ ₹9,333  │ 🟢 Paid │ 15 Jan 2025  │
│  #2   │ 15 Feb 2025   │ ₹8,333    │ ₹917     │ ₹9,250     │ ₹91,667   │ ₹83,334   │ ₹0      │ 🔵 Pending │ -         │
│  #3   │ 15 Mar 2025   │ ₹8,333    │ ₹833     │ ₹9,166     │ ₹83,334   │ ₹75,001   │ ₹0      │ 🔵 Pending │ -         │
│  #4   │ 15 Apr 2025   │ ₹8,333    │ ₹750     │ ₹9,083     │ ₹75,001   │ ₹66,668   │ ₹0      │ 🔵 Pending │ -         │
│  #5   │ 15 May 2025   │ ₹8,333    │ ₹667     │ ₹9,000     │ ₹66,668   │ ₹58,335   │ ₹0      │ 🔵 Pending │ -         │
│  ...  │ ...           │ ...       │ ...      │ ...        │ ...       │ ...       │ ...     │ ...     │ ...          │
│  #12  │ 15 Dec 2025   │ ₹8,333    │ ₹83      │ ₹8,416     │ ₹8,333    │ ₹0        │ ₹0      │ 🔵 Pending │ -         │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Total │               │ ₹100,000  │ ₹10,000  │ ₹110,000   │           │           │ ₹9,333  │         │              │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Summary Cards
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Total Principal     │  │ Total Interest      │  │ Total Payable       │  │ Total Paid          │
│                     │  │                     │  │                     │  │                     │
│   ₹1,00,000        │  │   ₹10,000          │  │   ₹1,10,000        │  │   ₹9,333           │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 🎨 Status Indicators

### Visual Legend
```
🟢 Paid       - EMI has been fully paid
🔵 Pending    - EMI is due but not yet paid
🔴 Overdue    - EMI is past due date and unpaid
🟡 Partial    - EMI is partially paid
```

### Status Examples
```
┌─────────────────────────────────────────────────────┐
│  Status: 🟢 Paid                                    │
│  • Full EMI amount received                         │
│  • Paid date recorded                               │
│  • Closing balance updated                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Status: 🔵 Pending                                 │
│  • EMI not yet paid                                 │
│  • Due date in future or today                      │
│  • Awaiting payment                                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Status: 🔴 Overdue                                 │
│  • EMI past due date                                │
│  • Payment not received                             │
│  • Action required                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Status: 🟡 Partial                                 │
│  • Partial payment received                         │
│  • Balance remaining                                │
│  • Follow-up needed                                 │
└─────────────────────────────────────────────────────┘
```

---

## 📅 Month-End Date Handling

### Scenario: EMI Day = 31st

```
┌─────────────────────────────────────────────────────────────┐
│  Month        │ Days │ EMI Due Date │ Explanation           │
├─────────────────────────────────────────────────────────────┤
│  January      │  31  │  31 Jan      │ ✓ Exact day          │
│  February     │  28  │  28 Feb      │ ⚠️ Adjusted to last  │
│  March        │  31  │  31 Mar      │ ✓ Exact day          │
│  April        │  30  │  30 Apr      │ ⚠️ Adjusted to last  │
│  May          │  31  │  31 May      │ ✓ Exact day          │
│  June         │  30  │  30 Jun      │ ⚠️ Adjusted to last  │
│  July         │  31  │  31 Jul      │ ✓ Exact day          │
│  August       │  31  │  31 Aug      │ ✓ Exact day          │
│  September    │  30  │  30 Sep      │ ⚠️ Adjusted to last  │
│  October      │  31  │  31 Oct      │ ✓ Exact day          │
│  November     │  30  │  30 Nov      │ ⚠️ Adjusted to last  │
│  December     │  31  │  31 Dec      │ ✓ Exact day          │
└─────────────────────────────────────────────────────────────┘

Legend:
✓ = Exact day used
⚠️ = Adjusted to last day of month
```

### Scenario: EMI Day = 15th

```
┌─────────────────────────────────────────────────────────────┐
│  Month        │ Days │ EMI Due Date │ Explanation           │
├─────────────────────────────────────────────────────────────┤
│  January      │  31  │  15 Jan      │ ✓ Exact day          │
│  February     │  28  │  15 Feb      │ ✓ Exact day          │
│  March        │  31  │  15 Mar      │ ✓ Exact day          │
│  April        │  30  │  15 Apr      │ ✓ Exact day          │
│  May          │  31  │  15 May      │ ✓ Exact day          │
│  June         │  30  │  15 Jun      │ ✓ Exact day          │
│  July         │  31  │  15 Jul      │ ✓ Exact day          │
│  August       │  31  │  15 Aug      │ ✓ Exact day          │
│  September    │  30  │  15 Sep      │ ✓ Exact day          │
│  October      │  31  │  15 Oct      │ ✓ Exact day          │
│  November     │  30  │  15 Nov      │ ✓ Exact day          │
│  December     │  31  │  15 Dec      │ ✓ Exact day          │
└─────────────────────────────────────────────────────────────┘

Legend:
✓ = Exact day used (no adjustments needed)
```

---

## 💡 Best Practices

### Recommended EMI Days

```
┌─────────────────────────────────────────────────────────────┐
│  Day Range  │ Recommendation │ Reason                       │
├─────────────────────────────────────────────────────────────┤
│  1-7        │ ⭐⭐⭐⭐⭐     │ Start of month, consistent   │
│  8-14       │ ⭐⭐⭐⭐⭐     │ After salary, consistent     │
│  15-21      │ ⭐⭐⭐⭐⭐     │ Mid-month, always consistent │
│  22-27      │ ⭐⭐⭐⭐       │ Late month, consistent       │
│  28-31      │ ⭐⭐⭐         │ Month-end, may adjust        │
└─────────────────────────────────────────────────────────────┘
```

### Customer Scenarios

```
┌─────────────────────────────────────────────────────────────┐
│  Scenario                    │ Recommended EMI Day          │
├─────────────────────────────────────────────────────────────┤
│  Salary on 1st               │ 5th (4 days buffer)          │
│  Salary on 15th              │ 20th (5 days buffer)         │
│  Salary on last day          │ 5th of next month            │
│  Mid-month salary            │ 15th or 20th                 │
│  Weekly income               │ 1st (start of month)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Diagram

### Loan Creation with EMI Schedule

```
┌─────────────────┐
│  Start          │
│  Create Loan    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fill Customer  │
│  Details        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enter Loan     │
│  Amount &       │
│  Tenure         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Select EMI     │
│  Day of Month   │  ◄── NEW STEP
│  (1-31)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  System         │
│  Generates      │
│  Complete       │
│  Schedule       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Review &       │
│  Submit         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Loan Created   │
│  Schedule Ready │
└─────────────────┘
```

### Viewing Schedule

```
┌─────────────────┐
│  Open Loan      │
│  Details        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click          │
│  "Repayment     │
│  Schedule" Tab  │  ◄── NEW TAB
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  View Complete  │
│  EMI Schedule   │
│  • All dates    │
│  • Breakup      │
│  • Status       │
│  • Totals       │
└─────────────────┘
```

---

## 📱 Responsive Design

### Desktop View
```
┌────────────────────────────────────────────────────────────────┐
│  Full table with all columns visible                           │
│  • EMI #                                                       │
│  • Due Date                                                    │
│  • Principal, Interest, EMI Amount                             │
│  • Opening Balance, Closing Balance                            │
│  • Paid Amount, Status, Paid Date                              │
│                                                                │
│  Summary cards in 4-column grid                                │
│  [Principal] [Interest] [Payable] [Paid]                       │
└────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────┐
│  Scrollable table    │
│  • Key columns       │
│  • Horizontal scroll │
│                      │
│  Summary cards       │
│  stacked vertically  │
│  [Principal]         │
│  [Interest]          │
│  [Payable]           │
│  [Paid]              │
└──────────────────────┘
```

---

## 🎯 Quick Tips

### For Administrators
```
✓ Choose EMI day based on customer's salary date
✓ Avoid days 28-31 for consistency
✓ Mid-month (10-20) is safest
✓ Review schedule before finalizing loan
✓ Use schedule for collection planning
```

### For Collection Agents
```
✓ Check "Pending" EMIs in schedule
✓ Follow up before due date
✓ Use status indicators for priority
✓ Track overdue EMIs (red badges)
✓ Update payment status promptly
```

### For Customers
```
✓ Review complete schedule before accepting loan
✓ Note all due dates in calendar
✓ Set reminders 2-3 days before EMI date
✓ Check schedule regularly for payment status
✓ Contact if payment date needs adjustment
```

---

## 📞 Support

**Need Help?**
- System: Digital Dreems Loan Management CRM
- Developer: Vais Engineering Pvt Ltd
- Feature: EMI Repayment Schedule

**Documentation:**
- Full Guide: `REPAYMENT_SCHEDULE_FEATURE.md`
- Quick Reference: `EMI_SCHEDULE_QUICK_GUIDE.md`
- Implementation: `IMPLEMENTATION_SUMMARY_EMI_SCHEDULE.md`

---

**© 2025 Vais Engineering Pvt Ltd**  
**Digital Dreems Loan Management CRM**
