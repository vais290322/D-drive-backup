/*
# CRM System Database Schema

## Overview
Complete database schema for a Customer Relationship Management system with contacts, companies, deals, activities, and tasks.

## Tables

### 1. companies
- `id` (uuid, primary key, default: gen_random_uuid())
- `name` (text, required) - Company name
- `industry` (text) - Industry sector
- `website` (text) - Company website URL
- `phone` (text) - Primary phone number
- `email` (text) - Primary email address
- `address` (text) - Physical address
- `city` (text) - City
- `state` (text) - State/Province
- `country` (text) - Country
- `postal_code` (text) - Postal/ZIP code
- `employee_count` (integer) - Number of employees
- `annual_revenue` (numeric) - Annual revenue
- `notes` (text) - Additional notes
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### 2. contacts
- `id` (uuid, primary key, default: gen_random_uuid())
- `company_id` (uuid, references companies) - Associated company
- `first_name` (text, required) - First name
- `last_name` (text, required) - Last name
- `email` (text) - Email address
- `phone` (text) - Phone number
- `mobile` (text) - Mobile number
- `title` (text) - Job title
- `department` (text) - Department
- `address` (text) - Physical address
- `city` (text) - City
- `state` (text) - State/Province
- `country` (text) - Country
- `postal_code` (text) - Postal/ZIP code
- `linkedin_url` (text) - LinkedIn profile URL
- `twitter_handle` (text) - Twitter handle
- `lead_source` (text) - How contact was acquired
- `lead_status` (text, default: 'new') - Current lead status
- `notes` (text) - Additional notes
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### 3. deals
- `id` (uuid, primary key, default: gen_random_uuid())
- `company_id` (uuid, references companies) - Associated company
- `contact_id` (uuid, references contacts) - Primary contact
- `title` (text, required) - Deal title
- `description` (text) - Deal description
- `value` (numeric, required) - Deal value/amount
- `currency` (text, default: 'USD') - Currency code
- `stage` (text, default: 'lead') - Current pipeline stage
- `probability` (integer, default: 0) - Win probability (0-100)
- `expected_close_date` (date) - Expected closing date
- `actual_close_date` (date) - Actual closing date
- `lost_reason` (text) - Reason if deal was lost
- `priority` (text, default: 'medium') - Deal priority
- `notes` (text) - Additional notes
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### 4. activities
- `id` (uuid, primary key, default: gen_random_uuid())
- `contact_id` (uuid, references contacts) - Related contact
- `company_id` (uuid, references companies) - Related company
- `deal_id` (uuid, references deals) - Related deal
- `activity_type` (text, required) - Type: call, email, meeting, note
- `subject` (text, required) - Activity subject
- `description` (text) - Detailed description
- `activity_date` (timestamptz, default: now()) - When activity occurred
- `duration_minutes` (integer) - Duration in minutes
- `outcome` (text) - Activity outcome
- `created_at` (timestamptz, default: now())

### 5. tasks
- `id` (uuid, primary key, default: gen_random_uuid())
- `contact_id` (uuid, references contacts) - Related contact
- `company_id` (uuid, references companies) - Related company
- `deal_id` (uuid, references deals) - Related deal
- `title` (text, required) - Task title
- `description` (text) - Task description
- `due_date` (timestamptz) - Due date
- `priority` (text, default: 'medium') - Priority level
- `status` (text, default: 'pending') - Task status
- `completed_at` (timestamptz) - Completion timestamp
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

## Security
- No RLS enabled - public access for all users
- All tables allow full CRUD operations
- Designed for single-tenant or trusted multi-user environment

## Indexes
- Created indexes on foreign keys for performance
- Created indexes on commonly queried fields (email, status, stage)
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  website text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  country text,
  postal_code text,
  employee_count integer,
  annual_revenue numeric,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  mobile text,
  title text,
  department text,
  address text,
  city text,
  state text,
  country text,
  postal_code text,
  linkedin_url text,
  twitter_handle text,
  lead_source text,
  lead_status text DEFAULT 'new',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  value numeric NOT NULL,
  currency text DEFAULT 'USD',
  stage text DEFAULT 'lead',
  probability integer DEFAULT 0,
  expected_close_date date,
  actual_close_date date,
  lost_reason text,
  priority text DEFAULT 'medium',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  subject text NOT NULL,
  description text,
  activity_date timestamptz DEFAULT now(),
  duration_minutes integer,
  outcome text,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_lead_status ON contacts(lead_status);

CREATE INDEX IF NOT EXISTS idx_deals_company_id ON deals(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);

CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_company_id ON activities(company_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal_id ON activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);

CREATE INDEX IF NOT EXISTS idx_tasks_contact_id ON tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();