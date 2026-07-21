# Delayed EMI Logic - Quick Reference Guide

## Understanding Delayed Status

### What Makes a Loan "Delayed"?

A loan is marked as **DELAYED** when:
1. ✅ Loan has started (first EMI date has passed)
2. ✅ Loan has outstanding balance
3. ✅ **Actual payments < Expected payments**

A loan is **NOT DELAYED** when:
- ❌ Loan hasn't started yet (first EMI date in future)
- ❌ Loan is fully paid (no outstanding balance)
- ❌ **Actual payments ≥ Expected payments** (on schedule or ahead)

## Calculation Formula

### Expected Payments
```
Daily Loan:
  Expected Payments = Days since first EMI

Weekly Loan:
  Expected Payments = Days since first EMI ÷ 7

Monthly/EMI Loan:
  Expected Payments = Days since first EMI ÷ 30

Note: Capped at total tenure (can't expect more than total EMIs)
```

### Expected Amount
```
Expected Amount = Installment Amount × Expected Payments
```

### Delayed Status
```
If Actual Paid < Expected Amount:
  Status = DELAYED
Else:
  Status = ON TIME
```

### Days Delayed
```
Actual Payments Made = Total Paid ÷ Installment Amount
Missed Payments = Expected Payments - Actual Payments Made
Days Delayed = Missed Payments × Days Between Payments

Where Days Between Payments:
  - Daily: 1 day
  - Weekly: 7 days
  - Monthly/EMI: 30 days
```

## Real-World Examples

### Example 1: Monthly Loan - On Time ✅

**Loan Details:**
- Amount: ₹60,000
- Tenure: 12 months
- EMI: ₹5,000/month
- Start Date: January 1, 2025
- First EMI Date: January 1, 2025

**Today: February 15, 2025**

**Calculation:**
```
Days since first EMI: 45 days
Expected payments: 45 ÷ 30 = 1.5 → 1 payment (floor)
Expected amount: ₹5,000 × 1 = ₹5,000

Customer paid: ₹5,000 on January 5

Actual paid (₹5,000) ≥ Expected (₹5,000)
Status: NOT DELAYED ✅
```

**Dashboard:** Will NOT appear in delayed count
**Report:** Will NOT appear in delayed EMIs list

---

### Example 2: Monthly Loan - Delayed ❌

**Loan Details:**
- Amount: ₹60,000
- Tenure: 12 months
- EMI: ₹5,000/month
- Start Date: January 1, 2025
- First EMI Date: January 1, 2025

**Today: March 15, 2025**

**Calculation:**
```
Days since first EMI: 73 days
Expected payments: 73 ÷ 30 = 2.43 → 2 payments (floor)
Expected amount: ₹5,000 × 2 = ₹10,000

Customer paid: ₹5,000 on January 5

Actual paid (₹5,000) < Expected (₹10,000)
Status: DELAYED ❌

Days Delayed Calculation:
Actual payments made: ₹5,000 ÷ ₹5,000 = 1
Missed payments: 2 - 1 = 1
Days delayed: 1 × 30 = 30 days
```

**Dashboard:** Shows in delayed count
**Report:** Shows as 30 days delayed

---

### Example 3: Weekly Loan - On Time ✅

**Loan Details:**
- Amount: ₹10,000
- Tenure: 10 weeks
- EMI: ₹1,000/week
- Start Date: January 1, 2025
- First EMI Date: January 1, 2025

**Today: January 22, 2025**

**Calculation:**
```
Days since first EMI: 21 days
Expected payments: 21 ÷ 7 = 3 payments
Expected amount: ₹1,000 × 3 = ₹3,000

Customer paid: ₹3,000 (3 payments made)

Actual paid (₹3,000) ≥ Expected (₹3,000)
Status: NOT DELAYED ✅
```

---

### Example 4: Daily Loan - Delayed ❌

**Loan Details:**
- Amount: ₹5,000
- Tenure: 50 days
- EMI: ₹100/day
- Start Date: January 1, 2025
- First EMI Date: January 1, 2025

**Today: January 11, 2025**

**Calculation:**
```
Days since first EMI: 10 days
Expected payments: 10 payments
Expected amount: ₹100 × 10 = ₹1,000

Customer paid: ₹700 (7 payments made)

Actual paid (₹700) < Expected (₹1,000)
Status: DELAYED ❌

Days Delayed Calculation:
Actual payments made: ₹700 ÷ ₹100 = 7
Missed payments: 10 - 7 = 3
Days delayed: 3 × 1 = 3 days
```

---

### Example 5: Catch-Up Payment ✅

**Loan Details:**
- Amount: ₹60,000
- Tenure: 12 months
- EMI: ₹5,000/month
- Start Date: January 1, 2025
- First EMI Date: January 1, 2025

**Timeline:**
- **February 1:** Customer missed January payment
  - Expected: ₹5,000
  - Paid: ₹0
  - Status: DELAYED (30 days) ❌

- **February 15:** Customer pays ₹10,000 (catches up)
  - Expected: ₹5,000 (still only 1 payment due)
  - Paid: ₹10,000
  - Status: NOT DELAYED ✅

**Result:** Loan automatically removed from delayed list!

---

### Example 6: Partial Payment ⚠️

**Loan Details:**
- Amount: ₹60,000
- Tenure: 12 months
- EMI: ₹5,000/month
- Start Date: January 1, 2025
- First EMI Date: January 1, 2025

**Today: February 1, 2025**

**Calculation:**
```
Days since first EMI: 31 days
Expected payments: 31 ÷ 30 = 1.03 → 1 payment
Expected amount: ₹5,000 × 1 = ₹5,000

Customer paid: ₹3,000 (partial payment)

Actual paid (₹3,000) < Expected (₹5,000)
Status: DELAYED ❌

Days Delayed Calculation:
Actual payments made: ₹3,000 ÷ ₹5,000 = 0.6 → 0 (floor)
Missed payments: 1 - 0 = 1
Days delayed: 1 × 30 = 30 days
```

**Note:** Partial payments are counted, but full EMI must be paid to clear delay

---

## Payment Impact Matrix

| Scenario | Expected | Paid | Status | Days Delayed |
|----------|----------|------|--------|--------------|
| On Time | ₹5,000 | ₹5,000 | ✅ Not Delayed | 0 |
| Ahead | ₹5,000 | ₹10,000 | ✅ Not Delayed | 0 |
| Partial | ₹5,000 | ₹3,000 | ❌ Delayed | 30 |
| Missed | ₹5,000 | ₹0 | ❌ Delayed | 30 |
| 2 Missed | ₹10,000 | ₹0 | ❌ Delayed | 60 |
| Catch Up | ₹10,000 | ₹10,000 | ✅ Not Delayed | 0 |

## Automatic Status Updates

### When Loan Becomes Delayed
```
Trigger: When expected amount > actual paid
Action: Automatically added to delayed list
Dashboard: Delayed count increases
Report: Appears in delayed EMIs report
```

### When Loan Clears Delay
```
Trigger: When actual paid ≥ expected amount
Action: Automatically removed from delayed list
Dashboard: Delayed count decreases
Report: Removed from delayed EMIs report
```

### Real-Time Updates
- ✅ Status updates immediately after payment
- ✅ No manual intervention needed
- ✅ Dashboard reflects current state
- ✅ Reports show accurate data

## Common Questions

### Q1: Customer paid on time but shows as delayed?
**A:** Check if payment amount equals or exceeds expected amount. Partial payments may still show as delayed.

### Q2: Customer paid late but doesn't show as delayed?
**A:** If they caught up (paid all expected EMIs), they won't show as delayed. System checks total payments, not individual dates.

### Q3: How to remove a loan from delayed list?
**A:** Customer must pay enough to meet or exceed expected amount. System automatically updates.

### Q4: Days delayed seems wrong?
**A:** Days delayed = missed payments × payment frequency. It's based on missed EMIs, not calendar days.

### Q5: Loan fully paid but still shows delayed?
**A:** This shouldn't happen. If outstanding = 0, loan is automatically not delayed. Check loan status (should be "completed").

## Best Practices

### For Collection Team
1. **Daily Review:** Check delayed EMIs report every morning
2. **Priority Sorting:** Report sorts by days delayed (highest first)
3. **Contact Customers:** Use phone numbers from report
4. **Track Progress:** Monitor as customers make payments
5. **Verify Updates:** Confirm loans removed after payment

### For Management
1. **KPI Monitoring:** Track delayed count trend over time
2. **Collection Rate:** Monitor how quickly delays are cleared
3. **Pattern Analysis:** Identify customers with repeated delays
4. **Policy Decisions:** Use data for penalty and grace period policies

### For Customers
1. **Stay Informed:** Check outstanding balance regularly
2. **Pay On Time:** Meet expected payment schedule
3. **Catch Up:** If delayed, pay multiple EMIs to clear status
4. **Communicate:** Contact office if unable to pay on time

## Technical Notes

### Performance
- Calculations done in real-time
- No caching of delayed status
- Always reflects current database state

### Accuracy
- Uses ledger-based calculations
- Includes all payments and penalties
- Handles partial payments correctly

### Reliability
- Tested with all loan types
- Handles edge cases properly
- Automatic status updates

---

**Remember:** The system is designed to be fair and accurate. Customers who pay on time will never be marked as delayed, and those who catch up are immediately cleared from the delayed list.
