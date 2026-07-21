/**
 * API Layer for Local Database
 * MongoDB-like interface using IndexedDB
 */

import * as db from './localdb';
import { v4 as uuidv4 } from 'uuid';
import apiClient from '@/lib/apiClient';
import { generateLoanLedger, calculateLoanSummary, isLoanDelayed } from '@/utils/loanCalculations';
import { generateEmiSchedule, getEmiStatus } from '@/utils/emiCalculations';
import type {
  Profile,
  Customer,
  Product,
  Loan,
  EmiPayment,
  Penalty,
  Guarantor,
  EmiSchedule,
} from '@/types/types';

// ==================== Authentication ====================

const AUTH_KEY = 'digital_dreems_auth';
const CURRENT_USER_KEY = 'digital_dreems_current_user';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

/**
 * Initialize default admin user
 */
export async function initializeDefaultUser(): Promise<void> {
  const existing = await db.findOne(db.COLLECTIONS.PROFILES, { email: 'admin@digitaldreems.com' });
  
  if (!existing) {
    await db.insertOne(db.COLLECTIONS.PROFILES, {
      email: 'admin@digitaldreems.com',
      password: 'admin123', // Simple password storage for local demo
      full_name: 'System Administrator',
      role: 'super_admin',
      status: 'approved',
      approved_by: null,
      approved_at: new Date().toISOString(),
      phone: '',
      created_at: new Date().toISOString(),
    });
  }
}

/**
 * Register new user
 * Creates a pending user that requires admin approval
 */
export async function register(email: string, password: string, fullName: string): Promise<{ success: boolean; message: string }> {
  // If backend API configured, forward registration to server
  if (apiClient.hasBackend()) {
    const res = await apiClient.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    return {
      success: true,
      message: res?.message || 'Registration submitted',
    };
  }

  // Fallback: local DB registration
  const existing = await db.findOne(db.COLLECTIONS.PROFILES, { email });
  
  if (existing) {
    throw new Error('User with this email already exists');
  }

  await db.insertOne(db.COLLECTIONS.PROFILES, {
    email,
    password, // In production, this should be hashed
    full_name: fullName,
    role: 'data_entry', // Default role for new signups
    status: 'pending',
    approved_by: null,
    approved_at: null,
    phone: '',
    created_at: new Date().toISOString(),
  });

  return {
    success: true,
    message: 'Registration successful! Your account is pending approval. Please wait for admin approval to login.'
  };
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthUser> {
  if (apiClient.hasBackend()) {
    const res = await apiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Expecting { token, user }
    if (!res?.token || !res?.user) throw new Error('Invalid server response');

    apiClient.setToken(res.token);
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));

    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('auth-changed'));
      }
    } catch (e) {}

    return {
      id: res.user.id,
      email: res.user.email,
      full_name: res.user.full_name,
      role: res.user.role,
    };
  }

  // Fallback: local DB login
  const profile = await db.findOne(db.COLLECTIONS.PROFILES, { email });
  
  if (!profile) {
    throw new Error('Invalid email or password');
  }

  // Check password
  if (profile.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Check approval status
  if (profile.status === 'pending') {
    throw new Error('Your account is pending approval. Please wait for admin approval.');
  }

  if (profile.status === 'rejected') {
    throw new Error('Your account has been rejected. Please contact administrator.');
  }

  const authUser: AuthUser = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
  };

  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('auth-changed'));
    }
  } catch (e) {}

  return authUser;
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  // Clear server token if present
  try {
    apiClient.setToken(null);
  } catch {}
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // If backend configured, prefer token-based user
  if (apiClient.hasBackend()) {
    const token = apiClient.getToken();
    if (!token) return null;

    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (userStr) {
      try { return JSON.parse(userStr); } catch {}
    }

    // optionally try to fetch /auth/me if server supports it
    try {
      const me = await apiClient.request('/auth/me');
      if (me) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(me));
        return me;
      }
    } catch (err) {
      // ignore - server may not implement /auth/me
    }

    return null;
  }

  const isAuth = localStorage.getItem(AUTH_KEY);
  if (!isAuth) return null;

  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  if (apiClient.hasBackend()) {
    return !!apiClient.getToken();
  }

  return localStorage.getItem(AUTH_KEY) === 'true';
}

// ==================== Profiles ====================

export async function getProfile(userId: string): Promise<Profile | null> {
  return db.findById(db.COLLECTIONS.PROFILES, userId);
}

export async function getAllProfiles(): Promise<Profile[]> {
  return db.find(db.COLLECTIONS.PROFILES, {}, { orderBy: 'created_at', order: 'desc' });
}

export async function updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
  return db.updateOne(db.COLLECTIONS.PROFILES, userId, data);
}

export async function updateUserRole(userId: string, role: string): Promise<Profile> {
  return db.updateOne(db.COLLECTIONS.PROFILES, userId, { role });
}

// ==================== Customers ====================

export async function getAllCustomers(): Promise<Customer[]> {
  return db.find(db.COLLECTIONS.CUSTOMERS, {}, { orderBy: 'created_at', order: 'desc' });
}

export async function getCustomer(id: string): Promise<Customer | null> {
  return db.findById(db.COLLECTIONS.CUSTOMERS, id);
}

export async function createCustomer(data: Omit<Customer, 'id' | 'customer_code' | 'created_at' | 'updated_at'>, manualCode?: string): Promise<Customer> {
  const customer_code = manualCode || await db.getNextSequence(db.COLLECTIONS.CUSTOMERS, 'CUST');
  
  // Check if manual code already exists
  if (manualCode) {
    const existing = await db.findOne(db.COLLECTIONS.CUSTOMERS, { customer_code: manualCode });
    if (existing) {
      throw new Error('Customer code already exists');
    }
  }
  
  return db.insertOne(db.COLLECTIONS.CUSTOMERS, {
    ...data,
    customer_code,
    kyc_status: data.kyc_status || 'pending',
  });
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  return db.updateOne(db.COLLECTIONS.CUSTOMERS, id, data);
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  const allCustomers = await db.find(db.COLLECTIONS.CUSTOMERS);
  const lowerQuery = query.toLowerCase();
  
  return allCustomers.filter((customer) => {
    return (
      customer.full_name?.toLowerCase().includes(lowerQuery) ||
      customer.mobile_primary?.toLowerCase().includes(lowerQuery) ||
      customer.customer_code?.toLowerCase().includes(lowerQuery) ||
      customer.email?.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Update customer KYC status
 */
export async function updateCustomerKYC(
  customerId: string,
  status: 'verified' | 'rejected' | 'pending',
  remarks: string,
  verifiedBy: string,
  kycPhotoUrl?: string | null
): Promise<Customer> {
  return db.updateOne(db.COLLECTIONS.CUSTOMERS, customerId, {
    kyc_status: status,
    kyc_remarks: remarks,
    kyc_verified_by: verifiedBy,
    kyc_verified_at: new Date().toISOString(),
    ...(kycPhotoUrl !== undefined && { kyc_photo_url: kycPhotoUrl }),
  });
}

/**
 * Get customer ledger (all loans and payments)
 */
export async function getCustomerLedger(customerId: string): Promise<{
  customer: Customer;
  loans: Array<{
    loan: Loan;
    product: Product | null;
    payments: EmiPayment[];
    penalties: Penalty[];
    ledger: any[];
    summary: any;
  }>;
  totalDisbursed: number;
  totalPaid: number;
  totalOutstanding: number;
}> {
  const customer = await getCustomer(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  const loans = await db.find(db.COLLECTIONS.LOANS, { customer_id: customerId });
  const allPayments = await db.find(db.COLLECTIONS.PAYMENTS);
  const allPenalties = await db.find(db.COLLECTIONS.PENALTIES);

  let totalDisbursed = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;

  const loanDetails = await Promise.all(
    loans.map(async (loan) => {
      const product = loan.product_id ? await getProduct(loan.product_id) : null;
      const payments = allPayments.filter(p => p.loan_id === loan.id);
      const penalties = allPenalties.filter(p => p.loan_id === loan.id);
      const ledger = generateLoanLedger(loan, payments, penalties);
      const summary = calculateLoanSummary(ledger, loan);

      totalDisbursed += loan.principal_amount || 0;
      totalPaid += summary.totalPaid || 0;
      totalOutstanding += summary.totalOutstanding || 0;

      return {
        loan,
        product,
        payments,
        penalties,
        ledger,
        summary,
      };
    })
  );

  return {
    customer,
    loans: loanDetails,
    totalDisbursed,
    totalPaid,
    totalOutstanding,
  };
}

// ==================== Products ====================

export async function getAllProducts(): Promise<Product[]> {
  return db.find(db.COLLECTIONS.PRODUCTS, {}, { orderBy: 'created_at', order: 'desc' });
}

export async function getProduct(id: string): Promise<Product | null> {
  return db.findById(db.COLLECTIONS.PRODUCTS, id);
}

export async function getAvailableProducts(): Promise<Product[]> {
  return db.find(db.COLLECTIONS.PRODUCTS, { status: 'available' });
}

export async function createProduct(data: Omit<Product, 'id' | 'product_code' | 'created_at' | 'updated_at'>): Promise<Product> {
  const product_code = await db.getNextSequence(db.COLLECTIONS.PRODUCTS, 'PROD');
  return db.insertOne(db.COLLECTIONS.PRODUCTS, {
    ...data,
    product_code,
    status: data.status || 'available',
  });
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return db.updateOne(db.COLLECTIONS.PRODUCTS, id, data);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const allProducts = await db.find(db.COLLECTIONS.PRODUCTS);
  const lowerQuery = query.toLowerCase();
  
  return allProducts.filter((product) => {
    return (
      product.product_code?.toLowerCase().includes(lowerQuery) ||
      product.brand?.toLowerCase().includes(lowerQuery) ||
      product.model?.toLowerCase().includes(lowerQuery) ||
      product.imei_1?.toLowerCase().includes(lowerQuery) ||
      product.imei_2?.toLowerCase().includes(lowerQuery) ||
      product.serial_number?.toLowerCase().includes(lowerQuery)
    );
  });
}

// ==================== Loans ====================

export async function getAllLoans(): Promise<Loan[]> {
  return db.find(db.COLLECTIONS.LOANS, {}, { orderBy: 'created_at', order: 'desc' });
}

export async function getLoan(id: string): Promise<Loan | null> {
  return db.findById(db.COLLECTIONS.LOANS, id);
}

export async function getCustomerLoans(customerId: string): Promise<Loan[]> {
  return db.find(db.COLLECTIONS.LOANS, { customer_id: customerId }, { orderBy: 'created_at', order: 'desc' });
}

export async function getActiveLoans(): Promise<Loan[]> {
  return db.find(db.COLLECTIONS.LOANS, { status: 'active' }, { orderBy: 'created_at', order: 'desc' });
}

export async function createLoan(data: Omit<Loan, 'id' | 'loan_code' | 'created_at' | 'updated_at'>, manualCode?: string): Promise<Loan> {
  const loan_code = manualCode || await db.getNextSequence(db.COLLECTIONS.LOANS, 'LOAN');
  
  // Check if manual code already exists
  if (manualCode) {
    const existing = await db.findOne(db.COLLECTIONS.LOANS, { loan_code: manualCode });
    if (existing) {
      throw new Error('Loan ID already exists');
    }
  }
  
  // Update product status to assigned
  if (data.product_id) {
    await db.updateOne(db.COLLECTIONS.PRODUCTS, data.product_id, { status: 'assigned' });
  }
  
  // Create loan
  const loan = await db.insertOne(db.COLLECTIONS.LOANS, {
    ...data,
    loan_code,
    status: data.status || 'active',
    balance_amount: data.total_payable,
  });
  
  // Generate EMI schedule with fees included
  const schedule = generateEmiSchedule(
    loan.id,
    data.principal_amount,
    data.interest_rate,
    data.tenure_months,
    data.interest_type,
    data.loan_type,
    data.first_emi_date,
    data.emi_day_of_month,
    data.processing_fee,
    data.insurance_fee
  );
  
  // Save EMI schedule
  for (const emi of schedule) {
    await db.insertOne(db.COLLECTIONS.EMI_SCHEDULE, emi);
  }
  
  return loan;
}

export async function updateLoan(id: string, data: Partial<Loan>): Promise<Loan> {
  return db.updateOne(db.COLLECTIONS.LOANS, id, data);
}

export async function searchLoans(query: string): Promise<Loan[]> {
  const allLoans = await db.find(db.COLLECTIONS.LOANS);
  const lowerQuery = query.toLowerCase();
  
  return allLoans.filter((loan) => {
    return loan.loan_code?.toLowerCase().includes(lowerQuery);
  });
}

// ==================== EMI Payments ====================

export async function getLoanPayments(loanId: string): Promise<EmiPayment[]> {
  return db.find(db.COLLECTIONS.PAYMENTS, { loan_id: loanId }, { orderBy: 'payment_date', order: 'desc' });
}

export async function getEmiSchedule(loanId: string): Promise<EmiSchedule[]> {
  return db.find(db.COLLECTIONS.EMI_SCHEDULE, { loan_id: loanId }, { orderBy: 'emi_number', order: 'asc' });
}

export async function regenerateEmiSchedule(loanId: string): Promise<void> {
  const loan = await db.findById(db.COLLECTIONS.LOANS, loanId);
  if (!loan) {
    throw new Error('Loan not found');
  }
  
  // Delete existing schedule
  const existingSchedule = await db.find(db.COLLECTIONS.EMI_SCHEDULE, { loan_id: loanId });
  for (const emi of existingSchedule) {
    await db.deleteOne(db.COLLECTIONS.EMI_SCHEDULE, emi.id);
  }
  
  // Generate new schedule with fees included
  const schedule = generateEmiSchedule(
    loan.id,
    loan.principal_amount,
    loan.interest_rate,
    loan.tenure_months,
    loan.interest_type,
    loan.loan_type,
    loan.first_emi_date,
    loan.emi_day_of_month,
    loan.processing_fee,
    loan.insurance_fee
  );
  
  // Save new schedule
  for (const emi of schedule) {
    await db.insertOne(db.COLLECTIONS.EMI_SCHEDULE, emi);
  }
  
  // Update EMI schedule status based on existing payments
  const payments = await getLoanPayments(loanId);
  if (payments.length > 0) {
    await updateEmiScheduleAfterPayment(loanId);
  }
}

export async function updateEmiScheduleItem(id: string, data: Partial<EmiSchedule>): Promise<EmiSchedule> {
  return db.updateOne(db.COLLECTIONS.EMI_SCHEDULE, id, data);
}

export async function createPayment(data: Omit<EmiPayment, 'id' | 'created_at'>): Promise<EmiPayment> {
  const payment = await db.insertOne(db.COLLECTIONS.PAYMENTS, data);
  
  // Update loan balance
  const loan = await db.findById(db.COLLECTIONS.LOANS, data.loan_id);
  if (loan) {
    const newBalance = (loan.balance_amount || loan.total_payable) - data.amount_paid;
    const newStatus = newBalance <= 0 ? 'completed' : loan.status;
    
    await db.updateOne(db.COLLECTIONS.LOANS, data.loan_id, {
      balance_amount: Math.max(0, newBalance),
      status: newStatus,
    });

    // If loan is completed, update product status
    if (newStatus === 'completed' && loan.product_id) {
      await db.updateOne(db.COLLECTIONS.PRODUCTS, loan.product_id, { status: 'sold' });
    }
    
    // Update EMI schedule status
    await updateEmiScheduleAfterPayment(data.loan_id);
  }
  
  return payment;
}

async function updateEmiScheduleAfterPayment(loanId: string): Promise<void> {
  const schedule = await getEmiSchedule(loanId);
  const payments = await getLoanPayments(loanId);
  
  // Calculate total paid amount
  const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  
  let remainingPayment = totalPaid;
  
  // Update each EMI status based on payments
  for (const emi of schedule) {
    if (remainingPayment >= emi.emi_amount) {
      // EMI fully paid
      await updateEmiScheduleItem(emi.id, {
        status: 'paid',
        paid_amount: emi.emi_amount,
        paid_date: new Date().toISOString().split('T')[0],
      });
      remainingPayment -= emi.emi_amount;
    } else if (remainingPayment > 0) {
      // EMI partially paid
      await updateEmiScheduleItem(emi.id, {
        status: 'partial',
        paid_amount: remainingPayment,
      });
      remainingPayment = 0;
    } else {
      // Check if overdue
      const today = new Date();
      const dueDate = new Date(emi.due_date);
      if (dueDate < today && emi.status === 'pending') {
        await updateEmiScheduleItem(emi.id, {
          status: 'overdue',
        });
      }
    }
  }
}

export async function getAllPayments(): Promise<EmiPayment[]> {
  return db.find(db.COLLECTIONS.PAYMENTS, {}, { orderBy: 'payment_date', order: 'desc' });
}

export async function getTodayCollection(): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const payments = await db.find(db.COLLECTIONS.PAYMENTS);
  
  return payments
    .filter((p) => p.payment_date?.startsWith(today))
    .reduce((sum, p) => sum + (p.amount_paid || 0), 0);
}

// ==================== Penalties ====================

export async function getLoanPenalties(loanId: string): Promise<Penalty[]> {
  return db.find(db.COLLECTIONS.PENALTIES, { loan_id: loanId }, { orderBy: 'created_at', order: 'desc' });
}

export async function getAllPenalties(): Promise<Penalty[]> {
  return db.find(db.COLLECTIONS.PENALTIES, {}, { orderBy: 'created_at', order: 'desc' });
}

export async function createPenalty(data: Omit<Penalty, 'id' | 'created_at'>): Promise<Penalty> {
  const penalty = await db.insertOne(db.COLLECTIONS.PENALTIES, data);
  
  // Update loan balance
  const loan = await db.findById(db.COLLECTIONS.LOANS, data.loan_id);
  if (loan) {
    const newBalance = (loan.balance_amount || loan.total_payable) + data.amount;
    await db.updateOne(db.COLLECTIONS.LOANS, data.loan_id, {
      balance_amount: newBalance,
    });
  }
  
  return penalty;
}

export async function deletePenalty(id: string): Promise<boolean> {
  const penalty = await db.findById(db.COLLECTIONS.PENALTIES, id);
  if (!penalty) return false;
  
  // Update loan balance
  const loan = await db.findById(db.COLLECTIONS.LOANS, penalty.loan_id);
  if (loan) {
    const newBalance = (loan.balance_amount || loan.total_payable) - penalty.amount;
    await db.updateOne(db.COLLECTIONS.LOANS, penalty.loan_id, {
      balance_amount: Math.max(0, newBalance),
    });
  }
  
  return db.deleteOne(db.COLLECTIONS.PENALTIES, id);
}

// ==================== Guarantors ====================

export async function getLoanGuarantors(loanId: string): Promise<Guarantor[]> {
  return db.find(db.COLLECTIONS.GUARANTORS, { loan_id: loanId });
}

export async function createGuarantor(data: Omit<Guarantor, 'id' | 'created_at'>): Promise<Guarantor> {
  return db.insertOne(db.COLLECTIONS.GUARANTORS, data);
}

export async function updateGuarantor(id: string, data: Partial<Guarantor>): Promise<Guarantor> {
  return db.updateOne(db.COLLECTIONS.GUARANTORS, id, data);
}

export async function deleteGuarantor(id: string): Promise<boolean> {
  return db.deleteOne(db.COLLECTIONS.GUARANTORS, id);
}

// ==================== Dashboard Stats ====================

export async function getDashboardStats(): Promise<any> {
  const customers = await db.find(db.COLLECTIONS.CUSTOMERS);
  const loans = await db.find(db.COLLECTIONS.LOANS);
  const payments = await db.find(db.COLLECTIONS.PAYMENTS);
  const penalties = await db.find(db.COLLECTIONS.PENALTIES);
  
  const activeLoans = loans.filter((l) => l.status === 'active');
  const completedLoans = loans.filter((l) => l.status === 'completed');
  const defaultedLoans = loans.filter((l) => l.status === 'defaulted');
  
  const totalDisbursed = loans.reduce((sum, l) => sum + (l.principal_amount || 0), 0);
  
  // Calculate accurate outstanding using ledger system
  let totalOutstanding = 0;
  for (const loan of activeLoans) {
    const loanPayments = payments.filter(p => p.loan_id === loan.id);
    const loanPenalties = penalties.filter(p => p.loan_id === loan.id);
    const ledger = generateLoanLedger(loan, loanPayments, loanPenalties);
    const summary = calculateLoanSummary(ledger, loan);
    totalOutstanding += summary.totalOutstanding;
  }
  
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todayCollection = payments
    .filter((p) => p.payment_date?.startsWith(today))
    .reduce((sum, p) => sum + (p.amount_paid || 0), 0);

  // Calculate delayed EMIs (loans with balance and past due payments)
  const delayedLoans = activeLoans.filter((loan) => {
    if (!loan.first_emi_date) return false;
    const loanPayments = payments.filter(p => p.loan_id === loan.id);
    const loanPenalties = penalties.filter(p => p.loan_id === loan.id);
    const ledger = generateLoanLedger(loan, loanPayments, loanPenalties);
    const summary = calculateLoanSummary(ledger, loan);
    
    return isLoanDelayed(loan, summary);
  });

  return {
    total_customers: customers.length,
    active_loans: activeLoans.length,
    completed_loans: completedLoans.length,
    defaulted_loans: defaultedLoans.length,
    delayed_emis: delayedLoans.length,
    total_collection_today: todayCollection,
    total_outstanding: totalOutstanding,
    total_disbursed: totalDisbursed,
    total_collected: totalCollected,
    loan_status_distribution: [
      { name: 'Active', value: activeLoans.length },
      { name: 'Completed', value: completedLoans.length },
      { name: 'Defaulted', value: defaultedLoans.length },
    ],
  };
}

// ==================== File Storage ====================

export async function uploadFile(file: File, entityType: string, entityId: string, fieldName: string): Promise<string> {
  return db.storeFile(file, entityType, entityId, fieldName);
}

export async function getFileUrl(fileId: string): Promise<string | null> {
  return db.getFile(fileId);
}

export async function getEntityFiles(entityType: string, entityId: string): Promise<any[]> {
  return db.getFilesByEntity(entityType, entityId);
}

// ==================== Data Management ====================

export async function exportAllData(): Promise<any> {
  return db.exportAllData();
}

export async function importData(data: any): Promise<void> {
  return db.importData(data);
}

export async function clearAllData(): Promise<void> {
  return db.clearAllData();
}

// ============================================================================
// DELETE FUNCTIONS
// ============================================================================

/**
 * Delete a customer
 * Checks for active loans before deletion
 */
export async function deleteCustomer(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check for active loans
    const loans = await db.find(db.COLLECTIONS.LOANS, { customer_id: id });
    const activeLoans = loans.filter((loan: any) => loan.status === 'active');
    
    if (activeLoans.length > 0) {
      return {
        success: false,
        message: `Cannot delete customer. There are ${activeLoans.length} active loan(s) associated with this customer.`
      };
    }
    
    // Delete customer
    await db.deleteOne(db.COLLECTIONS.CUSTOMERS, id);
    
    return {
      success: true,
      message: 'Customer deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      success: false,
      message: 'Failed to delete customer'
    };
  }
}

/**
 * Delete a product
 * Checks for active loans before deletion
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check for active loans
    const loans = await db.find(db.COLLECTIONS.LOANS, { product_id: id });
    const activeLoans = loans.filter((loan: any) => loan.status === 'active');
    
    if (activeLoans.length > 0) {
      return {
        success: false,
        message: `Cannot delete product. There are ${activeLoans.length} active loan(s) using this product.`
      };
    }
    
    // Delete product
    await db.deleteOne(db.COLLECTIONS.PRODUCTS, id);
    
    return {
      success: true,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      message: 'Failed to delete product'
    };
  }
}

/**
 * Delete a loan
 * Deletes associated EMI schedule, payments, penalties, and guarantors
 */
export async function deleteLoan(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Delete EMI schedule
    const emiSchedule = await db.find(db.COLLECTIONS.EMI_SCHEDULE, { loan_id: id });
    for (const emi of emiSchedule) {
      await db.deleteOne(db.COLLECTIONS.EMI_SCHEDULE, emi.id);
    }
    
    // Delete payments
    const payments = await db.find(db.COLLECTIONS.PAYMENTS, { loan_id: id });
    for (const payment of payments) {
      await db.deleteOne(db.COLLECTIONS.PAYMENTS, payment.id);
    }
    
    // Delete penalties
    const penalties = await db.find(db.COLLECTIONS.PENALTIES, { loan_id: id });
    for (const penalty of penalties) {
      await db.deleteOne(db.COLLECTIONS.PENALTIES, penalty.id);
    }
    
    // Delete guarantors
    const guarantors = await db.find(db.COLLECTIONS.GUARANTORS, { loan_id: id });
    for (const guarantor of guarantors) {
      await db.deleteOne(db.COLLECTIONS.GUARANTORS, guarantor.id);
    }
    
    // Delete loan
    await db.deleteOne(db.COLLECTIONS.LOANS, id);
    
    return {
      success: true,
      message: 'Loan and all associated records deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting loan:', error);
    return {
      success: false,
      message: 'Failed to delete loan'
    };
  }
}

// ============================================================================
// USER APPROVAL FUNCTIONS
// ============================================================================

/**
 * Get all pending users awaiting approval
 */
export async function getPendingUsers(): Promise<Profile[]> {
  const profiles = await db.find(db.COLLECTIONS.PROFILES, { status: 'pending' });
  return Array.isArray(profiles) ? profiles : [];
}

/**
 * Approve a user
 * Only admin and super_admin can approve
 */
export async function approveUser(userId: string, approvedBy: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get approver profile to check role
    const approver = await db.findById(db.COLLECTIONS.PROFILES, approvedBy);
    if (!approver || (approver.role !== 'admin' && approver.role !== 'super_admin')) {
      return {
        success: false,
        message: 'Only admin or super admin can approve users'
      };
    }
    
    // Update user status
    await db.updateOne(db.COLLECTIONS.PROFILES, userId, {
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'User approved successfully'
    };
  } catch (error) {
    console.error('Error approving user:', error);
    return {
      success: false,
      message: 'Failed to approve user'
    };
  }
}

/**
 * Reject a user
 * Only admin and super_admin can reject
 */
export async function rejectUser(userId: string, rejectedBy: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get rejector profile to check role
    const rejector = await db.findById(db.COLLECTIONS.PROFILES, rejectedBy);
    if (!rejector || (rejector.role !== 'admin' && rejector.role !== 'super_admin')) {
      return {
        success: false,
        message: 'Only admin or super admin can reject users'
      };
    }
    
    // Update user status
    await db.updateOne(db.COLLECTIONS.PROFILES, userId, {
      status: 'rejected',
      approved_by: rejectedBy,
      approved_at: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'User rejected successfully'
    };
  } catch (error) {
    console.error('Error rejecting user:', error);
    return {
      success: false,
      message: 'Failed to reject user'
    };
  }
}

/**
 * Create a new user (admin only)
 * Directly creates an approved user
 */
export async function createUserByAdmin(
  email: string,
  password: string,
  fullName: string,
  role: string,
  createdBy: string
): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    // Get creator profile to check role
    const creator = await db.findById(db.COLLECTIONS.PROFILES, createdBy);
    if (!creator || (creator.role !== 'admin' && creator.role !== 'super_admin')) {
      return {
        success: false,
        message: 'Only admin or super admin can create users'
      };
    }
    
    // Check if email already exists
    const existingProfiles = await db.find(db.COLLECTIONS.PROFILES, { email });
    if (existingProfiles.length > 0) {
      return {
        success: false,
        message: 'Email already exists'
      };
    }
    
    // Create profile with approved status
    let userId: string;
    try {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof (crypto as any).randomUUID === 'function') {
        userId = (crypto as any).randomUUID();
      } else {
        userId = uuidv4();
      }
    } catch (err) {
      userId = uuidv4();
    }
    const profile: Profile = {
      id: userId,
      email,
      password, // In production, this should be hashed
      full_name: fullName,
      phone: null,
      role: role as any,
      status: 'approved',
      approved_by: createdBy,
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    await db.insertOne(db.COLLECTIONS.PROFILES, profile);
    
    return {
      success: true,
      message: 'User created successfully',
      userId
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: 'Failed to create user'
    };
  }
}

// Initialize database on module load
db.initDB().then(() => {
  initializeDefaultUser();
});

// Export as api object for backward compatibility
export const api = {
  auth: {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    getProfile,
  },
  profiles: {
    getAll: getAllProfiles,
    get: getProfile,
    update: updateProfile,
    updateRole: updateUserRole,
  },
  customers: {
    getAll: getAllCustomers,
    get: getCustomer,
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
    search: searchCustomers,
    updateKYC: updateCustomerKYC,
    getLedger: getCustomerLedger,
  },
  products: {
    getAll: getAllProducts,
    get: getProduct,
    getAvailable: getAvailableProducts,
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    search: searchProducts,
  },
  loans: {
    getAll: getAllLoans,
    get: getLoan,
    getByCustomer: getCustomerLoans,
    getActive: getActiveLoans,
    create: createLoan,
    update: updateLoan,
    delete: deleteLoan,
    search: searchLoans,
  },
  payments: {
    getByLoan: getLoanPayments,
    create: createPayment,
    getAll: getAllPayments,
    getTodayCollection,
  },
  emiSchedule: {
    getByLoan: getEmiSchedule,
    update: updateEmiScheduleItem,
    regenerate: regenerateEmiSchedule,
  },
  penalties: {
    getAll: getAllPenalties,
    getByLoan: getLoanPenalties,
    create: createPenalty,
    delete: deletePenalty,
  },
  guarantors: {
    getByLoan: getLoanGuarantors,
    create: createGuarantor,
    update: updateGuarantor,
    delete: deleteGuarantor,
  },
  dashboard: {
    getStats: getDashboardStats,
  },
  files: {
    upload: uploadFile,
    getUrl: getFileUrl,
    getByEntity: getEntityFiles,
  },
  data: {
    exportAll: exportAllData,
    import: importData,
    clearAll: clearAllData,
  },
};
