/*
# Add Transaction Documents Support

## Overview
This migration adds support for multiple document uploads (images/PDFs) for banking transactions.
Users can upload supporting documents when making deposits or withdrawals, and later view,
download, or print these documents from the transaction statement.

## Changes

### 1. New Table: bank_transaction_documents
Stores uploaded documents associated with transactions.
- `id` (uuid, primary key) - Unique document identifier
- `transaction_id` (uuid, foreign key) - References bank_transactions
- `file_name` (text, required) - Original filename
- `file_url` (text, required) - URL to file in Supabase storage
- `file_type` (text, required) - MIME type (image/*, application/pdf)
- `file_size` (integer) - File size in bytes
- `uploaded_at` (timestamptz) - Upload timestamp

### 2. Storage Bucket
- Create bucket for transaction documents
- Bucket name: `app-7mzgg63hukg1_transaction_documents`
- Max file size: 5 MB
- Allowed formats: Images (JPEG, PNG, WEBP, GIF) and PDF

### 3. Indexes
- Index on transaction_id for fast document lookups

### 4. Security
- No RLS enabled (trusted admin environment)
- Public read access for viewing documents
- All users can upload documents
*/

-- Create bank_transaction_documents table
CREATE TABLE IF NOT EXISTS bank_transaction_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES bank_transactions(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  uploaded_at timestamptz DEFAULT now()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_transaction_documents_transaction_id 
  ON bank_transaction_documents(transaction_id);

-- Create storage bucket for transaction documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-7mzgg63hukg1_transaction_documents',
  'app-7mzgg63hukg1_transaction_documents',
  true,
  5242880, -- 5 MB
  ARRAY[
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'image/gif',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public access
CREATE POLICY "Public Access for Transaction Documents"
ON storage.objects FOR ALL
USING (bucket_id = 'app-7mzgg63hukg1_transaction_documents');

-- Update process_deposit RPC to return transaction_id for document upload
-- (Already returns transaction_id, no changes needed)

-- Update process_withdrawal RPC to return transaction_id for document upload
-- (Already returns transaction_id, no changes needed)

-- Create helper function to get transaction documents
CREATE OR REPLACE FUNCTION get_transaction_documents(p_transaction_id uuid)
RETURNS TABLE (
  id uuid,
  transaction_id uuid,
  file_name text,
  file_url text,
  file_type text,
  file_size integer,
  uploaded_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    transaction_id,
    file_name,
    file_url,
    file_type,
    file_size,
    uploaded_at
  FROM bank_transaction_documents
  WHERE transaction_id = p_transaction_id
  ORDER BY uploaded_at ASC;
$$;