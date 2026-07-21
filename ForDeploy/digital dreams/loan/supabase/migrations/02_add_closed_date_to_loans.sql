/*
# Add closed_date column to loans table

## Changes
- Add `closed_date` column to `loans` table to track when a loan was closed/completed
- This field is nullable and only set when the loan status is changed to 'completed'

## Purpose
- Track the exact date and time when a loan was closed
- Used for reporting and NOC generation
- Helps in calculating loan lifecycle duration
*/

-- Add closed_date column to loans table
ALTER TABLE loans ADD COLUMN IF NOT EXISTS closed_date timestamptz;

-- Add comment to the column
COMMENT ON COLUMN loans.closed_date IS 'Date and time when the loan was closed/completed';
