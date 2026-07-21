/**
 * Banking API Layer for MongoDB Backend
 * Handles all banking-related database operations via HTTP to Express backend
 */

import type {
    BankCustomer,
    BankAccount,
    BankTransaction,
    BankTransactionDocument,
    BankCustomerWithAccount,
    BankAccountWithCustomer,
    BankTransactionWithAccount,
    BankingDashboardStats,
    TransactionResult,
    DailyTransactionSummary,
    CustomerBalanceSummary,
} from '@/types/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const getToken = (): string | null => localStorage.getItem('auth_token');

async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return await response.json();
}

// ==================== Customer Management ====================

export async function getBankCustomers(): Promise<BankCustomerWithAccount[]> {
    try {
        return await apiCall<BankCustomerWithAccount[]>('/banking/customers');
    } catch (error) {
        console.error('Error fetching bank customers:', error);
        return [];
    }
}

export async function getBankCustomerById(id: string): Promise<BankCustomerWithAccount | null> {
    try {
        return await apiCall<BankCustomerWithAccount>(`/banking/customers/${id}`);
    } catch (error) {
        console.error('Error fetching bank customer:', error);
        return null;
    }
}

export async function createBankCustomer(
    customer: Omit<BankCustomer, 'id' | 'created_at' | 'updated_at'>
): Promise<BankCustomer | null> {
    try {
        return await apiCall<BankCustomer>('/banking/customers', {
            method: 'POST',
            body: JSON.stringify(customer),
        });
    } catch (error: any) {
        console.error('Error creating bank customer:', error);
        throw new Error(error.message);
    }
}

export async function updateBankCustomer(
    id: string,
    updates: Partial<BankCustomer>
): Promise<BankCustomer | null> {
    try {
        return await apiCall<BankCustomer>(`/banking/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    } catch (error: any) {
        console.error('Error updating bank customer:', error);
        throw new Error(error.message);
    }
}

export async function deleteBankCustomer(id: string): Promise<boolean> {
    try {
        await apiCall(`/banking/customers/${id}`, { method: 'DELETE' });
        return true;
    } catch (error: any) {
        console.error('Error deleting bank customer:', error);
        throw new Error(error.message);
    }
}

// ==================== Account Management ====================

export async function getBankAccounts(): Promise<BankAccountWithCustomer[]> {
    try {
        return await apiCall<BankAccountWithCustomer[]>('/banking/accounts');
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
        return [];
    }
}

export async function getBankAccountById(id: string): Promise<BankAccountWithCustomer | null> {
    try {
        return await apiCall<BankAccountWithCustomer>(`/banking/accounts/${id}`);
    } catch (error) {
        console.error('Error fetching bank account:', error);
        return null;
    }
}

export async function getBankAccountByNumber(
    accountNumber: string
): Promise<BankAccountWithCustomer | null> {
    try {
        return await apiCall<BankAccountWithCustomer>(`/banking/accounts/number/${accountNumber}`);
    } catch (error) {
        console.error('Error fetching bank account by number:', error);
        return null;
    }
}

export async function getAccountsByCustomer(customerId: string): Promise<BankAccount[]> {
    try {
        return await apiCall<BankAccount[]>(`/banking/accounts/customer/${customerId}`);
    } catch (error) {
        console.error('Error fetching accounts by customer:', error);
        return [];
    }
}

export async function createBankAccount(
    account: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>
): Promise<BankAccount | null> {
    try {
        return await apiCall<BankAccount>('/banking/accounts', {
            method: 'POST',
            body: JSON.stringify(account),
        });
    } catch (error: any) {
        console.error('Error creating bank account:', error);
        throw new Error(error.message);
    }
}

export async function updateBankAccount(
    id: string,
    updates: Partial<BankAccount>
): Promise<BankAccount | null> {
    try {
        return await apiCall<BankAccount>(`/banking/accounts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    } catch (error: any) {
        console.error('Error updating bank account:', error);
        throw new Error(error.message);
    }
}

export async function deleteBankAccount(id: string): Promise<boolean> {
    try {
        await apiCall(`/banking/accounts/${id}`, { method: 'DELETE' });
        return true;
    } catch (error: any) {
        console.error('Error deleting bank account:', error);
        throw new Error(error.message);
    }
}

// ==================== Transaction Operations ====================

export async function processDeposit(
    accountId: string,
    amount: number,
    referenceNote?: string,
    createdBy?: string
): Promise<TransactionResult> {
    try {
        return await apiCall<TransactionResult>('/banking/transactions/deposit', {
            method: 'POST',
            body: JSON.stringify({
                account_id: accountId,
                amount,
                reference_note: referenceNote,
                created_by: createdBy,
            }),
        });
    } catch (error: any) {
        console.error('Error processing deposit:', error);
        throw new Error(error.message);
    }
}

export async function processWithdrawal(
    accountId: string,
    amount: number,
    referenceNote?: string,
    createdBy?: string
): Promise<TransactionResult> {
    try {
        return await apiCall<TransactionResult>('/banking/transactions/withdrawal', {
            method: 'POST',
            body: JSON.stringify({
                account_id: accountId,
                amount,
                reference_note: referenceNote,
                created_by: createdBy,
            }),
        });
    } catch (error: any) {
        console.error('Error processing withdrawal:', error);
        throw new Error(error.message);
    }
}

// ==================== Transaction History ====================

export async function getTransactionsByAccount(
    accountId: string
): Promise<BankTransaction[]> {
    try {
        return await apiCall<BankTransaction[]>(`/banking/transactions/account/${accountId}`);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

export async function getTransactionsByAccountNumber(
    accountNumber: string
): Promise<BankTransaction[]> {
    try {
        const account = await getBankAccountByNumber(accountNumber);
        if (!account) return [];

        return getTransactionsByAccount(account.id);
    } catch (error) {
        console.error('Error fetching transactions by account number:', error);
        return [];
    }
}

export async function getAllTransactions(): Promise<BankTransactionWithAccount[]> {
    try {
        return await apiCall<BankTransactionWithAccount[]>('/banking/transactions');
    } catch (error) {
        console.error('Error fetching all transactions:', error);
        return [];
    }
}

// ==================== Dashboard Statistics ====================

export async function getBankingDashboardStats(): Promise<BankingDashboardStats> {
    try {
        return await apiCall<BankingDashboardStats>('/banking/stats');
    } catch (error) {
        console.error('Error fetching banking stats:', error);
        return {
            total_customers: 0,
            total_accounts: 0,
            active_accounts: 0,
            total_deposits_today: 0,
            total_withdrawals_today: 0,
            total_balance: 0,
            total_transactions_today: 0,
        };
    }
}

// ==================== Reports ====================

export async function getDailyTransactionSummary(
    startDate: string,
    endDate: string
): Promise<DailyTransactionSummary[]> {
    try {
        const params = new URLSearchParams({ startDate, endDate });
        return await apiCall<DailyTransactionSummary[]>(`/banking/stats/daily-summary?${params}`);
    } catch (error) {
        console.error('Error fetching daily summary:', error);
        return [];
    }
}

export async function getCustomerBalanceSummary(): Promise<CustomerBalanceSummary[]> {
    try {
        return await apiCall<CustomerBalanceSummary[]>('/banking/stats/customer-balance');
    } catch (error) {
        console.error('Error fetching customer balance summary:', error);
        return [];
    }
}

// ==================== Image Upload ====================

export async function uploadCustomerPhoto(file: File): Promise<string> {
    console.warn('Customer photo upload not yet implemented in backend');
    throw new Error('Customer photo upload not yet implemented');
}

export async function deleteCustomerPhoto(photoUrl: string): Promise<boolean> {
    console.warn('Customer photo deletion not yet implemented in backend');
    return false;
}

// ==================== Transaction Document Management ====================

export async function uploadTransactionDocument(
    transactionId: string,
    file: File
): Promise<BankTransactionDocument | null> {
    console.warn('Transaction document upload not yet implemented in backend');
    throw new Error('Transaction document upload not yet implemented');
}

export async function getTransactionDocuments(
    transactionId: string
): Promise<BankTransactionDocument[]> {
    console.warn('Transaction documents not yet implemented in backend');
    return [];
}

export async function deleteTransactionDocument(documentId: string): Promise<boolean> {
    console.warn('Transaction document deletion not yet implemented in backend');
    return false;
}

