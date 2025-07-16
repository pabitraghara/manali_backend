-- Fix package_schedules table createdById column
-- This script addresses the TypeORM synchronization error

-- First, ensure the ADMIN user exists
INSERT INTO users (id, email, name, password, role, provider, "isActive", "createdAt", "updatedAt") 
VALUES ('ADMIN', 'admin@manali.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'local', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Update any null values in package_schedules to the ADMIN user
UPDATE package_schedules 
SET "createdById" = 'ADMIN' 
WHERE "createdById" IS NULL;

-- Update any null values in hotel_schedules to the ADMIN user (if the table exists)
UPDATE hotel_schedules 
SET "createdById" = 'ADMIN' 
WHERE "createdById" IS NULL;

-- Now TypeORM should be able to synchronize properly