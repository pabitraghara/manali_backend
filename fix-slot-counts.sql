-- Fix slot counts by calculating booked slots from existing bookings
-- This script will update the bookedSlots column based on actual bookings

-- Update bookedSlots for each schedule based on actual bookings
UPDATE package_schedules
SET "bookedSlots" = (
    SELECT COALESCE(SUM(pb."numberOfPeople"), 0)
    FROM package_bookings pb
    WHERE pb."packageId" = package_schedules."packageId"
    AND pb."startDate" >= package_schedules."startDate"
    AND pb."endDate" <= package_schedules."endDate"
)
WHERE "isActive" = true;

-- Show the results after update
SELECT 
    ps.id AS schedule_id,
    ps."packageId",
    ps."startDate",
    ps."endDate",
    ps."availableSlots",
    ps."bookedSlots",
    (ps."availableSlots" - ps."bookedSlots") AS remaining_slots,
    CASE 
        WHEN (ps."availableSlots" - ps."bookedSlots") <= 0 THEN 'FULLY_BOOKED'
        WHEN (ps."availableSlots" - ps."bookedSlots") < 3 THEN 'NEARLY_FULL'
        ELSE 'AVAILABLE'
    END AS availability_status,
    p.name AS package_name
FROM package_schedules ps
JOIN packages p ON ps."packageId" = p.id
WHERE ps."isActive" = true
ORDER BY ps."startDate";