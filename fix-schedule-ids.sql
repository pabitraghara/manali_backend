-- Fix package_schedules table
ALTER TABLE package_schedules 
DROP COLUMN IF EXISTS id CASCADE,
ADD COLUMN id SERIAL PRIMARY KEY;

-- Fix hotel_schedules table  
ALTER TABLE hotel_schedules 
DROP COLUMN IF EXISTS id CASCADE,
ADD COLUMN id SERIAL PRIMARY KEY;

-- Update any existing foreign key references if needed
-- (Usually not needed if we're just changing from UUID to integer for primary keys)