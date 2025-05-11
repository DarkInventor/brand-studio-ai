-- Add credits field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;
