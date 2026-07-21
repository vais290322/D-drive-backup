/**
 * API Layer for MongoDB Backend
 * HTTP-based interface using Express.js backend
 */

// import { generateLoanLedger, calculateLoanSummary, isLoanDelayed } from '@/utils/loanCalculations';
// import { generateEmiSchedule } from '@/utils/emiCalculations';
import type {
  Profile,
  Customer,
  Product,
  Loan,
  EmiPayment,
  Penalty,
  Guarantor,
  EmiSchedule,
  DashboardStats,
  BusinessSettings,
} from '@/types/types';

// ==================== Configuration ====================

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const AUTH_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const AUTH_TOKEN_KEY = 'auth_token';
const CURRENT_USER_KEY = 'mitelectroworld_current_user';

// ==================== Helper Functions ====================

// Token management
const getToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

// Generic API call function
async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const url = endpoint.startsWith('/auth')
    ? `${AUTH_BASE}${endpoint}`
    : `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return await response.json();
}

// ==================== Authentication ====================

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export async function initializeDefaultUser(): Promise<void> {
  // Not needed with MongoDB backend - handled by backend
  return Promise.resolve();
}

export async function register(email: string, password: string, fullName: string): Promise<{ success: boolean; message: string }> {
  const response = await apiCall<{ success: boolean; message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name: fullName }),
  });

  return {
    success: response.success || true,
    message: response.message || 'Registration submitted for approval',
  };
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await apiCall<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.token) {
    setToken(response.token);
  }

  if (response.user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));

    // Trigger auth changed event
    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('auth-changed'));
      }
    } catch (e) { }
  }

  return response.user;
}

export async function logout(): Promise<void> {
  clearToken();
  localStorage.removeItem(CURRENT_USER_KEY);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;

  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch { }
  }

  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  return !!getToken();
}

// ==================== Profiles ====================

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    return await apiCall<Profile>(`/users/${userId}`);
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  const users = await apiCall<any[]>('/users');
  return users.map(user => ({
    ...user,
    id: user.id || user._id
  }));
}

export async function updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
  return apiCall<Profile>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateUserRole(userId: string, role: string): Promise<Profile> {
  return apiCall<Profile>(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

// ==================== Customers ====================

export async function getAllCustomers(): Promise<Customer[]> {
  return apiCall<Customer[]>('/customers');
}

export async function getCustomer(id: string): Promise<Customer | null> {
  try {
    return await apiCall<Customer>(`/customers/${id}`);
  } catch (error) {
    console.error('Error getting customer:', error);
    return null;
  }
}

export async function createCustomer(
  data: Omit<Customer, 'id' | 'customer_code' | 'created_at' | 'updated_at'>,
  manualCode?: string
): Promise<Customer> {
  return apiCall<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify({ ...data, customer_code: manualCode }),
  });
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  return apiCall<Customer>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  return apiCall<Customer[]>(`/customers/search/${encodeURIComponent(query)}`);
}

export async function updateCustomerKYC(
  customerId: string,
  status: 'verified' | 'rejected' | 'pending',
  remarks: string,
  verifiedBy: string,
  kycPhotoUrl?: string | null
): Promise<Customer> {
  return apiCall<Customer>(`/customers/${customerId}/kyc`, {
    method: 'PATCH',
    body: JSON.stringify({
      kyc_status: status,
      kyc_remarks: remarks,
      kyc_verified_by: verifiedBy,
      ...(kycPhotoUrl !== undefined && { kyc_photo_url: kycPhotoUrl }),
    }),
  });
}

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
  return apiCall(`/customers/${customerId}/ledger`);
}

// ==================== Products ====================

export async function getAllProducts(): Promise<Product[]> {
  const products = await apiCall<any[]>('/products');
  return products.map(product => ({
    ...product,
    id: product.id || product._id
  }));
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await apiCall<any>(`/products/${id}`);
    if (!product) return null;
    return {
      ...product,
      id: product.id || product._id
    };
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function getAvailableProducts(): Promise<Product[]> {
  const products = await apiCall<any[]>('/products?status=available');
  return products.map(product => ({
    ...product,
    id: product.id || product._id
  }));
}

export async function createProduct(
  data: Omit<Product, 'id' | 'product_code' | 'created_at' | 'updated_at'>
): Promise<Product> {
  return apiCall<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return apiCall<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function searchProducts(query: string): Promise<Product[]> {
  return apiCall<Product[]>(`/products/search/${encodeURIComponent(query)}`);
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  await apiCall(`/products/${id}`, { method: 'DELETE' });
  return { success: true, message: 'Product deleted successfully' };
}

// ==================== Loans ====================

export async function getAllLoans(): Promise<Loan[]> {
  return apiCall<Loan[]>('/loans');
}

export async function getLoan(id: string): Promise<Loan | null> {
  try {
    return await apiCall<Loan>(`/loans/${id}`);
  } catch (error) {
    console.error('Error getting loan:', error);
    return null;
  }
}

export async function getCustomerLoans(customerId: string): Promise<Loan[]> {
  return apiCall<Loan[]>(`/loans?customer_id=${customerId}`);
}

export async function getActiveLoans(): Promise<Loan[]> {
  return apiCall<Loan[]>('/loans?status=active');
}

export async function createLoan(
  data: Omit<Loan, 'id' | '_id' | 'loan_code' | 'created_at' | 'updated_at'>,
  manualCode?: string
): Promise<Loan> {
  return apiCall<Loan>('/loans', {
    method: 'POST',
    body: JSON.stringify({ ...data, loan_code: manualCode }),
  });
}

export async function updateLoan(id: string, data: Partial<Loan>): Promise<Loan> {
  return apiCall<Loan>(`/loans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function searchLoans(query: string): Promise<Loan[]> {
  return apiCall<Loan[]>(`/loans/search/${encodeURIComponent(query)}`);
}

export async function deleteLoan(id: string): Promise<{ success: boolean; message: string }> {
  await apiCall(`/loans/${id}`, { method: 'DELETE' });
  return { success: true, message: 'Loan deleted successfully' };
}

// ==================== EMI Payments ====================

export async function getLoanPayments(loanId: string): Promise<EmiPayment[]> {
  return apiCall<EmiPayment[]>(`/payments/loan/${loanId}`);
}

export async function getEmiSchedule(loanId: string): Promise<EmiSchedule[]> {
  return apiCall<EmiSchedule[]>(`/loans/${loanId}/schedule`);
}

export async function regenerateEmiSchedule(loanId: string): Promise<void> {
  await apiCall(`/loans/${loanId}/schedule/regenerate`, { method: 'POST' });
}

export async function updateEmiScheduleItem(id: string, data: Partial<EmiSchedule>): Promise<EmiSchedule> {
  return apiCall<EmiSchedule>(`/schedule/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function createPayment(data: Omit<EmiPayment, 'id' | 'created_at'>): Promise<EmiPayment> {
  return apiCall<EmiPayment>('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePayment(id: string, data: Partial<EmiPayment>): Promise<EmiPayment> {
  return apiCall<EmiPayment>(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getAllPayments(): Promise<EmiPayment[]> {
  return apiCall<EmiPayment[]>('/payments');
}

export async function getTodayCollection(): Promise<number> {
  const response = await apiCall<{ total: number }>('/reports/today-collection-total');
  return response.total || 0;
}

export async function getRecentPayments(limit: number = 5): Promise<EmiPayment[]> {
  return apiCall<EmiPayment[]>(`/payments?limit=${limit}`);
}

export async function getLoanQR(loanId: string): Promise<{ qr_id: string; image_url: string; mock?: boolean }> {
  return apiCall<{ qr_id: string; image_url: string; mock?: boolean }>(`/payments/loan/${loanId}/pay`);
}

// ==================== Penalties ====================

export async function getLoanPenalties(loanId: string): Promise<Penalty[]> {
  return apiCall<Penalty[]>(`/payments/penalty/loan/${loanId}`);
}

export async function getAllPenalties(): Promise<Penalty[]> {
  return apiCall<Penalty[]>('/payments/penalties');
}

export async function createPenalty(data: Omit<Penalty, 'id' | 'created_at'>): Promise<Penalty> {
  return apiCall<Penalty>('/payments/penalty', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePenalty(id: string, data: Partial<Penalty>): Promise<Penalty> {
  return apiCall<Penalty>(`/payments/penalty/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePenalty(id: string): Promise<boolean> {
  await apiCall(`/penalties/${id}`, { method: 'DELETE' });
  return true;
}

// ==================== Guarantors ====================

export async function getLoanGuarantors(loanId: string): Promise<Guarantor[]> {
  return apiCall<Guarantor[]>(`/loans/${loanId}/guarantors`);
}

export async function createGuarantor(data: Omit<Guarantor, 'id' | 'created_at'>): Promise<Guarantor> {
  return apiCall<Guarantor>('/guarantors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateGuarantor(id: string, data: Partial<Guarantor>): Promise<Guarantor> {
  return apiCall<Guarantor>(`/guarantors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteGuarantor(id: string): Promise<boolean> {
  await apiCall(`/guarantors/${id}`, { method: 'DELETE' });
  return true;
}

// ==================== Dashboard Stats ====================

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiCall<DashboardStats>('/reports/dashboard');
}

export async function getDashboardEvents(): Promise<import('@/types/types').DashboardEvent[]> {
  return apiCall<import('@/types/types').DashboardEvent[]>('/reports/dashboard-events');
}

export async function getDelayedEmis(): Promise<any[]> {
  return apiCall<any[]>('/reports/delayed-emis');
}

export async function getActiveLoansReport(): Promise<Loan[]> {
  return apiCall<Loan[]>('/reports/active-loans');
}

export async function getCompletedLoansReport(): Promise<Loan[]> {
  return apiCall<Loan[]>('/reports/completed-loans');
}

// ==================== Business Settings ====================

export async function getBusinessSettings(): Promise<BusinessSettings> {
  return apiCall<BusinessSettings>('/settings');
}

export async function updateBusinessSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings> {
  return apiCall<BusinessSettings>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ==================== File Storage ====================

export async function uploadFile(file: File, entityType: string, entityId: string, fieldName: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', entityType);
  formData.append('entityId', entityId);
  formData.append('fieldName', fieldName);

  const token = getToken();
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  const result = await response.json();
  return result.url || result.fileUrl;
}

export async function getFileUrl(fileId: string): Promise<string | null> {
  try {
    const response = await apiCall<{ url: string }>(`/files/${fileId}`);
    return response.url;
  } catch (error) {
    return null;
  }
}

export async function getEntityFiles(entityType: string, entityId: string): Promise<any[]> {
  return apiCall(`/files/${entityType}/${entityId}`);
}

// ==================== Data Management ====================

export async function exportAllData(): Promise<any> {
  return apiCall('/export');
}

export async function importData(data: any): Promise<void> {
  await apiCall('/import', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function clearAllData(): Promise<void> {
  await apiCall('/clear-all', { method: 'POST' });
}

// ==================== Delete Functions ====================

export async function deleteCustomer(id: string): Promise<{ success: boolean; message: string }> {
  await apiCall(`/customers/${id}`, { method: 'DELETE' });
  return { success: true, message: 'Customer deleted successfully' };
}

// ==================== CRM Functions (Stubs - to be expanded) ====================

// Most CRM functions would follow the same pattern as above
// For now, providing stubs to maintain API compatibility

export async function getAllCompanies(): Promise<any[]> {
  return apiCall('/crm/companies');
}

export async function getAllContacts(): Promise<any[]> {
  return apiCall('/crm/contacts');
}

export async function getAllDeals(): Promise<any[]> {
  return apiCall('/crm/deals');
}

// ==================== Banking Functions (Stubs - to be expanded) ====================

export async function getAllBankCustomers(): Promise<any[]> {
  return apiCall('/banking/customers');
}

export async function getAllBankAccounts(): Promise<any[]> {
  return apiCall('/banking/accounts');
}

export async function getAllBankTransactions(): Promise<any[]> {
  return apiCall('/banking/transactions');
}

// ==================== User Management Functions ====================

export async function getPendingUsers(): Promise<Profile[]> {
  try {
    return await apiCall<Profile[]>('/users?status=pending');
  } catch (error) {
    console.error('Error getting pending users:', error);
    return [];
  }
}

export async function approveUser(userId: string, approvedBy: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiCall(`/users/${userId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approved_by: approvedBy }),
    });
    return { success: true, message: 'User approved successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to approve user' };
  }
}

export async function rejectUser(userId: string, rejectedBy: string): Promise<{ success: boolean; message: string }> {
  try {
    await apiCall(`/users/${userId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejected_by: rejectedBy }),
    });
    return { success: true, message: 'User rejected successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to reject user' };
  }
}

export async function createUserByAdmin(
  email: string,
  password: string,
  fullName: string,
  role: string,
  createdBy: string
): Promise<{ success: boolean; message: string }> {
  try {
    await apiCall('/users/create', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        role,
        created_by: createdBy,
      }),
    });
    return { success: true, message: 'User created successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create user' };
  }
}

// ==================== API Object Export (Backward Compatibility) ====================

/**
 * Legacy API object for backward compatibility
 * Provides nested structure like api.profiles.getAll()
 */
export const api = {
  // Profiles / Users
  profiles: {
    getAll: getAllProfiles,
    get: getProfile,
    update: updateProfile,
    updateRole: updateUserRole,
    getPending: getPendingUsers,
    approve: approveUser,
    reject: rejectUser,
    createByAdmin: createUserByAdmin,
  },

  // Customers
  customers: {
    getAll: getAllCustomers,
    get: getCustomer,
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
    search: searchCustomers,
    updateKYC: updateCustomerKYC,
    getLedger: getCustomerLedger,
    getCallLogs: async (id: string) => apiCall(`/customers/${id}/calls`),
    addCallLog: async (id: string, data: any) => apiCall(`/customers/${id}/calls`, { method: 'POST', body: JSON.stringify(data) }),
  },

  // Products
  products: {
    getAll: getAllProducts,
    get: getProduct,
    getAvailable: getAvailableProducts,
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    search: searchProducts,
  },

  // Loans
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

  // Payments
  payments: {
    create: createPayment,
    update: updatePayment,
    getAll: getAllPayments,
    getByLoan: getLoanPayments,
    getTodayCollection: getTodayCollection,
    getLoanQR: getLoanQR,
    getPhonePeQR: async (id: string) => apiCall(`/payments/loan/${id}/phonepe-pay`),
    setupAutopay: async (id: string) => apiCall(`/autoPaySetup/${id}`, { method: 'POST' }),
    triggerAutopay: async (id: string) => apiCall(`/payments/loan/${id}/autopay/trigger`, { method: 'POST' }),
    getRecent: getRecentPayments,
  },

  // AutoPay PhonePe
  autopay: {
    setup: async (id: string) => apiCall(`/autoPaySetup/${id}`, { method: 'POST' }),
    checkSetupStatus: async (id: string) => apiCall(`/checkSetupOrderStatus/${id}`),
    checkSubscriptionStatus: async (id: string) => apiCall(`/checkSubscriptionStatus/${id}`),
    notifyRedemption: async (id: string) => apiCall(`/notify-redemption/${id}`, { method: 'POST' }),
    checkRedemptionStatus: async (id: string) => apiCall(`/get-redemption-status/${id}`),
    executeRedemption: async (id: string) => apiCall(`/execute-redemption/${id}`, { method: 'POST' }),
    cancelSubscription: async (id: string) => apiCall(`/cancel-subscription/${id}`, { method: 'POST' }),
  },

  // EMI Schedule
  schedule: {
    get: getEmiSchedule,
    regenerate: regenerateEmiSchedule,
    update: updateEmiScheduleItem,
  },

  // Penalties
  penalties: {
    getAll: getAllPenalties,
    getByLoan: getLoanPenalties,
    create: createPenalty,
    update: updatePenalty,
    delete: deletePenalty,
  },

  // Guarantors
  guarantors: {
    getByLoan: getLoanGuarantors,
    create: createGuarantor,
    update: updateGuarantor,
    delete: deleteGuarantor,
  },

  // Dashboard
  dashboard: {
    getStats: getDashboardStats,
    getEvents: getDashboardEvents,
    getDelayedEmis: getDelayedEmis,
    getActiveLoans: getActiveLoansReport,
    getCompletedLoans: getCompletedLoansReport,
  },

  // Settings
  settings: {
    get: getBusinessSettings,
    update: updateBusinessSettings,
  },

  // Files
  files: {
    upload: uploadFile,
    getUrl: getFileUrl,
    getEntityFiles: getEntityFiles,
  },

  // Data Management
  data: {
    export: exportAllData,
    import: importData,
    clearAll: clearAllData,
  },

  // CRM
  crm: {
    companies: {
      getAll: getAllCompanies,
    },
    contacts: {
      getAll: getAllContacts,
    },
    deals: {
      getAll: getAllDeals,
    },
  },

  // Banking
  banking: {
    customers: {
      getAll: getAllBankCustomers,
    },
    accounts: {
      getAll: getAllBankAccounts,
    },
    transactions: {
      getAll: getAllBankTransactions,
    },
  },

  // Profit And Loss
  pnl: {
    getAll: async () => apiCall('/pnl'),
    create: async (data: any) => apiCall('/pnl', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => apiCall(`/pnl/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id: string) => apiCall(`/pnl/${id}`, { method: 'DELETE' }),
  },

  // Service Requests
  serviceRequests: {
    getAll: async () => apiCall('/service-requests'),
    create: async (data: any) => apiCall('/service-requests', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => apiCall(`/service-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id: string) => apiCall(`/service-requests/${id}`, { method: 'DELETE' }),
  },
};

// Export token management for use by other modules
export { getToken, setToken, clearToken };

