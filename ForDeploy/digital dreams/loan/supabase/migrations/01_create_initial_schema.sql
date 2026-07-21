/*
# Digital Dreems Loan Management CRM - Initial Schema

## 1. Overview
This migration creates the complete database structure for the Digital Dreems Loan Management CRM system,
including user profiles, customers, products, loans, payments, penalties, and document storage.

## 2. New Tables

### 2.1 profiles
User management table with role-based access control
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `role` (user_role enum: super_admin, admin, loan_manager, collection_agent, data_entry, kyc_verifier)
- `created_at` (timestamptz)

### 2.2 customers
Customer master data with KYC information
- All customer fields as per requirements

### 2.3 products
Product/device master for loan items

### 2.4 loans
Loan management with EMI calculations

### 2.5 emi_payments
EMI collection and payment tracking

### 2.6 penalties
Penalty charges management

## 3. Storage Buckets
- `app-7mzgg63hukg1_documents` - For KYC documents, invoices, photos

## 4. Security
- Enable RLS on all tables
- Role-based access control for all operations
- First registered user becomes super_admin

## 5. Functions
- Auto-generation functions for codes and IDs
- Role checking functions
- User registration trigger
*/

-- Create user role enum
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin', 
  'loan_manager',
  'collection_agent',
  'data_entry',
  'kyc_verifier'
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  role user_role DEFAULT 'data_entry'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code text UNIQUE NOT NULL,
  full_name text NOT NULL,
  father_name text,
  mother_name text,
  spouse_name text,
  date_of_birth date,
  gender text,
  nationality text DEFAULT 'Indian',
  marital_status text,
  marriage_anniversary date,
  email text,
  mobile_primary text NOT NULL,
  mobile_secondary text,
  permanent_address text,
  current_address text,
  city text,
  district text,
  state text,
  pin_code text,
  address_proof_url text,
  aadhaar_number text,
  pan_number text,
  voter_id text,
  driving_license text,
  aadhaar_front_url text,
  aadhaar_back_url text,
  pan_card_url text,
  photo_url text,
  signature_url text,
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_verified_by uuid REFERENCES profiles(id),
  kyc_verified_at timestamptz,
  kyc_remarks text,
  bank_name text,
  account_holder_name text,
  account_number text,
  ifsc_code text,
  branch_name text,
  cancelled_cheque_url text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('mobile', 'laptop', 'tv', 'vehicle', 'others')),
  brand text,
  model text,
  serial_number text,
  imei_1 text,
  imei_2 text,
  color text,
  ram_rom text,
  purchase_price numeric(12, 2),
  invoice_url text,
  photo_url text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'sold')),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id text UNIQUE NOT NULL,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  loan_type text NOT NULL CHECK (loan_type IN ('daily', 'weekly', 'monthly')),
  principal_amount numeric(12, 2) NOT NULL,
  processing_fee numeric(12, 2) DEFAULT 0,
  insurance_fee numeric(12, 2) DEFAULT 0,
  tenure_months integer NOT NULL,
  interest_type text NOT NULL CHECK (interest_type IN ('flat', 'reducing')),
  interest_rate numeric(5, 2) NOT NULL,
  total_interest numeric(12, 2) NOT NULL,
  total_payable numeric(12, 2) NOT NULL,
  installment_amount numeric(12, 2) NOT NULL,
  start_date date NOT NULL,
  first_emi_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'closed')),
  guarantor_name text,
  guarantor_mobile text,
  guarantor_address text,
  guarantor_relation text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create emi_payments table
CREATE TABLE IF NOT EXISTS emi_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  payment_date date NOT NULL,
  amount_paid numeric(12, 2) NOT NULL,
  payment_mode text NOT NULL CHECK (payment_mode IN ('cash', 'upi', 'bank_transfer')),
  transaction_reference text,
  collected_by uuid REFERENCES profiles(id),
  remarks text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emi_payments ENABLE ROW LEVEL SECURITY;

-- Create penalties table
CREATE TABLE IF NOT EXISTS penalties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  penalty_type text NOT NULL CHECK (penalty_type IN ('cheque_bounce', 'ecs_return', 'late_emi', 'manual')),
  amount numeric(12, 2) NOT NULL,
  reason text,
  applied_by uuid REFERENCES profiles(id),
  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-7mzgg63hukg1_documents', 'app-7mzgg63hukg1_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Anyone can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-7mzgg63hukg1_documents');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'app-7mzgg63hukg1_documents');

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'app-7mzgg63hukg1_documents');

-- Helper functions
CREATE OR REPLACE FUNCTION is_super_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION is_admin_or_above(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role IN ('super_admin', 'admin')
  );
$$;

-- Auto-generate customer code
CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  new_code text;
  code_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(customer_code FROM 5) AS integer)), 0) + 1
  INTO code_num
  FROM customers;
  
  new_code := 'CUST' || LPAD(code_num::text, 6, '0');
  RETURN new_code;
END;
$$;

-- Auto-generate product code
CREATE OR REPLACE FUNCTION generate_product_code()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  new_code text;
  code_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(product_code FROM 5) AS integer)), 0) + 1
  INTO code_num
  FROM products;
  
  new_code := 'PROD' || LPAD(code_num::text, 6, '0');
  RETURN new_code;
END;
$$;

-- Auto-generate loan ID
CREATE OR REPLACE FUNCTION generate_loan_id()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  new_id text;
  id_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(loan_id FROM 5) AS integer)), 0) + 1
  INTO id_num
  FROM loans;
  
  new_id := 'LOAN' || LPAD(id_num::text, 6, '0');
  RETURN new_id;
END;
$$;

-- Trigger to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    INSERT INTO profiles (id, email, role)
    VALUES (
      NEW.id,
      NEW.email,
      CASE WHEN user_count = 0 THEN 'super_admin'::user_role ELSE 'data_entry'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Super admins have full access to profiles"
ON profiles FOR ALL
TO authenticated
USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- RLS Policies for customers
CREATE POLICY "Admins have full access to customers"
ON customers FOR ALL
TO authenticated
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Staff can view customers"
ON customers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Data entry and above can insert customers"
ON customers FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager', 'data_entry', 'kyc_verifier')
  )
);

CREATE POLICY "Data entry and above can update customers"
ON customers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager', 'data_entry', 'kyc_verifier')
  )
);

-- RLS Policies for products
CREATE POLICY "Admins have full access to products"
ON products FOR ALL
TO authenticated
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Staff can view products"
ON products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Data entry and above can manage products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager', 'data_entry')
  )
);

CREATE POLICY "Data entry and above can update products"
ON products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager', 'data_entry')
  )
);

-- RLS Policies for loans
CREATE POLICY "Admins have full access to loans"
ON loans FOR ALL
TO authenticated
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Staff can view loans"
ON loans FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Loan managers and above can manage loans"
ON loans FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager')
  )
);

CREATE POLICY "Loan managers and above can update loans"
ON loans FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager')
  )
);

-- RLS Policies for emi_payments
CREATE POLICY "Admins have full access to payments"
ON emi_payments FOR ALL
TO authenticated
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Staff can view payments"
ON emi_payments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Collection agents and above can record payments"
ON emi_payments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager', 'collection_agent')
  )
);

-- RLS Policies for penalties
CREATE POLICY "Admins have full access to penalties"
ON penalties FOR ALL
TO authenticated
USING (is_admin_or_above(auth.uid()));

CREATE POLICY "Staff can view penalties"
ON penalties FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Loan managers and above can apply penalties"
ON penalties FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'loan_manager')
  )
);

-- Create indexes for better performance
CREATE INDEX idx_customers_mobile ON customers(mobile_primary);
CREATE INDEX idx_customers_kyc_status ON customers(kyc_status);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_loans_customer ON loans(customer_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_emi_payments_loan ON emi_payments(loan_id);
CREATE INDEX idx_penalties_loan ON penalties(loan_id);
