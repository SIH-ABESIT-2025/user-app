# Dummy Data Scripts

This directory contains scripts to populate the database with dummy data for testing and development purposes.

## Available Scripts

### 1. TypeScript Dummy Complaints Seeder (`seedDummyComplaints.ts`)

A comprehensive TypeScript script that creates realistic dummy complaints with:
- 5 dummy citizen users
- 15 diverse complaints across different ministries
- Realistic complaint data with proper locations, priorities, and statuses
- Sample attachments for some complaints
- Status updates and comments
- Proper relationships between users, ministries, and complaints

#### Usage

```bash
# Run the TypeScript seeder
npm run db:seed-complaints

# Or run directly
cd src && npx ts-node scripts/seedDummyComplaints.ts
```

### 2. SQL Dummy Complaints Script (`dummyComplaints.sql`)

A raw SQL script that inserts dummy complaints directly into the database. This is useful if you prefer to run SQL directly or if the TypeScript script has issues.

#### Usage

```bash
# Connect to your PostgreSQL database and run the SQL file
psql -d your_database_name -f src/scripts/dummyComplaints.sql

# Or using Prisma
npx prisma db execute --file src/scripts/dummyComplaints.sql --schema=./src/prisma/schema.prisma
```

## Prerequisites

Before running these scripts, ensure:

1. **Database is set up**: Run migrations to create the database schema
   ```bash
   npm run db:migrate
   ```

2. **Ministries exist**: Run the main seed script to create ministries
   ```bash
   npm run db:seed
   ```

3. **Environment variables**: Ensure your `.env` file has the correct `DATABASE_URL`

## What Gets Created

### Users
- 5 citizen users with realistic Indian names and locations
- All users have the password: `password123` (hashed with bcrypt)

### Complaints
- 15 complaints across different categories:
  - **Public Works**: Street lights, potholes, road repairs
  - **Water Supply**: Water interruptions, quality issues
  - **Municipal Corporation**: Garbage collection, drainage, parks
  - **Education**: School building repairs, infrastructure
  - **Transport**: Bus services, traffic signals
  - **Health**: Medicine shortages, hospital issues
  - **Environment**: Air pollution, environmental concerns
  - **Police**: Harassment, safety issues
  - **Fire Department**: Safety equipment, emergency preparedness
  - **Housing**: Slum development, housing conditions
  - **Social Welfare**: Pension issues, welfare schemes

### Additional Data
- **Attachments**: Sample file attachments for some complaints
- **Status Updates**: Initial status updates for all complaints
- **Comments**: Random comments on some complaints
- **Geographic Data**: Real latitude/longitude coordinates for Jharkhand locations

## Complaint Statuses

The scripts create complaints with various statuses:
- `SUBMITTED` - New complaints awaiting review
- `UNDER_REVIEW` - Complaints being reviewed by departments
- `IN_PROGRESS` - Work has started on the complaint
- `RESOLVED` - Complaints that have been resolved
- `REJECTED` - Complaints that were rejected
- `CLOSED` - Complaints that were closed after resolution

## Priority Levels

Complaints are assigned different priority levels:
- `LOW` - Minor issues that can be addressed in due course
- `MEDIUM` - Standard issues requiring attention
- `HIGH` - Important issues requiring prompt action
- `URGENT` - Critical issues requiring immediate attention

## Locations

All complaints are geographically distributed across Jharkhand:
- Ranchi (capital city)
- Jamshedpur (industrial city)
- Dhanbad (coal mining area)
- Bokaro (steel city)
- Deoghar (religious city)

## Security Notes

- All passwords are properly hashed using bcrypt
- User data follows realistic patterns but uses fictional information
- Complaint numbers follow the format: `JH-YYYYMMDD-XXXXXX`
- All data is suitable for development and testing environments

## Troubleshooting

If you encounter issues:

1. **TypeScript errors**: Ensure all dependencies are installed
   ```bash
   npm install
   ```

2. **Database connection**: Verify your `DATABASE_URL` in `.env`

3. **Prisma client**: Regenerate the Prisma client
   ```bash
   npx prisma generate --schema=./src/prisma/schema.prisma
   ```

4. **Ministry references**: Ensure ministries exist before running complaint scripts
   ```bash
   npm run db:seed
   ```

## Customization

You can modify the scripts to:
- Add more complaint categories
- Change user data patterns
- Adjust geographic locations
- Modify priority distributions
- Add more realistic attachment data

## Clean Up

To remove all dummy data:

```sql
-- WARNING: This will delete ALL data
DELETE FROM "ComplaintComment";
DELETE FROM "ComplaintUpdate";
DELETE FROM "ComplaintAttachment";
DELETE FROM "Complaint";
DELETE FROM "User" WHERE role = 'CITIZEN';
```
