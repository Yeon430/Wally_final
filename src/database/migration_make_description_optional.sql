-- Migration: Make description column optional (allow NULL)
-- Run this in Supabase SQL Editor

ALTER TABLE transactions 
ALTER COLUMN description DROP NOT NULL;

