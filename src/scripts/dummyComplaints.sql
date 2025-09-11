-- SQL Script to add dummy complaints
-- This script assumes you have existing ministries and users in the database

-- First, let's create some dummy citizen users if they don't exist
INSERT INTO "User" (id, username, password, "phoneNumber", email, name, description, location, role, "isActive", "isPremium", "createdAt", "updatedAt")
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'rajesh_kumar', '$2b$10$rQZ8Kj9XvY2mN3pL5qR7He8vB1cD4fG6hI9jK2lM5nO8pQ1rS4tU7wX0yZ3', '+91-9876543212', 'rajesh.kumar@email.com', 'Rajesh Kumar', 'Concerned citizen from Ranchi', 'Ranchi, Jharkhand', 'CITIZEN', true, false, NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'priya_sharma', '$2b$10$rQZ8Kj9XvY2mN3pL5qR7He8vB1cD4fG6hI9jK2lM5nO8pQ1rS4tU7wX0yZ3', '+91-9876543213', 'priya.sharma@email.com', 'Priya Sharma', 'Active community member', 'Jamshedpur, Jharkhand', 'CITIZEN', true, false, NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'amit_singh', '$2b$10$rQZ8Kj9XvY2mN3pL5qR7He8vB1cD4fG6hI9jK2lM5nO8pQ1rS4tU7wX0yZ3', '+91-9876543214', 'amit.singh@email.com', 'Amit Singh', 'Local business owner', 'Dhanbad, Jharkhand', 'CITIZEN', true, false, NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440004', 'sunita_devi', '$2b$10$rQZ8Kj9XvY2mN3pL5qR7He8vB1cD4fG6hI9jK2lM5nO8pQ1rS4tU7wX0yZ3', '+91-9876543215', 'sunita.devi@email.com', 'Sunita Devi', 'School teacher and parent', 'Bokaro, Jharkhand', 'CITIZEN', true, false, NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440005', 'vijay_gupta', '$2b$10$rQZ8Kj9XvY2mN3pL5qR7He8vB1cD4fG6hI9jK2lM5nO8pQ1rS4tU7wX0yZ3', '+91-9876543216', 'vijay.gupta@email.com', 'Vijay Gupta', 'Retired government employee', 'Deoghar, Jharkhand', 'CITIZEN', true, false, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Now let's add dummy complaints
-- Note: Replace the ministry IDs with actual IDs from your database
-- You can get these by running: SELECT id, name FROM "Ministry";

INSERT INTO "Complaint" (id, title, description, location, latitude, longitude, priority, status, "complaintNumber", "userId", "ministryId", "createdAt", "updatedAt")
VALUES 
    -- Public Works Department complaints
    ('650e8400-e29b-41d4-a716-446655440001', 'Broken Street Light on Main Road', 'The street light near the main intersection has been broken for over a week. This creates safety issues for pedestrians and vehicles during night time. The area becomes very dark and poses a risk to public safety.', 'Main Road, Near Gandhi Chowk, Ranchi', 23.3441, 85.3096, 'MEDIUM', 'SUBMITTED', 'JH-20241201-ABC123', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM "Ministry" WHERE name = 'Public Works Department' LIMIT 1), NOW(), NOW()),
    
    ('650e8400-e29b-41d4-a716-446655440002', 'Potholes on National Highway', 'There are multiple large potholes on the National Highway 33 near the city entrance. These potholes are causing damage to vehicles and creating traffic congestion. Immediate repair is required.', 'NH-33, Near City Entrance, Dhanbad', 23.7957, 86.4304, 'URGENT', 'IN_PROGRESS', 'JH-20241201-DEF456', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM "Ministry" WHERE name = 'Public Works Department' LIMIT 1), NOW(), NOW()),
    
    -- Water Supply Department complaints
    ('650e8400-e29b-41d4-a716-446655440003', 'Water Supply Interruption', 'Our area has been experiencing irregular water supply for the past 10 days. Water comes only for 2-3 hours in the morning and then stops completely. This is causing severe inconvenience to all residents.', 'Sector 5, Jamshedpur', 22.8046, 86.2029, 'HIGH', 'UNDER_REVIEW', 'JH-20241201-GHI789', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM "Ministry" WHERE name = 'Water Supply Department' LIMIT 1), NOW(), NOW()),
    
    -- Municipal Corporation complaints
    ('650e8400-e29b-41d4-a716-446655440004', 'Garbage Collection Not Regular', 'Garbage collection in our locality has become very irregular. Garbage is piling up on the streets and creating unhygienic conditions. The foul smell is affecting residents health.', 'Ward 12, Bokaro Steel City', 23.6693, 86.1511, 'HIGH', 'SUBMITTED', 'JH-20241201-JKL012', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM "Ministry" WHERE name = 'Municipal Corporation' LIMIT 1), NOW(), NOW()),
    
    ('650e8400-e29b-41d4-a716-446655440005', 'Drainage System Blocked', 'The drainage system in our locality is completely blocked due to garbage and debris. During rains, water accumulates on the streets and enters houses. This is a recurring problem every monsoon.', 'Ward 8, Bokaro', 23.6693, 86.1511, 'MEDIUM', 'SUBMITTED', 'JH-20241201-MNO345', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM "Ministry" WHERE name = 'Municipal Corporation' LIMIT 1), NOW(), NOW()),
    
    ('650e8400-e29b-41d4-a716-446655440006', 'Public Park Maintenance Required', 'The public park in our area is in a very poor condition. The playground equipment is broken, there is no proper lighting, and the walking track is damaged. Children cannot play safely here.', 'City Park, Deoghar', 24.4889, 86.6991, 'LOW', 'SUBMITTED', 'JH-20241201-PQR678', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM "Ministry" WHERE name = 'Municipal Corporation' LIMIT 1), NOW(), NOW()),
    
    -- Education Department complaints
    ('650e8400-e29b-41d4-a716-446655440007', 'School Building Needs Repair', 'The government school building in our area has several structural issues. The roof leaks during monsoon, and some walls have cracks. This poses a safety risk to students and teachers.', 'Government Primary School, Deoghar', 24.4889, 86.6991, 'HIGH', 'UNDER_REVIEW', 'JH-20241201-STU901', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM "Ministry" WHERE name = 'Education Department' LIMIT 1), NOW(), NOW()),
    
    -- Transport Department complaints
    ('650e8400-e29b-41d4-a716-446655440008', 'Public Transport Bus Not Running', 'The public transport bus service on route 15 has been suspended for the past two weeks without any notice. This route serves several important areas and many commuters are facing difficulties.', 'Bus Route 15, Ranchi to Hatia', 23.3441, 85.3096, 'MEDIUM', 'SUBMITTED', 'JH-20241201-VWX234', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM "Ministry" WHERE name = 'Transport Department' LIMIT 1), NOW(), NOW()),
    
    ('650e8400-e29b-41d4-a716-446655440009', 'Traffic Signal Not Working', 'The traffic signal at the busy intersection near the railway station has been malfunctioning for over a week. This is causing traffic chaos and increasing the risk of accidents.', 'Railway Station Intersection, Dhanbad', 23.7957, 86.4304, 'HIGH', 'IN_PROGRESS', 'JH-20241201-YZA567', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM "Ministry" WHERE name = 'Transport Department' LIMIT 1), NOW(), NOW()),
    
    -- Health Department complaints
    ('650e8400-e29b-41d4-a716-446655440010', 'Hospital Medicine Shortage', 'The government hospital in our area is facing acute shortage of essential medicines. Patients are being asked to buy medicines from outside at high prices. This is affecting the poor and needy patients.', 'District Hospital, Bokaro', 23.6693, 86.1511, 'URGENT', 'UNDER_REVIEW', 'JH-20241201-BCD890', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM "Ministry" WHERE name = 'Health Department' LIMIT 1), NOW(), NOW()),
    
    -- Environment Department complaints
    ('650e8400-e29b-41d4-a716-446655440011', 'Air Pollution from Industrial Area', 'The industrial area near our residential colony is releasing excessive smoke and pollutants. This is causing respiratory problems among residents, especially children and elderly people.', 'Industrial Area, Jamshedpur', 22.8046, 86.2029, 'URGENT', 'IN_PROGRESS', 'JH-20241201-EFG123', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM "Ministry" WHERE name = 'Environment Department' LIMIT 1), NOW(), NOW()),
    
    -- Police Department complaints
    ('650e8400-e29b-41d4-a716-446655440012', 'Street Vendor Harassment', 'Local street vendors are being harassed by some individuals claiming to be from the municipal corporation. They are demanding money and threatening to confiscate goods. This needs immediate attention.', 'Market Area, Dhanbad', 23.7957, 86.4304, 'MEDIUM', 'SUBMITTED', 'JH-20241201-HIJ456', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM "Ministry" WHERE name = 'Police Department' LIMIT 1), NOW(), NOW()),
    
    -- Fire Department complaints
    ('650e8400-e29b-41d4-a716-446655440013', 'Fire Safety Equipment Missing', 'The local market complex lacks proper fire safety equipment. There are no fire extinguishers or emergency exits clearly marked. This poses a serious safety risk to shopkeepers and customers.', 'Central Market Complex, Deoghar', 24.4889, 86.6991, 'HIGH', 'SUBMITTED', 'JH-20241201-KLM789', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM "Ministry" WHERE name = 'Fire Department' LIMIT 1), NOW(), NOW()),
    
    -- Housing Department complaints
    ('650e8400-e29b-41d4-a716-446655440014', 'Slum Area Housing Issues', 'The slum area near the railway station has very poor living conditions. Houses are made of temporary materials and there is no proper drainage system. Heavy rains cause flooding in the area.', 'Railway Station Area, Ranchi', 23.3441, 85.3096, 'HIGH', 'SUBMITTED', 'JH-20241201-NOP012', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM "Ministry" WHERE name = 'Housing Department' LIMIT 1), NOW(), NOW()),
    
    -- Social Welfare Department complaints
    ('650e8400-e29b-41d4-a716-446655440015', 'Old Age Pension Not Received', 'My mothers old age pension has not been credited for the last three months. Despite multiple visits to the social welfare office, the issue remains unresolved. This is causing financial hardship.', 'Social Welfare Office, Jamshedpur', 22.8046, 86.2029, 'MEDIUM', 'UNDER_REVIEW', 'JH-20241201-QRS345', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM "Ministry" WHERE name = 'Social Welfare Department' LIMIT 1), NOW(), NOW());

-- Add initial status updates for all complaints
INSERT INTO "ComplaintUpdate" (id, "complaintId", status, message, "updatedById", "createdAt")
SELECT 
    gen_random_uuid(),
    c.id,
    c.status,
    CASE 
        WHEN c.status = 'SUBMITTED' THEN 'Complaint has been submitted and is under review.'
        WHEN c.status = 'UNDER_REVIEW' THEN 'Complaint is being reviewed by the concerned department.'
        WHEN c.status = 'IN_PROGRESS' THEN 'Work on this complaint has been started by the department.'
        WHEN c.status = 'RESOLVED' THEN 'Complaint has been successfully resolved.'
        WHEN c.status = 'REJECTED' THEN 'Complaint has been rejected due to insufficient information.'
        WHEN c.status = 'CLOSED' THEN 'Complaint has been closed after resolution.'
    END,
    c."userId",
    NOW()
FROM "Complaint" c
WHERE c.id IN (
    '650e8400-e29b-41d4-a716-446655440001',
    '650e8400-e29b-41d4-a716-446655440002',
    '650e8400-e29b-41d4-a716-446655440003',
    '650e8400-e29b-41d4-a716-446655440004',
    '650e8400-e29b-41d4-a716-446655440005',
    '650e8400-e29b-41d4-a716-446655440006',
    '650e8400-e29b-41d4-a716-446655440007',
    '650e8400-e29b-41d4-a716-446655440008',
    '650e8400-e29b-41d4-a716-446655440009',
    '650e8400-e29b-41d4-a716-446655440010',
    '650e8400-e29b-41d4-a716-446655440011',
    '650e8400-e29b-41d4-a716-446655440012',
    '650e8400-e29b-41d4-a716-446655440013',
    '650e8400-e29b-41d4-a716-446655440014',
    '650e8400-e29b-41d4-a716-446655440015'
);

-- Add some sample comments to complaints
INSERT INTO "ComplaintComment" (id, "complaintId", content, "authorId", "isInternal", "createdAt")
VALUES 
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440001', 'Thank you for bringing this to our attention. We are looking into this matter.', '550e8400-e29b-41d4-a716-446655440001', false, NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440002', 'Our team has been assigned to investigate this issue. We will provide updates soon.', '550e8400-e29b-41d4-a716-446655440003', false, NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440003', 'We understand your concern and are working to resolve this at the earliest.', '550e8400-e29b-41d4-a716-446655440002', false, NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440004', 'This issue has been escalated to the concerned department for immediate action.', '550e8400-e29b-41d4-a716-446655440004', false, NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440005', 'We have received your complaint and are in the process of gathering more information.', '550e8400-e29b-41d4-a716-446655440004', false, NOW());

-- Add some sample attachments to complaints
INSERT INTO "ComplaintAttachment" (id, "complaintId", "fileName", "fileUrl", "fileType", "fileSize", "mimeType", "createdAt")
VALUES 
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440001', 'street_light_damage.jpg', '/uploads/complaints/street_light_damage.jpg', 'image', 2048576, 'image/jpeg', NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440002', 'pothole_location.jpg', '/uploads/complaints/pothole_location.jpg', 'image', 1536000, 'image/jpeg', NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440004', 'garbage_pile.jpg', '/uploads/complaints/garbage_pile.jpg', 'image', 1873408, 'image/jpeg', NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440007', 'school_damage.pdf', '/uploads/complaints/school_damage.pdf', 'document', 512000, 'application/pdf', NOW());

-- Display summary
SELECT 
    'Summary' as info,
    (SELECT COUNT(*) FROM "Complaint") as total_complaints,
    (SELECT COUNT(*) FROM "User" WHERE role = 'CITIZEN') as total_citizens,
    (SELECT COUNT(*) FROM "Ministry") as total_ministries;
