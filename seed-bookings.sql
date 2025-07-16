-- Insert sample package bookings with user profiles
INSERT INTO package_bookings (
    "packageId", 
    "startDate", 
    "endDate", 
    name, 
    "numberOfPeople", 
    mobile, 
    email, 
    "userId", 
    "createdAt", 
    "updatedAt"
) VALUES 
-- Booking by registered user
('10001', '2025-01-15', '2025-01-17', 'John Doe', 2, '+919876543210', 'john@example.com', '61535', NOW(), NOW()),

-- Booking by admin user
('10002', '2025-02-10', '2025-02-12', 'Admin User', 4, '+919876543211', 'admin@manali.com', '00001', NOW(), NOW()),

-- Booking by guest (no userId)
('10003', '2025-03-05', '2025-03-07', 'Guest User', 3, '+919876543212', 'guest@example.com', NULL, NOW(), NOW()),

-- More bookings
('10004', '2025-01-20', '2025-01-22', 'Jane Smith', 2, '+919876543213', 'jane@example.com', NULL, NOW(), NOW()),
('10011', '2025-02-15', '2025-02-17', 'Bob Johnson', 5, '+919876543214', 'bob@example.com', '61535', NOW(), NOW());