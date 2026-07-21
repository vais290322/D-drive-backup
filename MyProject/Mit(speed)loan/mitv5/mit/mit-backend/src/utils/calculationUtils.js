const EmiSchedule = require('../models/EmiSchedule');

/**
 * Calculate EMI using reducing balance method
 * Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 */
function calculateReducingEMI(principal, annualRate, tenureMonths) {
    if (annualRate === 0) {
        return Math.round(principal / (tenureMonths || 1));
    }

    const monthlyRate = annualRate / 12 / 100;
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    // Safety check
    if (!isFinite(emi) || isNaN(emi)) {
        return Math.round(principal / (tenureMonths || 1));
    }

    return Math.round(emi);
}

/**
 * Regenerate schedule for a loan from scratch (or from current state)
 * @param {Object} loan - The Loan document
 * @param {number} currentOutstandingPrincipal - (Optional) If provided, recalculates from here
 * @param {Array} existingSchedules - (Optional) Existing Paid schedules to preserve
 */
async function generateOrUpdateSchedule(loan, currentOutstandingPrincipal = null, existingSchedules = []) {
    // If no specific outstanding provided, start from scratch
    const startFromScratch = currentOutstandingPrincipal === null;

    // Effective Principal for Calculation = Principal - Down Payment
    // However, if we are mid-way (not scratch), we use the provided outstanding.
    let outstandingPrincipal = 0;

    if (startFromScratch) {
        const downPayment = loan.down_payment || 0;
        outstandingPrincipal = (loan.principal_amount + loan?.processing_fee + loan?.insurance_fee || 0) - downPayment;
        // Ensure strictly non-negative
        outstandingPrincipal = Math.max(0, outstandingPrincipal);
    } else {
        outstandingPrincipal = currentOutstandingPrincipal;
    }

    // Fix: Allow 0% interest rate (don't default to 12 if rate is 0)
    const rate = (loan.interest_rate !== undefined && loan.interest_rate !== null) ? loan.interest_rate : 12;

    // Determine start date and remaining tenure
    let startDate;
    let startEmiNumber = 1;
    let tenure = loan.tenure_months || 12;

    if (!startFromScratch && existingSchedules.length > 0) {
        // We are appending to existing history
        const lastPaid = existingSchedules[existingSchedules.length - 1];
        startEmiNumber = lastPaid.emi_number + 1;

        // Strict Date Logic: Use the next month, same day
        startDate = new Date(lastPaid.due_date);
        startDate.setMonth(startDate.getMonth() + 1);

        // If the original start date had a specific day (e.g. 31st), and next month doesn't (Feb),
        // Javascript setMonth handles it by rolling over.
        // But user requested "exact as user selected". 
        // We need to adhere to the `emi_day_of_month` if present in loan, or infer from first_emi_date.

        // However, usually existing schedules carry the flow. 
        // Let's stick to standard date projection but respect the day if widely available.
        // For now, simple projection is safer for "mid-stream" unless we have the anchor day.

        tenure = Math.max(1, loan.tenure_months - existingSchedules.length);
    } else {
        startDate = new Date(loan.first_emi_date || Date.now());
    }

    // Extract the "Anchor Day" from the Start Date to keep it consistent
    // e.g. if First EMI is 15th Jan, all subsequent should be 15th (or last day of month)
    const anchorDay = startDate.getDate();

    // Calculate New EMI for the REMAINING balance over REMAINING tenure
    let emiAmount = 0;

    if (loan.interest_type === 'flat') {
        if (startFromScratch) {
            // Flat Interest on the LOAN AMOUNT (Principal - Down Payment)
            const totalInterest = (outstandingPrincipal * rate * (tenure / 12)) / 100;
            // Fee logic: Fees are usually upfront, but if part of EMI, add here.
            // Assuming fees are separate or already paid, we focus on Principal+Interest
            emiAmount = (outstandingPrincipal + totalInterest) / tenure;
        } else {
            emiAmount = outstandingPrincipal / tenure;
        }
    } else {
        // Reducing Balance Re-amortization
        emiAmount = calculateReducingEMI(outstandingPrincipal, rate, tenure);
    }

    emiAmount = Math.round(emiAmount);

    // For Flat Rate: Calculate fixed interest component based on ORIGINAL principal
    let flatInterestComponent = 0;
    if (loan.interest_type === 'flat') {
        // Always calculate based on original principal (or effective principal)
        const originalPrincipal = (loan.principal_amount || 0) - (loan.down_payment || 0);
        const totalInterest = (originalPrincipal * rate * (tenure / 12)) / 100;
        flatInterestComponent = totalInterest / tenure;
    }

    const newSchedules = [];

    for (let i = 0; i < tenure; i++) {
        const emiNum = startEmiNumber + i;

        if (emiNum > loan.tenure_months) break;

        // Date Logic: strictly follow the month increment
        const dueDate = new Date(startDate);
        // If i=0, it's the start date.
        // If i>0, we add months.

        // To handle "31st Jan -> 28th Feb -> 31st March" correctly:
        // Set the day to 1, add months, then set day to anchorDay (clamped to max days in month)

        // Since startDate is already the First EMI date, for i=0 we use it directly.
        // For i>0 ...
        if (i > 0) {
            dueDate.setDate(1); // Reset to 1st to avoid overflow
            dueDate.setMonth(dueDate.getMonth() + i);
            const daysInMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).getDate();
            dueDate.setDate(Math.min(anchorDay, daysInMonth));
        }

        let interestComponent = 0;
        let principalComponent = 0;
        const openingBalance = outstandingPrincipal;

        if (loan.interest_type === 'flat') {
            interestComponent = flatInterestComponent;
            principalComponent = emiAmount - interestComponent;
        } else {
            // Reducing
            const monthlyRate = rate / 12 / 100;
            interestComponent = outstandingPrincipal * monthlyRate;
            principalComponent = emiAmount - interestComponent;
        }

        // Adjust last EMI
        if (i === tenure - 1) {
            if (principalComponent > outstandingPrincipal) {
                principalComponent = outstandingPrincipal;
                emiAmount = principalComponent + interestComponent;
            }
        }

        const closingBalance = openingBalance - principalComponent;

        newSchedules.push({
            loan_id: loan._id,
            emi_number: emiNum,
            due_date: dueDate,
            principal_component: Math.round(principalComponent || 0),
            interest_component: Math.round(interestComponent || 0),
            emi_amount: Math.round(emiAmount),
            opening_balance: Math.round(openingBalance || 0),
            closing_balance: Math.round(closingBalance || 0),
            status: 'pending',
            paid_amount: 0
        });

        outstandingPrincipal -= principalComponent;
        if (outstandingPrincipal < 0) outstandingPrincipal = 0;
    }

    return newSchedules;
}

module.exports = {
    calculateReducingEMI,
    generateOrUpdateSchedule
};
