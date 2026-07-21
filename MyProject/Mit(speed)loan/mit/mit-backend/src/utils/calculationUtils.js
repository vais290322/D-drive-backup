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
    let outstandingPrincipal = startFromScratch ? (loan.principal_amount || 0) : currentOutstandingPrincipal;
    const rate = loan.interest_rate || 12;

    // Determine start date and remaining tenure
    let startDate;
    let startEmiNumber = 1;
    let tenure = loan.tenure_months || 12;

    if (!startFromScratch && existingSchedules.length > 0) {
        // We are appending to existing history
        const lastPaid = existingSchedules[existingSchedules.length - 1];
        startEmiNumber = lastPaid.emi_number + 1;
        startDate = new Date(lastPaid.due_date);
        startDate.setMonth(startDate.getMonth() + 1); // Next month

        // Remaining tenure is strictly: Total Tenure - EMIs passed
        // This keeps the END DATE same, but lowers the EMI amount.
        tenure = Math.max(1, loan.tenure_months - existingSchedules.length);
    } else {
        startDate = new Date(loan.first_emi_date || Date.now());
    }

    // Calculate New EMI for the REMAINING balance over REMAINING tenure
    let emiAmount = 0;

    if (loan.interest_type === 'flat') {
        // Flat rate logic usually doesn't re-amortize in this simple way, 
        // but for consistency we'll just project remaining balance? 
        // Actually, Flat rate usually implies fixed interest. 
        // If we want "real time change", we assume Reducing Balance.
        // For Flat, we'll just stick to original logic if starting from scratch, 
        // or just divide remaining by tenure? 
        // Let's stick to original formula for Flat to avoid confusion.
        if (startFromScratch) {
            const totalInterest = (outstandingPrincipal * rate * (tenure / 12)) / 100;
            emiAmount = (outstandingPrincipal + totalInterest) / tenure;
        } else {
            // If recalculating flat in middle... it's tricky. 
            // Usually Flat Rate schedules are FIXED. 
            // We will ONLY re-amortize Reducing Balance loans dynamically.
            // For Flat, we just return the original plan for future (maybe minus paid?)
            // But simpler: Return [] and let the caller handle non-reducing.
            // However, to be safe, we'll just calculate a simple division for now.
            emiAmount = outstandingPrincipal / tenure;
        }
    } else {
        // Reducing Balance Re-amortization
        emiAmount = calculateReducingEMI(outstandingPrincipal, rate, tenure);
    }

    emiAmount = Math.round(emiAmount);

    const newSchedules = [];

    for (let i = 0; i < tenure; i++) {
        const emiNum = startEmiNumber + i;

        // Don't go beyond original tenure if we want to keep term fixed
        if (emiNum > loan.tenure_months) break;

        const dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + i);

        let interestComponent = 0;
        let principalComponent = 0;
        const openingBalance = outstandingPrincipal;

        if (loan.interest_type === 'flat') {
            // Simplified flat split
            if (startFromScratch) {
                interestComponent = ((loan.principal_amount * rate * (loan.tenure_months / 12)) / 100) / loan.tenure_months;
            } else {
                // On re-calc, just assume 0 interest for remaining? Or keep ratio?
                // Let's assume standard behavior: Flat rate schedule NEVER changes.
                // We will skip re-calc for Flat in the payment handler.
                interestComponent = 0;
            }
            principalComponent = emiAmount - interestComponent;
        } else {
            // Reducing
            const monthlyRate = rate / 12 / 100;
            interestComponent = outstandingPrincipal * monthlyRate;
            principalComponent = emiAmount - interestComponent;
        }

        // Adjust last EMI to match exact balance if needed
        if (i === tenure - 1) {
            // For the last one, principal component should clear the balance
            // But we stuck to fixed EMI. 
            // Usually we adjust the EMI amount for the last one.
            if (principalComponent > outstandingPrincipal) {
                principalComponent = outstandingPrincipal;
                // interest stays same
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
        // avoid negative
        if (outstandingPrincipal < 0) outstandingPrincipal = 0;
    }

    return newSchedules;
}

module.exports = {
    calculateReducingEMI,
    generateOrUpdateSchedule
};
