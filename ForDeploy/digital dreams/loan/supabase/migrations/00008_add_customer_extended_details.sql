/*
# Add Extended Customer Details

## Overview
This migration adds comprehensive customer information fields to support detailed KYC and banking requirements.

## Changes to bank_customers table
Adding the following fields:
- `father_name` (text) - Father's name
- `mother_name` (text) - Mother's name
- `date_of_birth` (date) - Date of birth
- `gender` (text) - Gender (male, female, other)
- `marital_status` (text) - Marital status (single, married, divorced, widowed)
- `nationality` (text) - Nationality
- `occupation` (text) - Occupation/profession
- `annual_income` (numeric) - Annual income
- `pan_number` (text) - PAN card number
- `aadhaar_number` (text) - Aadhaar card number
- `alternate_phone` (text) - Alternate contact number
- `emergency_contact_name` (text) - Emergency contact person name
- `emergency_contact_phone` (text) - Emergency contact phone
- `permanent_address` (text) - Permanent address
- `city` (text) - City
- `state` (text) - State
- `pincode` (text) - PIN code
- `alternate_bank_name` (text) - Alternate bank name
- `alternate_bank_account_number` (text) - Alternate bank account number
- `alternate_bank_ifsc` (text) - Alternate bank IFSC code
- `alternate_bank_branch` (text) - Alternate bank branch name

## Notes
- All new fields are optional to maintain backward compatibility
- Existing customer records will have NULL values for new fields
- No data migration required
*/

-- Add extended customer details to bank_customers table
ALTER TABLE bank_customers
ADD COLUMN IF NOT EXISTS father_name text,
ADD COLUMN IF NOT EXISTS mother_name text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IS NULL OR gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS marital_status text CHECK (marital_status IS NULL OR marital_status IN ('single', 'married', 'divorced', 'widowed')),
ADD COLUMN IF NOT EXISTS nationality text DEFAULT 'Indian',
ADD COLUMN IF NOT EXISTS occupation text,
ADD COLUMN IF NOT EXISTS annual_income numeric(15, 2),
ADD COLUMN IF NOT EXISTS pan_number text,
ADD COLUMN IF NOT EXISTS aadhaar_number text,
ADD COLUMN IF NOT EXISTS alternate_phone text,
ADD COLUMN IF NOT EXISTS emergency_contact_name text,
ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
ADD COLUMN IF NOT EXISTS permanent_address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text,
ADD COLUMN IF NOT EXISTS alternate_bank_name text,
ADD COLUMN IF NOT EXISTS alternate_bank_account_number text,
ADD COLUMN IF NOT EXISTS alternate_bank_ifsc text,
ADD COLUMN IF NOT EXISTS alternate_bank_branch text;

-- Create indexes for frequently searched fields
CREATE INDEX IF NOT EXISTS idx_bank_customers_pan ON bank_customers(pan_number) WHERE pan_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bank_customers_aadhaar ON bank_customers(aadhaar_number) WHERE aadhaar_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bank_customers_city ON bank_customers(city) WHERE city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bank_customers_pincode ON bank_customers(pincode) WHERE pincode IS NOT NULL;

-- Add comment to table
COMMENT ON TABLE bank_customers IS 'Extended customer information including KYC details, alternate bank information, and emergency contacts';
