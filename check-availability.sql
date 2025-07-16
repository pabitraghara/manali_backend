-- Check package schedules and their availability
SELECT 
    ps.id AS schedule_id,
    ps."packageId",
    ps."startDate",
    ps."endDate",
    ps."availableSlots",
    ps."bookedSlots",
    (ps."availableSlots" - ps."bookedSlots") AS remaining_slots,
    ps.status,
    ps."isActive",
    p.name AS package_name
FROM package_schedules ps
JOIN packages p ON ps."packageId" = p.id
WHERE ps."isActive" = true
ORDER BY ps."startDate";

-- Check existing bookings
SELECT 
    pb.id,
    pb."packageId",
    pb."startDate",
    pb."endDate",
    pb."numberOfPeople",
    pb."createdAt",
    p.name AS package_name
FROM package_bookings pb
JOIN packages p ON pb."packageId" = p.id
ORDER BY pb."createdAt" DESC;

-- Check if any schedules have more booked slots than available
SELECT 
    ps.id AS schedule_id,
    ps."packageId",
    ps."availableSlots",
    ps."bookedSlots",
    p.name AS package_name,
    'OVERBOOKED' AS status
FROM package_schedules ps
JOIN packages p ON ps."packageId" = p.id
WHERE ps."bookedSlots" > ps."availableSlots"
   OR (ps."availableSlots" - ps."bookedSlots") < 0;