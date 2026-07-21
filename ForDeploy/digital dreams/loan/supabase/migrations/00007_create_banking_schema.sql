/*
# Banking Module Schema

## Overview
This migration creates the complete database structure for the Banking module, including:
- Customer management with photo storage
- Bank accounts with manual account numbers
- Transaction tracking (deposits and withdrawals)
- Balance management and history

## Tables

### 1. bank_customers
Stores customer information including personal details and photo.
- `id` (uuid, primary key) - Unique customer identifier
- `full_name` (text, required) - Customer's full name
- `phone` (text) - Contact phone number
- `email` (text) - Email address
- `address` (text) - Physical address
- `photo_url` (text) - URL to customer photo in Supabase storage
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### 2. bank_accounts
Stores bank account information with manually assigned account numbers.
- `id` (uuid, primary key) - Unique account identifier
- `customer_id` (uuid, foreign key) - References bank_customers
- `account_number` (text, unique, required) - Manually assigned account number
- `account_type` (text) - Type of account (savings, current, etc.)
- `balance` (numeric, default 0) - Current account balance
- `status` (text, default 'active') - Account status (active, closed, suspended)
- `opening_date` (date) - Date account was opened
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### 3. bank_transactions
Records all banking transactions (deposits and withdrawals).
- `id` (uuid, primary key) - Unique transaction identifier
- `account_id` (uuid, foreign key) - References bank_accounts
- `transaction_type` (text, required) - 'deposit' or 'withdrawal'
- `amount` (numeric, required) - Transaction amount
- `balance_after` (numeric, required) - Account balance after transaction
- `reference_note` (text) - Optional transaction note/reference
- `transaction_date` (timestamptz, default now()) - Transaction timestamp
- `created_by` (text) - User who created the transaction
- `created_at` (timestamptz) - Record creation timestamp

## Storage Bucket
- Bucket name: `app-7mzgg63hukg1_banking_images`
- Purpose: Store customer photos
- Max file size: 1 MB
- Allowed formats: JPEG, PNG, WEBP, GIF

## Security
- No RLS enabled for maximum flexibility
- All users have full CRUD access
- Suitable for trusted admin environments

## Indexes
- Index on account_number for fast lookups
- Index on customer_id in accounts table
- Index on account_id in transactions table
- Index on transaction_date for statement queries
*/

-- Create bank_customers table
CREATE TABLE IF NOT EXISTS bank_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  email text,
  address text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES bank_customers(id) ON DELETE CASCADE,
  account_number text UNIQUE NOT NULL,
  account_type text DEFAULT 'savings',
  balance numeric(15, 2) DEFAULT 0 CHECK (balance >= 0),
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'suspended')),
  opening_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bank_transactions table
CREATE TABLE IF NOT EXISTS bank_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal')),
  amount numeric(15, 2) NOT NULL CHECK (amount > 0),
  balance_after numeric(15, 2) NOT NULL,
  reference_note text,
  transaction_date timestamptz DEFAULT now(),
  created_by text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bank_accounts_customer_id ON bank_accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_account_number ON bank_accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account_id ON bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_type ON bank_transactions(transaction_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_bank_customers_updated_at
  BEFORE UPDATE ON bank_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for customer photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-7mzgg63hukg1_banking_images',
  'app-7mzgg63hukg1_banking_images',
  true,
  1048576, -- 1 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public access (no auth required)
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
USING (bucket_id = 'app-7mzgg63hukg1_banking_images');

-- Create RPC function for deposit transaction
CREATE OR REPLACE FUNCTION process_deposit(
  p_account_id uuid,
  p_amount numeric,
  p_reference_note text DEFAULT NULL,
  p_created_by text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance numeric;
  v_transaction_id uuid;
BEGIN
  -- Lock the account row for update
  SELECT balance INTO v_new_balance
  FROM bank_accounts
  WHERE id = p_account_id
  FOR UPDATE;

  -- Check if account exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found';
  END IF;

  -- Calculate new balance
  v_new_balance := v_new_balance + p_amount;

  -- Update account balance
  UPDATE bank_accounts
  SET balance = v_new_balance
  WHERE id = p_account_id;

  -- Insert transaction record
  INSERT INTO bank_transactions (
    account_id,
    transaction_type,
    amount,
    balance_after,
    reference_note,
    created_by
  ) VALUES (
    p_account_id,
    'deposit',
    p_amount,
    v_new_balance,
    p_reference_note,
    p_created_by
  )
  RETURNING id INTO v_transaction_id;

  -- Return transaction details
  RETURN json_build_object(
    'transaction_id', v_transaction_id,
    'new_balance', v_new_balance,
    'success', true
  );
END;
$$;

-- Create RPC function for withdrawal transaction
CREATE OR REPLACE FUNCTION process_withdrawal(
  p_account_id uuid,
  p_amount numeric,
  p_reference_note text DEFAULT NULL,
  p_created_by text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance numeric;
  v_new_balance numeric;
  v_transaction_id uuid;
BEGIN
  -- Lock the account row for update
  SELECT balance INTO v_current_balance
  FROM bank_accounts
  WHERE id = p_account_id
  FOR UPDATE;

  -- Check if account exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found';
  END IF;

  -- Check sufficient balance
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance. Current balance: %', v_current_balance;
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance - p_amount;

  -- Update account balance
  UPDATE bank_accounts
  SET balance = v_new_balance
  WHERE id = p_account_id;

  -- Insert transaction record
  INSERT INTO bank_transactions (
    account_id,
    transaction_type,
    amount,
    balance_after,
    reference_note,
    created_by
  ) VALUES (
    p_account_id,
    'withdrawal',
    p_amount,
    v_new_balance,
    p_reference_note,
    p_created_by
  )
  RETURNING id INTO v_transaction_id;

  -- Return transaction details
  RETURN json_build_object(
    'transaction_id', v_transaction_id,
    'new_balance', v_new_balance,
    'success', true
  );
END;
$$;