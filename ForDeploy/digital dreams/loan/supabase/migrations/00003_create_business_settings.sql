/*
# Create Business Settings Table

## Overview
This migration creates a table to store business/company settings that will be used across all documents (invoices, ledgers, agreements, NOC, etc.).

## Tables Created

### `business_settings`
- `id` (uuid, primary key) - Unique identifier
- `company_name` (text, not null) - Business/Store name
- `tagline` (text) - Company tagline/slogan
- `logo_url` (text) - URL to company logo image
- `address_line1` (text) - Address line 1
- `address_line2` (text) - Address line 2
- `city` (text) - City
- `state` (text) - State/Province
- `pincode` (text) - PIN/ZIP code
- `country` (text) - Country
- `phone` (text) - Primary phone number
- `alternate_phone` (text) - Secondary phone number
- `email` (text) - Business email
- `website` (text) - Company website
- `gstin` (text) - GST/Tax identification number
- `pan` (text) - PAN number
- `bank_name` (text) - Bank name for payments
- `bank_account` (text) - Bank account number
- `bank_ifsc` (text) - Bank IFSC code
- `terms_conditions` (text) - Default terms and conditions
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

## Security
- No RLS enabled - settings are public and accessible to all authenticated users
- Only one settings record should exist (enforced by application logic)

## Notes
- This is a singleton table (only one row should exist)
- Default values are inserted for "Digital Dreems"
- Logo will be stored in Supabase Storage and URL saved here
*/

-- Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Digital Dreems',
  tagline text DEFAULT 'Loan Management CRM',
  logo_url text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  country text DEFAULT 'India',
  phone text,
  alternate_phone text,
  email text,
  website text,
  gstin text,
  pan text,
  bank_name text,
  bank_account text,
  bank_ifsc text,
  terms_conditions text DEFAULT 'All payments are subject to our standard terms and conditions. Late payment charges may apply.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO business_settings (
  company_name,
  tagline,
  address_line1,
  city,
  state,
  country,
  phone,
  email
) VALUES (
  'Digital Dreems',
  'Loan Management CRM',
  'Business Address',
  'Your City',
  'Your State',
  'India',
  '+91 9876543210',
  'info@digitaldreems.com'
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_settings_updated_at
  BEFORE UPDATE ON business_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-logos', 'business-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to logos
CREATE POLICY "Public Access to Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-logos');

-- Allow authenticated users to upload logos
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-logos');

-- Allow authenticated users to update logos
CREATE POLICY "Authenticated users can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'business-logos');

-- Allow authenticated users to delete logos
CREATE POLICY "Authenticated users can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'business-logos');