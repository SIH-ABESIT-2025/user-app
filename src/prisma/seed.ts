import { prisma } from './client';
import bcrypt from 'bcrypt';

const ministries = [
    {
        name: "Public Works Department",
        description: "Responsible for road construction, maintenance, and infrastructure development",
        icon: "🏗️",
        color: "#ff6b35"
    },
    {
        name: "Municipal Corporation",
        description: "Handles civic amenities, sanitation, and local governance issues",
        icon: "🏛️",
        color: "#2e7d32"
    },
    {
        name: "Electricity Department",
        description: "Manages power supply, street lighting, and electrical infrastructure",
        icon: "⚡",
        color: "#ffc107"
    },
    {
        name: "Water Supply Department",
        description: "Responsible for water distribution, quality, and supply issues",
        icon: "💧",
        color: "#1976d2"
    },
    {
        name: "Health Department",
        description: "Manages public health services, hospitals, and medical facilities",
        icon: "🏥",
        color: "#dc3545"
    },
    {
        name: "Education Department",
        description: "Oversees schools, colleges, and educational infrastructure",
        icon: "🎓",
        color: "#6f42c1"
    },
    {
        name: "Transport Department",
        description: "Manages public transportation, traffic, and road safety",
        icon: "🚌",
        color: "#fd7e14"
    },
    {
        name: "Environment Department",
        description: "Handles environmental protection, pollution control, and green initiatives",
        icon: "🌱",
        color: "#28a745"
    },
    {
        name: "Police Department",
        description: "Maintains law and order, traffic management, and public safety",
        icon: "👮",
        color: "#343a40"
    },
    {
        name: "Fire Department",
        description: "Emergency services, fire safety, and disaster management",
        icon: "🚒",
        color: "#dc3545"
    },
    {
        name: "Housing Department",
        description: "Manages housing schemes, slum development, and urban planning",
        icon: "🏠",
        color: "#17a2b8"
    },
    {
        name: "Social Welfare Department",
        description: "Handles social security, welfare schemes, and community development",
        icon: "🤝",
        color: "#e83e8c"
    }
];

async function main() {
    console.log('Starting to seed data...');
    
    // Seed ministries
    console.log('Seeding ministries...');
    for (const ministry of ministries) {
        await prisma.ministry.upsert({
            where: { name: ministry.name },
            update: ministry,
            create: ministry,
        });
        console.log(`Seeded ministry: ${ministry.name}`);
    }
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            role: 'SUPER_ADMIN',
            isActive: true
        },
        create: {
            username: 'admin',
            password: hashedPassword,
            email: 'admin@jharkhand.gov.in',
            phoneNumber: '+91-9876543210',
            name: 'System Administrator',
            description: 'Super Administrator of Jharkhand Civic Platform',
            role: 'SUPER_ADMIN',
            isActive: true,
            isPremium: true
        }
    });
    console.log('Admin user created: admin / admin123');
    
    // Create ministry staff user
    console.log('Creating ministry staff user...');
    const staffPassword = await bcrypt.hash('staff123', 10);
    
    await prisma.user.upsert({
        where: { username: 'ministry_staff' },
        update: {
            role: 'MINISTRY_STAFF',
            isActive: true
        },
        create: {
            username: 'ministry_staff',
            password: staffPassword,
            email: 'staff@jharkhand.gov.in',
            phoneNumber: '+91-9876543211',
            name: 'Ministry Staff',
            description: 'Ministry Staff Member',
            role: 'MINISTRY_STAFF',
            isActive: true,
            isPremium: false
        }
    });
    console.log('Ministry staff user created: ministry_staff / staff123');
    
    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
