-- Fix createdById columns to use varchar instead of UUID
ALTER TABLE package_schedules 
ALTER COLUMN "createdById" TYPE VARCHAR(10);

ALTER TABLE hotel_schedules 
ALTER COLUMN "createdById" TYPE VARCHAR(10);