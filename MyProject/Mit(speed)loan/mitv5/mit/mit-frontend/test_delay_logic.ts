import { isLoanDelayed, LoanSummary } from './src/utils/loanCalculations';
import { Loan } from './src/types/types';

// Mock objects
const mockLoan: any = {
    id: '1',
    principal_amount: 10000,
    installment_amount: 1000,
    first_emi_date: '2024-01-01', // Past date
    loan_type: 'monthly',
    tenure_months: 12
};

const mockSummary: any = {
    totalPaid: 0,
    totalOutstanding: 10000
};

// Case 1: 1 day after first EMI (Should be delayed)
const today = new Date('2024-01-02');
// We need to inject "today" into the function or mock Date.
// Since we can't easily mock Date inside the imported function without complex setups,
// I will verify the logic by running the same logic in this script.

function testLogic(loan: any, summary: any, todayDate: Date) {
    if (summary.totalOutstanding <= 0) return false;
    if (!loan.first_emi_date) return false;
    const firstEmiDate = new Date(loan.first_emi_date);
    if (firstEmiDate > todayDate) return false;

    const daysSinceFirstEmi = Math.floor((todayDate.getTime() - firstEmiDate.getTime()) / (1000 * 60 * 60 * 24));
    let expectedPayments = 0;

    console.log(`Days since first EMI: ${daysSinceFirstEmi}`);

    if (loan.loan_type === 'daily') expectedPayments = daysSinceFirstEmi;
    else if (loan.loan_type === 'weekly') expectedPayments = Math.floor(daysSinceFirstEmi / 7);
    else expectedPayments = Math.floor(daysSinceFirstEmi / 30);

    console.log(`Original Logic Expected Payments: ${expectedPayments}`);

    expectedPayments = Math.min(expectedPayments, loan.tenure_months || 0);
    const expectedAmountPaid = (loan.installment_amount || 0) * expectedPayments;

    console.log(`Expected Amount Paid: ${expectedAmountPaid}`);
    console.log(`Total Paid: ${summary.totalPaid}`);

    return summary.totalPaid < expectedAmountPaid;
}

console.log("--- Test Case 1: 1 Day Overdue ---");
console.log("Result:", testLogic(mockLoan, mockSummary, new Date('2024-01-02')));

console.log("\n--- Test Case 2: 31 Days Overdue ---");
console.log("Result:", testLogic(mockLoan, mockSummary, new Date('2024-02-01')));
