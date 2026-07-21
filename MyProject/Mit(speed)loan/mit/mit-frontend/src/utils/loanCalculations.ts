/**
 * Loan Calculation Utilities
 * Implements banking-standard reducing balance calculations
 */

import type { Loan, EmiPayment, Penalty } from '@/types/types';

export interface LedgerEntry {
  date: string;
  description: string;
  debit: number;
  credit: number;
  principal: number;
  interest: number;
  fees: number;
  penalty: number;
  balance: number;
  outstandingPrincipal: number;
  outstandingFees: number;
}

/**
 * Calculate reducing balance interest for a period
 * Formula: Interest = Outstanding Principal × (Annual Rate / 365) × Days / 100
 * Uses daily interest calculation for accuracy
 */
export function calculateReducingInterest(
  outstandingPrincipal: number,
  annualRate: number,
  days: number = 30
): number {
  const dailyRate = annualRate / 365 / 100;
  return Math.round(outstandingPrincipal * dailyRate * days);
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate EMI using reducing balance method
 * Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 * Where: P = Principal, r = Monthly Rate, n = Tenure in months
 */
export function calculateReducingEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (annualRate === 0) {
    return Math.round(principal / tenureMonths);
  }

  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi);
}

/**
 * Generate complete loan ledger with reducing balance calculation
 * Uses daily interest calculation based on actual payment dates
 * Early payments = less interest, Late payments = more interest (no auto-penalty)
 * Payment allocation order: Fees → Penalties → Interest → Principal
 */
export function generateLoanLedger(
  loan: Loan,
  payments: EmiPayment[],
  penalties: Penalty[]
): LedgerEntry[] {
  const ledger: LedgerEntry[] = [];
  let outstandingPrincipal = Math.round(loan.principal_amount);
  let outstandingFees = Math.round(loan.processing_fee + loan.insurance_fee);
  let totalInterestPaid = 0;
  let totalPenaltiesPaid = 0;
  let lastPaymentDate = loan.start_date;

  // Sort payments and penalties by date
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime()
  );
  const sortedPenalties = [...penalties].sort(
    (a, b) => new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()
  );

  // Calculate initial total payable
  let totalPayable = Math.round(loan.principal_amount + loan.processing_fee + loan.insurance_fee);
  // For flat rate, add full interest upfront
  if (loan.interest_type === 'flat') {
    totalPayable += Math.round(loan.total_interest);
  }

  // Initial loan disbursement entry (includes all charges)
  ledger.push({
    date: loan.start_date,
    description: 'Loan Disbursed (Principal + Fees)',
    debit: totalPayable,
    credit: 0,
    principal: Math.round(loan.principal_amount),
    interest: loan.interest_type === 'flat' ? Math.round(loan.total_interest) : 0,
    fees: 0,
    penalty: 0,
    balance: totalPayable,
    outstandingPrincipal: Math.round(loan.principal_amount),
    outstandingFees: Math.round(loan.processing_fee + loan.insurance_fee),
  });

  // Merge payments and penalties into chronological order
  const allTransactions: Array<{ type: 'payment' | 'penalty'; date: string; data: any }> = [
    ...sortedPayments.map((p) => ({ type: 'payment' as const, date: p.payment_date, data: p })),
    ...sortedPenalties.map((p) => ({ type: 'penalty' as const, date: p.applied_at, data: p })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Track unpaid penalties
  let unpaidPenalties = 0;

  // Process each transaction
  for (const transaction of allTransactions) {
    if (transaction.type === 'penalty') {
      const penalty = transaction.data as Penalty;
      const penaltyAmount = Math.round(penalty.amount);
      unpaidPenalties += penaltyAmount;
      totalPayable += penaltyAmount;

      const currentBalance = outstandingFees +
        outstandingPrincipal +
        (loan.interest_type === 'reducing' ? 0 : Math.round(loan.total_interest - totalInterestPaid)) +
        unpaidPenalties;

      ledger.push({
        date: penalty.applied_at,
        description: `Penalty: ${penalty.reason}`,
        debit: penaltyAmount,
        credit: 0,
        principal: 0,
        interest: 0,
        fees: 0,
        penalty: penaltyAmount,
        balance: Math.round(currentBalance),
        outstandingPrincipal,
        outstandingFees,
      });
    } else {
      const payment = transaction.data as EmiPayment;
      // Round payment amount to handle any db oddities, though usually db has decent precision
      let remainingPayment = Math.round(payment.amount_paid);
      let feesPayment = 0;
      let interestPayment = 0;
      let principalPayment = 0;
      let penaltyPayment = 0;

      // 1. Pay Fees (Processing + Insurance)
      if (outstandingFees > 0) {
        feesPayment = Math.min(remainingPayment, outstandingFees);
        outstandingFees -= feesPayment;
        remainingPayment -= feesPayment;
      }

      // 2. Pay Penalties (Real penalties)
      if (remainingPayment > 0 && unpaidPenalties > 0) {
        penaltyPayment = Math.min(remainingPayment, unpaidPenalties);
        unpaidPenalties -= penaltyPayment;
        totalPenaltiesPaid += penaltyPayment;
        remainingPayment -= penaltyPayment;
      }

      // 3. Pay Interest
      if (remainingPayment > 0 && outstandingPrincipal > 0) {
        if (loan.interest_type === 'reducing') {
          const days = daysBetween(lastPaymentDate, payment.payment_date);
          const accruedInterest = calculateReducingInterest(outstandingPrincipal, loan.interest_rate, days); // Already rounded

          interestPayment = Math.min(remainingPayment, accruedInterest);
          totalInterestPaid += interestPayment;
          remainingPayment -= interestPayment;
        } else {
          // For FLAT rate: Apportion Interest based on percentage of EMI paid.
          const totalEmi = Math.round(loan.installment_amount || 1);
          const monthlyInterest = Math.round(loan.total_interest / (loan.tenure_months || 1));

          const emiRatio = payment.amount_paid / totalEmi;

          let maxInterestForThisPayment = emiRatio * monthlyInterest;
          maxInterestForThisPayment = Math.round(maxInterestForThisPayment);

          const remainingTotalInterest = Math.round(loan.total_interest - totalInterestPaid);
          const interestToPay = Math.min(remainingPayment, maxInterestForThisPayment, remainingTotalInterest);

          interestPayment = interestToPay;
          totalInterestPaid += interestPayment;
          remainingPayment -= interestPayment;
        }
      }

      // 4. Pay Principal
      if (remainingPayment > 0 && outstandingPrincipal > 0) {
        principalPayment = Math.min(remainingPayment, outstandingPrincipal);
        outstandingPrincipal -= principalPayment;
        remainingPayment -= principalPayment;
      }

      lastPaymentDate = payment.payment_date;

      const currentBalance = outstandingFees +
        outstandingPrincipal +
        (loan.interest_type === 'reducing' ? 0 : Math.round(loan.total_interest - totalInterestPaid)) +
        unpaidPenalties;

      ledger.push({
        date: payment.payment_date,
        description: `Payment - ${payment.payment_mode}${payment.transaction_reference ? ` (${payment.transaction_reference})` : ''}`,
        debit: 0,
        credit: Math.round(payment.amount_paid),
        principal: principalPayment,
        interest: interestPayment,
        fees: feesPayment,
        penalty: penaltyPayment,
        balance: Math.max(0, currentBalance),
        outstandingPrincipal: Math.max(0, outstandingPrincipal),
        outstandingFees: Math.max(0, outstandingFees),
      });
    }
  }

  return ledger;
}

/**
 * Calculate remaining interest based on outstanding principal
 */
function calculateRemainingInterest(loan: Loan, outstandingPrincipal: number): number {
  if (loan.interest_type === 'reducing') {
    const principalPaid = loan.principal_amount - outstandingPrincipal;
    const principalRatio = principalPaid / loan.principal_amount;
    return Math.round(loan.total_interest * (1 - principalRatio));
  } else {
    return Math.round(loan.total_interest);
  }
}

/**
 * Calculate loan summary
 */
export interface LoanSummary {
  totalPaid: number;
  principalPaid: number;
  interestPaid: number;
  feesPaid: number;
  penaltiesPaid: number;
  outstandingPrincipal: number;
  outstandingInterest: number;
  outstandingPenalties: number;
  outstandingFees: number;
  totalOutstanding: number;
  totalPayable: number;
}

export function calculateLoanSummary(ledger: LedgerEntry[], loan: Loan): LoanSummary {
  const totalPaid = ledger.reduce((sum, entry) => sum + entry.credit, 0);
  const principalPaid = ledger.reduce((sum, entry) => sum + (entry.credit > 0 ? entry.principal : 0), 0);
  const interestPaid = ledger.reduce((sum, entry) => sum + (entry.credit > 0 ? entry.interest : 0), 0);
  const feesPaid = ledger.reduce((sum, entry) => sum + (entry.credit > 0 ? entry.fees : 0), 0);
  const penaltiesPaid = ledger.reduce((sum, entry) => sum + (entry.credit > 0 ? entry.penalty : 0), 0);

  const lastEntry = ledger[ledger.length - 1];
  const outstandingPrincipal = lastEntry?.outstandingPrincipal || 0;
  const outstandingFees = lastEntry?.outstandingFees || 0;
  const totalOutstanding = lastEntry?.balance || 0;

  const totalPenalties = ledger.reduce((sum, entry) => sum + (entry.debit > 0 ? entry.penalty : 0), 0);
  const outstandingPenalties = totalPenalties - penaltiesPaid;

  const outstandingInterest = totalOutstanding - outstandingPrincipal - outstandingPenalties - outstandingFees;

  const totalPayable = ledger.reduce((sum, entry) => sum + entry.debit, 0);

  return {
    totalPaid,
    principalPaid,
    interestPaid,
    feesPaid,
    penaltiesPaid,
    outstandingPrincipal: Math.max(0, outstandingPrincipal),
    outstandingInterest: Math.max(0, outstandingInterest),
    outstandingPenalties: Math.max(0, outstandingPenalties),
    outstandingFees: Math.max(0, outstandingFees),
    totalOutstanding: Math.max(0, totalOutstanding),
    totalPayable: totalPayable,
  };
}

// ... rest of the file ...
export function isLoanDelayed(loan: Loan, summary: LoanSummary): boolean {
  if (summary.totalOutstanding <= 0) return false;
  if (!loan.first_emi_date) return false;
  const today = new Date();
  const firstEmiDate = new Date(loan.first_emi_date);
  if (firstEmiDate > today) return false;

  const daysSinceFirstEmi = Math.floor((today.getTime() - firstEmiDate.getTime()) / (1000 * 60 * 60 * 24));
  let expectedPayments = 0;
  if (loan.loan_type === 'daily') expectedPayments = daysSinceFirstEmi;
  else if (loan.loan_type === 'weekly') expectedPayments = Math.floor(daysSinceFirstEmi / 7);
  else expectedPayments = Math.floor(daysSinceFirstEmi / 30);

  expectedPayments = Math.min(expectedPayments, loan.tenure_months || 0);
  const expectedAmountPaid = (loan.installment_amount || 0) * expectedPayments;
  return summary.totalPaid < expectedAmountPaid;
}

export function calculateDaysDelayed(loan: Loan, summary: LoanSummary): number {
  if (!isLoanDelayed(loan, summary)) return 0;
  if (!loan.first_emi_date) return 0;

  const today = new Date();
  const firstEmiDate = new Date(loan.first_emi_date);
  const daysSinceFirstEmi = Math.floor((today.getTime() - firstEmiDate.getTime()) / (1000 * 60 * 60 * 24));

  let expectedPayments = 0;
  let daysBetweenPayments = 30;

  if (loan.loan_type === 'daily') { expectedPayments = daysSinceFirstEmi; daysBetweenPayments = 1; }
  else if (loan.loan_type === 'weekly') { expectedPayments = Math.floor(daysSinceFirstEmi / 7); daysBetweenPayments = 7; }
  else { expectedPayments = Math.floor(daysSinceFirstEmi / 30); daysBetweenPayments = 30; }

  expectedPayments = Math.min(expectedPayments, loan.tenure_months || 0);
  const actualPaymentsMade = Math.floor(summary.totalPaid / (loan.installment_amount || 1));
  const missedPayments = Math.max(0, expectedPayments - actualPaymentsMade);
  return missedPayments * daysBetweenPayments;
}
