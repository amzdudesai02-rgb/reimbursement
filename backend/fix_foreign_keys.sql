-- Fix Foreign Key Constraints for Cascade/Set Null Behavior
-- Run this SQL script in your Neon database to fix the foreign key constraints
-- This will allow deleting users without foreign key constraint violations

-- 1. Fix security_events.user_id to SET NULL when user is deleted
ALTER TABLE security_events 
DROP CONSTRAINT IF EXISTS security_events_user_id_fkey;

ALTER TABLE security_events 
ADD CONSTRAINT security_events_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- 2. Fix stores.user_id to CASCADE when user is deleted
ALTER TABLE stores 
DROP CONSTRAINT IF EXISTS stores_user_id_fkey;

ALTER TABLE stores 
ADD CONSTRAINT stores_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. Fix amazon_connections.store_id to CASCADE when store is deleted
ALTER TABLE amazon_connections 
DROP CONSTRAINT IF EXISTS amazon_connections_store_id_fkey;

ALTER TABLE amazon_connections 
ADD CONSTRAINT amazon_connections_store_id_fkey 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

