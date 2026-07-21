import { EmiSchedule, EmiScheduleStatus, InterestType, LoanType } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Calculate EMI amount based on principal, interest rate, tenure, loan type, and additional fees
 * @param principal - Principal loan amount
 * @param annualRate - Annual interest rate (percentage)
 * @param tenure - Number of periods (days/weeks/months based on loan type)
 * @param interestType - Type of interest calculation (flat/reducing)
 * @param loanType - Type of loan (daily/weekly/monthly)
 * @param processingFee - One-time processing fee (default: 0)
 * @param insuranceFee - One-time insurance fee (default: 0)
 * @returns EMI amount per period
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenure: number,
  interestType: InterestType,
  loanType: LoanType = 'monthly',
  processingFee: number = 0,
  insuranceFee: number = 0
): number {
  if (interestType === 'flat') {
    let totalInterest: number;
    
    if (loanType === 'daily') {
      // For daily loans: tenure is in days
      totalInterest = (principal * annualRate * tenure) / (365 * 100);
    } else if (loanType === 'weekly') {
      // For weekly loans: tenure is in weeks
      totalInterest = (principal * annualRate * tenure) / (52 * 100);
    } else {
      // For monthly loans: tenure is in months
      totalInterest = (principal * annualRate * tenure) / (12 * 100);
    }
    
    // For flat interest: Total payable includes principal, interest, and all fees
    const totalPayable = principal + totalInterest + processingFee + insuranceFee;
    return totalPayable / tenure;
  } else {
    // Reducing balance method
    // Add fees to principal for reducing balance calculation
    const effectivePrincipal = principal + processingFee + insuranceFee;
    
    let periodicRate: number;
    
    if (loanType === 'daily') {
      periodicRate = annualRate / (365 * 100);
    } else if (loanType === 'weekly') {
      periodicRate = annualRate / (52 * 100);
    } else {
      periodicRate = annualRate / (12 * 100);
    }
    
    if (periodicRate === 0) return effectivePrincipal / tenure;
    
    const emi = (effectivePrincipal * periodicRate * Math.pow(1 + periodicRate, tenure)) / 
                (Math.pow(1 + periodicRate, tenure) - 1);
    return emi;
  }
}

/**
 * Get next EMI date based on loan type and fixed day of month
 */
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
    
    // Handle month-end edge cases (e.g., Jan 31 -> Feb 28)
    const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(fixedDayOfMonth, lastDayOfMonth);
    nextDate.setDate(targetDay);
  }
  
  return nextDate;
}

/**
 * Generate complete EMI schedule for a loan
 * @param loanId - Unique loan identifier
 * @param principal - Principal loan amount
 * @param annualRate - Annual interest rate (percentage)
 * @param tenure - Number of periods
 * @param interestType - Type of interest (flat/reducing)
 * @param loanType - Type of loan (daily/weekly/monthly)
 * @param firstEmiDate - Date of first EMI
 * @param emiDayOfMonth - Fixed day of month for EMI (optional)
 * @param processingFee - One-time processing fee (default: 0)
 * @param insuranceFee - One-time insurance fee (default: 0)
 * @returns Array of EMI schedule records
 */
export function generateEmiSchedule(
  loanId: string,
  principal: number,
  annualRate: number,
  tenure: number,
  interestType: InterestType,
  loanType: LoanType,
  firstEmiDate: string,
  emiDayOfMonth?: number,
  processingFee: number = 0,
  insuranceFee: number = 0
): EmiSchedule[] {
  const schedule: EmiSchedule[] = [];
  const emiAmount = calculateEMI(principal, annualRate, tenure, interestType, loanType, processingFee, insuranceFee);
  
  // For reducing balance, include fees in the starting balance
  let remainingBalance = interestType === 'reducing' 
    ? principal + processingFee + insuranceFee 
    : principal;
  
  const firstDate = new Date(firstEmiDate);
  // Use explicit emiDayOfMonth if provided, otherwise extract from firstEmiDate
  const fixedDayOfMonth = emiDayOfMonth || firstDate.getDate();
  
  for (let i = 1; i <= tenure; i++) {
    const dueDate = i === 1 
      ? firstDate 
      : getNextEmiDate(new Date(schedule[i - 2].due_date), loanType, fixedDayOfMonth);
    
    let principalComponent: number;
    let interestComponent: number;
    
    if (interestType === 'flat') {
      // Flat interest: equal principal and interest each period
      principalComponent = principal / tenure;
      
      if (loanType === 'daily') {
        interestComponent = (principal * annualRate * 1) / (365 * 100);
      } else if (loanType === 'weekly') {
        interestComponent = (principal * annualRate * 1) / (52 * 100);
      } else {
        interestComponent = (principal * annualRate * 1) / (12 * 100);
      }
      
      // Add proportional fees to each EMI for flat interest
      const feeComponent = (processingFee + insuranceFee) / tenure;
      principalComponent += feeComponent;
    } else {
      // Reducing balance: interest on remaining balance
      let periodicRate: number;
      
      if (loanType === 'daily') {
        periodicRate = annualRate / (365 * 100);
      } else if (loanType === 'weekly') {
        periodicRate = annualRate / (52 * 100);
      } else {
        periodicRate = annualRate / (12 * 100);
      }
      
      interestComponent = remainingBalance * periodicRate;
      principalComponent = emiAmount - interestComponent;
    }
    
    const openingBalance = remainingBalance;
    remainingBalance -= principalComponent;
    const closingBalance = Math.max(0, remainingBalance);
    
    // Last EMI adjustment to handle rounding
    if (i === tenure) {
      principalComponent += closingBalance;
      remainingBalance = 0;
    }
    
    schedule.push({
      id: uuidv4(),
      loan_id: loanId,
      emi_number: i,
      due_date: dueDate.toISOString().split('T')[0],
      principal_component: Math.round(principalComponent * 100) / 100,
      interest_component: Math.round(interestComponent * 100) / 100,
      emi_amount: Math.round(emiAmount * 100) / 100,
      opening_balance: Math.round(openingBalance * 100) / 100,
      closing_balance: Math.round(closingBalance * 100) / 100,
      status: 'pending',
      paid_amount: 0,
      paid_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return schedule;
}

/**
 * Calculate total interest for a loan
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  tenure: number,
  interestType: InterestType,
  loanType: LoanType = 'monthly'
): number {
  if (interestType === 'flat') {
    if (loanType === 'daily') {
      return (principal * annualRate * tenure) / (365 * 100);
    } else if (loanType === 'weekly') {
      return (principal * annualRate * tenure) / (52 * 100);
    } else {
      return (principal * annualRate * tenure) / (12 * 100);
    }
  } else {
    const emiAmount = calculateEMI(principal, annualRate, tenure, interestType, loanType);
    const totalPayable = emiAmount * tenure;
    return totalPayable - principal;
  }
}

/**
 * Get EMI schedule status based on due date and payment
 */
export function getEmiStatus(
  dueDate: string,
  paidAmount: number,
  emiAmount: number
): EmiScheduleStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  if (paidAmount >= emiAmount) {
    return 'paid';
  } else if (paidAmount > 0) {
    return 'partial';
  } else if (due < today) {
    return 'overdue';
  } else {
    return 'pending';
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

