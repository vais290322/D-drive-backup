export type UserRole = 'super_admin' | 'admin' | 'loan_manager' | 'collection_agent' | 'data_entry' | 'kyc_verifier';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export type KycStatus = 'pending' | 'verified' | 'rejected';

export type ProductCategory = 'mobile' | 'laptop' | 'tv' | 'vehicle' | 'others';

export type ProductStatus = 'available' | 'assigned' | 'sold';

export type LoanType = 'daily' | 'weekly' | 'monthly';

export type InterestType = 'flat' | 'reducing';

export type LoanStatus = 'active' | 'completed' | 'defaulted' | 'closed';

export type PaymentMode = 'cash' | 'upi' | 'bank_transfer';

export type PenaltyType = 'cheque_bounce' | 'ecs_return' | 'late_emi' | 'manual';

export type EmiScheduleStatus = 'pending' | 'paid' | 'overdue' | 'partial';

export interface EmiSchedule {
  id: string;
  loan_id: string;
  emi_number: number;
  due_date: string;
  principal_component: number;
  interest_component: number;
  emi_amount: number;
  opening_balance: number;
  closing_balance: number;
  status: EmiScheduleStatus;
  paid_amount: number;
  paid_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  password?: string; // Optional for security, only used during auth
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  customer_code: string;
  full_name: string;
  father_name: string | null;
  mother_name: string | null;
  spouse_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  marital_status: string | null;
  marriage_anniversary: string | null;
  email: string | null;
  mobile_primary: string;
  mobile_secondary: string | null;
  whatsapp_number: string | null;
  permanent_address: string | null;
  current_address: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  pin_code: string | null;
  address_proof_url: string | null;
  aadhaar_number: string | null;
  pan_number: string | null;
  voter_id: string | null;
  driving_license: string | null;
  aadhaar_front_url: string | null;
  aadhaar_back_url: string | null;
  pan_card_url: string | null;
  other_doc_name: string | null;
  other_doc_number: string | null;
  other_doc_url: string | null;
  photo_url: string | null;
  signature_url: string | null;
  kyc_status: KycStatus;
  kyc_verified_by: string | null;
  kyc_verified_at: string | null;
  kyc_remarks: string | null;
  kyc_photo_url: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  branch_name: string | null;
  cancelled_cheque_url: string | null;
  last_call_date: string | null;
  next_followup_date: string | null;
  feedback: string | null;

  // Manual Loan Details
  manual_loan_details?: {
    loan_id?: string;
    loan_purpose?: string;
    agreement_number?: string;
    item_name?: string;
    item_serial_number?: string;
    item_description?: string;
    loan_amount?: number;
    processing_fee?: number;
    insurance_fee?: number;
    emi_amount?: number;
    emi_start_date?: string;
    emi_end_date?: string;
    interest_rate?: number;
  };

  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  product_code: string;
  category: ProductCategory;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  imei_1: string | null;
  imei_2: string | null;
  color: string | null;
  ram_rom: string | null;
  purchase_price: number | null;
  invoice_url: string | null;
  photo_url: string | null;
  status: ProductStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  _id: string; // Mongoose ID
  id?: string; // Virtual ID (optional)
  loan_code?: string; // Actual loan code from DB
  loan_id: string;
  customer_id: string;
  product_id: string | null;
  loan_type: LoanType;
  down_payment?: number;
  principal_amount: number;
  processing_fee: number;
  insurance_fee: number;
  tenure_months: number;
  interest_type: InterestType;
  interest_rate: number;
  total_interest: number;
  total_payable: number;
  installment_amount: number;
  start_date: string;
  first_emi_date: string;
  emi_day_of_month: number;
  status: LoanStatus;
  closed_date: string | null;
  outstanding_amount?: number; // Added for list view
  guarantor_name: string | null;
  guarantor_mobile: string | null;
  guarantor_address: string | null;
  guarantor_relation: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmiPayment {
  id: string;
  loan_id: string;
  payment_date: string;
  amount_paid: number;
  payment_mode: PaymentMode;
  transaction_reference: string | null;
  collected_by: string | null;
  remarks: string | null;
  created_at: string;
}

export interface Penalty {
  id: string;
  loan_id: string;
  penalty_type: PenaltyType;
  amount: number;
  reason: string | null;
  applied_by: string | null;
  applied_at: string;
  created_at: string;
}

export interface Guarantor {
  id: string;
  loan_id: string;
  name: string;
  mobile_number: string;
  address: string | null;
  relation: string | null;
  created_at: string;
}

export interface LoanWithDetails extends Loan {
  customer?: Customer;
  product?: Product;
  payments?: EmiPayment[];
  penalties?: Penalty[];
  emi_schedule?: EmiSchedule[];
}

export interface DashboardStats {
  total_customers: number;
  active_loans: number;
  completed_loans: number;
  delayed_emis: number;
  total_collection_today: number;
  total_outstanding: number;
  total_disbursed: number;
}

export interface DashboardEvent {
  type: 'birthday' | 'anniversary' | 'loan_closure';
  message: string;
  date: string;
  customer_name: string;
  customer_phone: string;
  customer_id: string;
}

export interface LoanLedger {
  loan: LoanWithDetails;
  principal: number;
  interest: number;
  processing_fee: number;
  insurance_fee: number;
  total_penalties: number;
  total_payable: number;
  total_paid: number;
  total_outstanding: number;
  payment_history: EmiPayment[];
  penalty_history: Penalty[];
}

export interface BusinessSettings {
  id: string;
  company_name: string;
  tagline: string | null;
  logo_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
  phone: string | null;
  alternate_phone: string | null;
  email: string | null;
  website: string | null;
  gstin: string | null;
  pan: string | null;
  bank_name: string | null;
  bank_account: string | null;
  bank_ifsc: string | null;
  terms_conditions: string | null;
  created_at: string;
  updated_at: string;
}

// CRM Types
export interface Company {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  employee_count: number | null;
  annual_revenue: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  title: string | null;
  department: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  lead_source: string | null;
  lead_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  company_id: string | null;
  contact_id: string | null;
  title: string;
  description: string | null;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  lost_reason: string | null;
  priority: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  activity_type: string;
  subject: string;
  description: string | null;
  activity_date: string;
  duration_minutes: number | null;
  outcome: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string;
  status: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactWithCompany extends Contact {
  company?: Company;
}

export interface DealWithRelations extends Deal {
  company?: Company;
  contact?: Contact;
}

export interface ActivityWithRelations extends Activity {
  contact?: Contact;
  company?: Company;
  deal?: Deal;
}

export interface TaskWithRelations extends Task {
  contact?: Contact;
  company?: Company;
  deal?: Deal;
}

// Banking Module Types
export type AccountStatus = 'active' | 'closed' | 'suspended';
export type TransactionType = 'deposit' | 'withdrawal';

export interface BankCustomer {
  _id?: string;
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  photo_url: string | null;
  father_name: string | null;
  mother_name: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null;
  nationality: string | null;
  occupation: string | null;
  annual_income: number | null;
  pan_number: string | null;
  aadhaar_number: string | null;
  alternate_phone: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  permanent_address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  alternate_bank_name: string | null;
  alternate_bank_account_number: string | null;
  alternate_bank_ifsc: string | null;
  alternate_bank_branch: string | null;
  next_payment_date: string | null;
  payment_feedback_history?: {
    date: string;
    feedback: string;
    created_by?: string;
    payment_date?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  _id?: string;
  id: string;
  customer_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  status: AccountStatus;
  opening_date: string;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  _id?: string;
  id: string;
  transaction_id?: string; // Human readable ID
  account_id: string;
  transaction_type: TransactionType;
  amount: number;
  balance_before?: number; // Added for statement calculation
  balance_after: number;
  reference_note: string | null;
  transaction_date: string;
  created_by: string | null;
  created_at: string;
}

export interface BankTransactionDocument {
  id: string;
  transaction_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  uploaded_at: string;
}

export interface BankCustomerWithAccount extends BankCustomer {
  accounts?: BankAccount[];
}

export interface BankAccountWithCustomer extends BankAccount {
  customer?: BankCustomer;
}

export interface BankTransactionWithAccount extends BankTransaction {
  account?: BankAccountWithCustomer;
  documents?: BankTransactionDocument[];
}

export interface BankingDashboardStats {
  total_customers: number;
  total_accounts: number;
  active_accounts: number;
  total_deposits_today: number;
  total_withdrawals_today: number;
  total_balance: number;
  total_transactions_today: number;
}

export interface TransactionResult {
  transaction_id: string;
  new_balance: number;
  success: boolean;
}

export interface DailyTransactionSummary {
  date: string;
  total_deposits: number;
  total_withdrawals: number;
  transaction_count: number;
  net_change: number;
}

export interface CustomerBalanceSummary {
  customer_id: string;
  customer_name: string;
  account_number: string;
  balance: number;
  last_transaction_date: string | null;
}


