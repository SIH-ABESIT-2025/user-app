const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Dummy citizen users data
const dummyUsers = [
    {
        username: 'rajesh_kumar',
        email: 'rajesh.kumar@email.com',
        phoneNumber: '+91-9876543212',
        name: 'Rajesh Kumar',
        description: 'Concerned citizen from Ranchi',
        location: 'Ranchi, Jharkhand',
        password: 'password123'
    },
    {
        username: 'priya_sharma',
        email: 'priya.sharma@email.com',
        phoneNumber: '+91-9876543213',
        name: 'Priya Sharma',
        description: 'Active community member',
        location: 'Jamshedpur, Jharkhand',
        password: 'password123'
    },
    {
        username: 'amit_singh',
        email: 'amit.singh@email.com',
        phoneNumber: '+91-9876543214',
        name: 'Amit Singh',
        description: 'Local business owner',
        location: 'Dhanbad, Jharkhand',
        password: 'password123'
    },
    {
        username: 'sunita_devi',
        email: 'sunita.devi@email.com',
        phoneNumber: '+91-9876543215',
        name: 'Sunita Devi',
        description: 'School teacher and parent',
        location: 'Bokaro, Jharkhand',
        password: 'password123'
    },
    {
        username: 'vijay_gupta',
        email: 'vijay.gupta@email.com',
        phoneNumber: '+91-9876543216',
        name: 'Vijay Gupta',
        description: 'Retired government employee',
        location: 'Deoghar, Jharkhand',
        password: 'password123'
    }
];

// Dummy complaints data
const dummyComplaints = [
    {
        title: "Broken Street Light on Main Road",
        description: "The street light near the main intersection has been broken for over a week. This creates safety issues for pedestrians and vehicles during night time. The area becomes very dark and poses a risk to public safety.",
        location: "Main Road, Near Gandhi Chowk, Ranchi",
        latitude: 23.3441,
        longitude: 85.3096,
        priority: "MEDIUM" as const,
        status: "SUBMITTED" as const,
        ministryName: "Electricity Department"
    },
    {
        title: "Water Supply Interruption",
        description: "Our area has been experiencing irregular water supply for the past 10 days. Water comes only for 2-3 hours in the morning and then stops completely. This is causing severe inconvenience to all residents.",
        location: "Sector 5, Jamshedpur",
        latitude: 22.8046,
        longitude: 86.2029,
        priority: "HIGH" as const,
        status: "UNDER_REVIEW" as const,
        ministryName: "Water Supply Department"
    },
    {
        title: "Potholes on National Highway",
        description: "There are multiple large potholes on the National Highway 33 near the city entrance. These potholes are causing damage to vehicles and creating traffic congestion. Immediate repair is required.",
        location: "NH-33, Near City Entrance, Dhanbad",
        latitude: 23.7957,
        longitude: 86.4304,
        priority: "URGENT" as const,
        status: "IN_PROGRESS" as const,
        ministryName: "Public Works Department"
    },
    {
        title: "Garbage Collection Not Regular",
        description: "Garbage collection in our locality has become very irregular. Garbage is piling up on the streets and creating unhygienic conditions. The foul smell is affecting residents' health.",
        location: "Ward 12, Bokaro Steel City",
        latitude: 23.6693,
        longitude: 86.1511,
        priority: "HIGH" as const,
        status: "SUBMITTED" as const,
        ministryName: "Municipal Corporation"
    },
    {
        title: "School Building Needs Repair",
        description: "The government school building in our area has several structural issues. The roof leaks during monsoon, and some walls have cracks. This poses a safety risk to students and teachers.",
        location: "Government Primary School, Deoghar",
        latitude: 24.4889,
        longitude: 86.6991,
        priority: "HIGH" as const,
        status: "UNDER_REVIEW" as const,
        ministryName: "Education Department"
    },
    {
        title: "Public Transport Bus Not Running",
        description: "The public transport bus service on route 15 has been suspended for the past two weeks without any notice. This route serves several important areas and many commuters are facing difficulties.",
        location: "Bus Route 15, Ranchi to Hatia",
        latitude: 23.3441,
        longitude: 85.3096,
        priority: "MEDIUM" as const,
        status: "SUBMITTED" as const,
        ministryName: "Transport Department"
    },
    {
        title: "Air Pollution from Industrial Area",
        description: "The industrial area near our residential colony is releasing excessive smoke and pollutants. This is causing respiratory problems among residents, especially children and elderly people.",
        location: "Industrial Area, Jamshedpur",
        latitude: 22.8046,
        longitude: 86.2029,
        priority: "URGENT" as const,
        status: "IN_PROGRESS" as const,
        ministryName: "Environment Department"
    },
    {
        title: "Street Vendor Harassment",
        description: "Local street vendors are being harassed by some individuals claiming to be from the municipal corporation. They are demanding money and threatening to confiscate goods. This needs immediate attention.",
        location: "Market Area, Dhanbad",
        latitude: 23.7957,
        longitude: 86.4304,
        priority: "MEDIUM" as const,
        status: "SUBMITTED" as const,
        ministryName: "Police Department"
    },
    {
        title: "Hospital Medicine Shortage",
        description: "The government hospital in our area is facing acute shortage of essential medicines. Patients are being asked to buy medicines from outside at high prices. This is affecting the poor and needy patients.",
        location: "District Hospital, Bokaro",
        latitude: 23.6693,
        longitude: 86.1511,
        priority: "URGENT" as const,
        status: "UNDER_REVIEW" as const,
        ministryName: "Health Department"
    },
    {
        title: "Fire Safety Equipment Missing",
        description: "The local market complex lacks proper fire safety equipment. There are no fire extinguishers or emergency exits clearly marked. This poses a serious safety risk to shopkeepers and customers.",
        location: "Central Market Complex, Deoghar",
        latitude: 24.4889,
        longitude: 86.6991,
        priority: "HIGH" as const,
        status: "SUBMITTED" as const,
        ministryName: "Fire Department"
    },
    {
        title: "Slum Area Housing Issues",
        description: "The slum area near the railway station has very poor living conditions. Houses are made of temporary materials and there's no proper drainage system. Heavy rains cause flooding in the area.",
        location: "Railway Station Area, Ranchi",
        latitude: 23.3441,
        longitude: 85.3096,
        priority: "HIGH" as const,
        status: "SUBMITTED" as const,
        ministryName: "Housing Department"
    },
    {
        title: "Old Age Pension Not Received",
        description: "My mother's old age pension has not been credited for the last three months. Despite multiple visits to the social welfare office, the issue remains unresolved. This is causing financial hardship.",
        location: "Social Welfare Office, Jamshedpur",
        latitude: 22.8046,
        longitude: 86.2029,
        priority: "MEDIUM" as const,
        status: "UNDER_REVIEW" as const,
        ministryName: "Social Welfare Department"
    },
    {
        title: "Traffic Signal Not Working",
        description: "The traffic signal at the busy intersection near the railway station has been malfunctioning for over a week. This is causing traffic chaos and increasing the risk of accidents.",
        location: "Railway Station Intersection, Dhanbad",
        latitude: 23.7957,
        longitude: 86.4304,
        priority: "HIGH" as const,
        status: "IN_PROGRESS" as const,
        ministryName: "Transport Department"
    },
    {
        title: "Drainage System Blocked",
        description: "The drainage system in our locality is completely blocked due to garbage and debris. During rains, water accumulates on the streets and enters houses. This is a recurring problem every monsoon.",
        location: "Ward 8, Bokaro",
        latitude: 23.6693,
        longitude: 86.1511,
        priority: "MEDIUM" as const,
        status: "SUBMITTED" as const,
        ministryName: "Municipal Corporation"
    },
    {
        title: "Public Park Maintenance Required",
        description: "The public park in our area is in a very poor condition. The playground equipment is broken, there's no proper lighting, and the walking track is damaged. Children cannot play safely here.",
        location: "City Park, Deoghar",
        latitude: 24.4889,
        longitude: 86.6991,
        priority: "LOW" as const,
        status: "SUBMITTED" as const,
        ministryName: "Municipal Corporation"
    }
];

// Sample attachments for some complaints
const sampleAttachments = [
    {
        fileName: "street_light_damage.jpg",
        fileUrl: "/uploads/complaints/street_light_damage.jpg",
        fileType: "image",
        fileSize: 2048576,
        mimeType: "image/jpeg"
    },
    {
        fileName: "pothole_location.jpg",
        fileUrl: "/uploads/complaints/pothole_location.jpg",
        fileType: "image",
        fileSize: 1536000,
        mimeType: "image/jpeg"
    },
    {
        fileName: "garbage_pile.jpg",
        fileUrl: "/uploads/complaints/garbage_pile.jpg",
        fileType: "image",
        fileSize: 1873408,
        mimeType: "image/jpeg"
    },
    {
        fileName: "school_damage.pdf",
        fileUrl: "/uploads/complaints/school_damage.pdf",
        fileType: "document",
        fileSize: 512000,
        mimeType: "application/pdf"
    }
];

// Status update messages
const statusUpdateMessages = {
    SUBMITTED: "Complaint has been submitted and is under review.",
    UNDER_REVIEW: "Complaint is being reviewed by the concerned department.",
    IN_PROGRESS: "Work on this complaint has been started by the department.",
    RESOLVED: "Complaint has been successfully resolved.",
    REJECTED: "Complaint has been rejected due to insufficient information.",
    CLOSED: "Complaint has been closed after resolution."
};

// Comment templates
const commentTemplates = [
    "Thank you for bringing this to our attention. We are looking into this matter.",
    "Our team has been assigned to investigate this issue. We will provide updates soon.",
    "We understand your concern and are working to resolve this at the earliest.",
    "This issue has been escalated to the concerned department for immediate action.",
    "We have received your complaint and are in the process of gathering more information.",
    "Our field team will visit the location to assess the situation.",
    "We apologize for the inconvenience caused and assure you of our best efforts.",
    "This complaint has been prioritized based on its urgency and impact."
];

function generateComplaintNumber(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `JH-${dateStr}-${randomStr}`;
}

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function createDummyUsers() {
    console.log('Creating dummy users...');
    
    for (const userData of dummyUsers) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        await prisma.user.upsert({
            where: { username: userData.username },
            update: {
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                description: userData.description,
                location: userData.location,
                isActive: true
            },
            create: {
                username: userData.username,
                password: hashedPassword,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                name: userData.name,
                description: userData.description,
                location: userData.location,
                role: 'CITIZEN',
                isActive: true,
                isPremium: false
            }
        });
        
        console.log(`Created user: ${userData.username}`);
    }
}

async function createDummyComplaints() {
    console.log('Creating dummy complaints...');
    
    // Get all ministries
    const ministries = await prisma.ministry.findMany();
    const ministryMap = new Map(ministries.map((m: any) => [m.name, m.id]));
    
    // Get all users
    const users = await prisma.user.findMany({
        where: { role: 'CITIZEN' }
    });
    
    // Get ministry staff for assignment
    const ministryStaff = await prisma.user.findFirst({
        where: { role: 'MINISTRY_STAFF' }
    });
    
    for (const complaintData of dummyComplaints) {
        const ministryId = ministryMap.get(complaintData.ministryName);
        if (!ministryId) {
            console.log(`Ministry not found: ${complaintData.ministryName}`);
            continue;
        }
        
        const randomUser = getRandomElement(users) as any;
        const complaintNumber = generateComplaintNumber();
        
        // Randomly assign some complaints to ministry staff
        const assignedToId = Math.random() > 0.5 ? ministryStaff?.id : undefined;
        
        // Randomly add attachments to some complaints
        const shouldAddAttachments = Math.random() > 0.6;
        const attachments = shouldAddAttachments ? 
            getRandomElements(sampleAttachments, Math.floor(Math.random() * 3) + 1) : [];
        
        const complaint = await prisma.complaint.create({
            data: {
                title: complaintData.title,
                description: complaintData.description,
                location: complaintData.location,
                latitude: complaintData.latitude,
                longitude: complaintData.longitude,
                priority: complaintData.priority,
                status: complaintData.status,
                complaintNumber,
                userId: randomUser.id,
                ministryId,
                assignedToId,
                attachments: {
                    create: attachments.map(attachment => ({
                        fileName: attachment.fileName,
                        fileUrl: attachment.fileUrl,
                        fileType: attachment.fileType,
                        fileSize: attachment.fileSize,
                        mimeType: attachment.mimeType
                    }))
                }
            }
        });
        
        // Create initial status update
        await prisma.complaintUpdate.create({
            data: {
                complaintId: complaint.id,
                status: 'SUBMITTED',
                message: statusUpdateMessages.SUBMITTED,
                updatedById: randomUser.id
            }
        });
        
        // Add additional status updates for some complaints
        if (complaintData.status !== 'SUBMITTED') {
            await prisma.complaintUpdate.create({
                data: {
                    complaintId: complaint.id,
                    status: complaintData.status,
                    message: statusUpdateMessages[complaintData.status],
                    updatedById: ministryStaff?.id || randomUser.id
                }
            });
        }
        
        // Add random comments to some complaints
        if (Math.random() > 0.4) {
            const commentCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < commentCount; i++) {
                await prisma.complaintComment.create({
                    data: {
                        complaintId: complaint.id,
                        content: getRandomElement(commentTemplates),
                        authorId: Math.random() > 0.5 ? ministryStaff?.id || randomUser.id : randomUser.id,
                        isInternal: Math.random() > 0.7
                    }
                });
            }
        }
        
        console.log(`Created complaint: ${complaint.title} (${complaint.complaintNumber})`);
    }
}

async function main() {
    try {
        console.log('Starting to seed dummy complaints...');
        
        // Create dummy users first
        await createDummyUsers();
        
        // Create dummy complaints
        await createDummyComplaints();
        
        console.log('Dummy complaints seeding completed successfully!');
        
        // Display summary
        const complaintCount = await prisma.complaint.count();
        const userCount = await prisma.user.count({
            where: { role: 'CITIZEN' }
        });
        const ministryCount = await prisma.ministry.count();
        
        console.log('\n=== Summary ===');
        console.log(`Total complaints: ${complaintCount}`);
        console.log(`Total citizen users: ${userCount}`);
        console.log(`Total ministries: ${ministryCount}`);
        
    } catch (error) {
        console.error('Error seeding dummy complaints:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
if (require.main === module) {
    main()
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

module.exports = main;
