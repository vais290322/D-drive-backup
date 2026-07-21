/*
# Add EMI Day of Month to Loans Table

## Purpose
Add a fixed EMI day of month field to the loans table to support consistent monthly EMI scheduling.

## Changes
1. Add `emi_day_of_month` column to loans table
   - Type: INTEGER
   - Constraint: Value between 1 and 31
   - Default: Extract day from first_emi_date
   - Not null

## Migration Details
- Backfills existing loans with day extracted from first_emi_date
- Adds check constraint to ensure valid day (1-31)
- Updates are safe for existing data

## Usage
The emi_day_of_month field ensures all EMIs for a loan are due on the same day each month.
For months with fewer days (e.g., February), the system will use the last day of that month.
*/

-- Add emi_day_of_month column to loans table
ALTER TABLE loans 
ADD COLUMN emi_day_of_month INTEGER;

-- Backfill existing loans with day from first_emi_date
UPDATE loans 
SET emi_day_of_month = EXTRACT(DAY FROM first_emi_date::date)
WHERE emi_day_of_month IS NULL;

-- Make column NOT NULL after backfill
ALTER TABLE loans 
ALTER COLUMN emi_day_of_month SET NOT NULL;

-- Add check constraint to ensure valid day (1-31)
ALTER TABLE loans 
ADD CONSTRAINT loans_emi_day_of_month_check 
CHECK (emi_day_of_month >= 1 AND emi_day_of_month <= 31);

-- Add comment for documentation
COMMENT ON COLUMN loans.emi_day_of_month IS 'Fixed day of month for EMI payments (1-31). For months with fewer days, the last day of that month will be used.';
