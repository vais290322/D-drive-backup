/**
 * Banking API Layer for Supabase
 * Handles all banking-related database operations
 */

import { supabase } from './supabase';
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

const STORAGE_BUCKET = 'app-7mzgg63hukg1_banking_images';
const TRANSACTION_DOCS_BUCKET = 'app-7mzgg63hukg1_transaction_documents';

// ==================== Customer Management ====================

export async function getBankCustomers(): Promise<BankCustomerWithAccount[]> {
  const { data, error } = await supabase
    .from('bank_customers')
    .select(`
      *,
      accounts:bank_accounts(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bank customers:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function getBankCustomerById(id: string): Promise<BankCustomerWithAccount | null> {
  const { data, error } = await supabase
    .from('bank_customers')
    .select(`
      *,
      accounts:bank_accounts(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching bank customer:', error);
    return null;
  }

  return data;
}

export async function createBankCustomer(
  customer: Omit<BankCustomer, 'id' | 'created_at' | 'updated_at'>
): Promise<BankCustomer | null> {
  const { data, error } = await supabase
    .from('bank_customers')
    .insert([customer])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating bank customer:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateBankCustomer(
  id: string,
  updates: Partial<BankCustomer>
): Promise<BankCustomer | null> {
  const { data, error } = await supabase
    .from('bank_customers')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating bank customer:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteBankCustomer(id: string): Promise<boolean> {
  const { error } = await supabase.from('bank_customers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting bank customer:', error);
    throw new Error(error.message);
  }

  return true;
}

// ==================== Account Management ====================

export async function getBankAccounts(): Promise<BankAccountWithCustomer[]> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select(`
      *,
      customer:bank_customers(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bank accounts:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function getBankAccountById(id: string): Promise<BankAccountWithCustomer | null> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select(`
      *,
      customer:bank_customers(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching bank account:', error);
    return null;
  }

  return data;
}

export async function getBankAccountByNumber(
  accountNumber: string
): Promise<BankAccountWithCustomer | null> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select(`
      *,
      customer:bank_customers(*)
    `)
    .eq('account_number', accountNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching bank account by number:', error);
    return null;
  }

  return data;
}

export async function getAccountsByCustomer(customerId: string): Promise<BankAccount[]> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching accounts by customer:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function createBankAccount(
  account: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>
): Promise<BankAccount | null> {
  // Check if account number already exists
  const existing = await getBankAccountByNumber(account.account_number);
  if (existing) {
    throw new Error('Account number already exists');
  }

  const { data, error } = await supabase
    .from('bank_accounts')
    .insert([account])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating bank account:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateBankAccount(
  id: string,
  updates: Partial<BankAccount>
): Promise<BankAccount | null> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating bank account:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteBankAccount(id: string): Promise<boolean> {
  const { error } = await supabase.from('bank_accounts').delete().eq('id', id);

  if (error) {
    console.error('Error deleting bank account:', error);
    throw new Error(error.message);
  }

  return true;
}

// ==================== Transaction Operations ====================

export async function processDeposit(
  accountId: string,
  amount: number,
  referenceNote?: string,
  createdBy?: string
): Promise<TransactionResult> {
  const { data, error } = await supabase.rpc('process_deposit', {
    p_account_id: accountId,
    p_amount: amount,
    p_reference_note: referenceNote || null,
    p_created_by: createdBy || null,
  });

  if (error) {
    console.error('Error processing deposit:', error);
    throw new Error(error.message);
  }

  return data as TransactionResult;
}

export async function processWithdrawal(
  accountId: string,
  amount: number,
  referenceNote?: string,
  createdBy?: string
): Promise<TransactionResult> {
  const { data, error } = await supabase.rpc('process_withdrawal', {
    p_account_id: accountId,
    p_amount: amount,
    p_reference_note: referenceNote || null,
    p_created_by: createdBy || null,
  });

  if (error) {
    console.error('Error processing withdrawal:', error);
    throw new Error(error.message);
  }

  return data as TransactionResult;
}

// ==================== Transaction History ====================

export async function getTransactionsByAccount(
  accountId: string
): Promise<BankTransaction[]> {
  const { data, error } = await supabase
    .from('bank_transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function getTransactionsByAccountNumber(
  accountNumber: string
): Promise<BankTransaction[]> {
  const account = await getBankAccountByNumber(accountNumber);
  if (!account) {
    return [];
  }

  return getTransactionsByAccount(account.id);
}

export async function getAllTransactions(): Promise<BankTransactionWithAccount[]> {
  const { data, error } = await supabase
    .from('bank_transactions')
    .select(`
      *,
      account:bank_accounts(
        *,
        customer:bank_customers(*)
      )
    `)
    .order('transaction_date', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching all transactions:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// ==================== Dashboard Statistics ====================

export async function getBankingDashboardStats(): Promise<BankingDashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [customers, accounts, transactions] = await Promise.all([
    getBankCustomers(),
    getBankAccounts(),
    getAllTransactions(),
  ]);

  const activeAccounts = accounts.filter((a) => a.status === 'active');
  const totalBalance = activeAccounts.reduce((sum, a) => sum + Number(a.balance), 0);

  const todayTransactions = transactions.filter(
    (t) => new Date(t.transaction_date) >= today
  );

  const depositsToday = todayTransactions
    .filter((t) => t.transaction_type === 'deposit')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const withdrawalsToday = todayTransactions
    .filter((t) => t.transaction_type === 'withdrawal')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    total_customers: customers.length,
    total_accounts: accounts.length,
    active_accounts: activeAccounts.length,
    total_deposits_today: depositsToday,
    total_withdrawals_today: withdrawalsToday,
    total_balance: totalBalance,
    total_transactions_today: todayTransactions.length,
  };
}

// ==================== Reports ====================

export async function getDailyTransactionSummary(
  startDate: string,
  endDate: string
): Promise<DailyTransactionSummary[]> {
  const { data, error } = await supabase
    .from('bank_transactions')
    .select('*')
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .order('transaction_date', { ascending: true });

  if (error) {
    console.error('Error fetching daily summary:', error);
    return [];
  }

  const transactions = Array.isArray(data) ? data : [];

  // Group by date
  const summaryMap = new Map<string, DailyTransactionSummary>();

  transactions.forEach((t) => {
    const date = new Date(t.transaction_date).toISOString().split('T')[0];
    const existing = summaryMap.get(date) || {
      date,
      total_deposits: 0,
      total_withdrawals: 0,
      transaction_count: 0,
      net_change: 0,
    };

    if (t.transaction_type === 'deposit') {
      existing.total_deposits += Number(t.amount);
    } else {
      existing.total_withdrawals += Number(t.amount);
    }

    existing.transaction_count += 1;
    existing.net_change = existing.total_deposits - existing.total_withdrawals;

    summaryMap.set(date, existing);
  });

  return Array.from(summaryMap.values());
}

export async function getCustomerBalanceSummary(): Promise<CustomerBalanceSummary[]> {
  const accounts = await getBankAccounts();

  const summaries: CustomerBalanceSummary[] = [];

  for (const account of accounts) {
    if (!account.customer) continue;

    const transactions = await getTransactionsByAccount(account.id);
    const lastTransaction = transactions[0];

    summaries.push({
      customer_id: account.customer.id,
      customer_name: account.customer.full_name,
      account_number: account.account_number,
      balance: Number(account.balance),
      last_transaction_date: lastTransaction?.transaction_date || null,
    });
  }

  return summaries.sort((a, b) => b.balance - a.balance);
}

// ==================== Image Upload ====================

export async function uploadCustomerPhoto(file: File): Promise<string> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.');
  }

  // Validate file size (1 MB)
  if (file.size > 1048576) {
    throw new Error('File size exceeds 1 MB. Please compress the image.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `customers/${fileName}`;

  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading photo:', error);
    throw new Error(error.message);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteCustomerPhoto(photoUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('customers')).join('/');

    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

    if (error) {
      console.error('Error deleting photo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error parsing photo URL:', error);
    return false;
  }
}

// ==================== Transaction Document Management ====================

export async function uploadTransactionDocument(
  transactionId: string,
  file: File
): Promise<BankTransactionDocument | null> {
  // Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      'Invalid file type. Only JPEG, PNG, WEBP, GIF, and PDF are allowed.'
    );
  }

  // Validate file size (5 MB)
  if (file.size > 5242880) {
    throw new Error('File size exceeds 5 MB. Please use a smaller file.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `transactions/${transactionId}/${fileName}`;

  // Upload to Supabase storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(TRANSACTION_DOCS_BUCKET)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading document:', uploadError);
    throw new Error(uploadError.message);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(TRANSACTION_DOCS_BUCKET)
    .getPublicUrl(filePath);

  // Save document record to database
  const { data, error } = await supabase
    .from('bank_transaction_documents')
    .insert([
      {
        transaction_id: transactionId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving document record:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function getTransactionDocuments(
  transactionId: string
): Promise<BankTransactionDocument[]> {
  const { data, error } = await supabase
    .from('bank_transaction_documents')
    .select('*')
    .eq('transaction_id', transactionId)
    .order('uploaded_at', { ascending: true });

  if (error) {
    console.error('Error fetching transaction documents:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function deleteTransactionDocument(documentId: string): Promise<boolean> {
  // Get document info first
  const { data: doc, error: fetchError } = await supabase
    .from('bank_transaction_documents')
    .select('file_url')
    .eq('id', documentId)
    .maybeSingle();

  if (fetchError || !doc) {
    console.error('Error fetching document:', fetchError);
    return false;
  }

  // Extract file path from URL
  try {
    const url = new URL(doc.file_url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('transactions')).join('/');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(TRANSACTION_DOCS_BUCKET)
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }
  } catch (error) {
    console.error('Error parsing file URL:', error);
  }

  // Delete database record
  const { error: deleteError } = await supabase
    .from('bank_transaction_documents')
    .delete()
    .eq('id', documentId);

  if (deleteError) {
    console.error('Error deleting document record:', deleteError);
    return false;
  }

  return true;
}
