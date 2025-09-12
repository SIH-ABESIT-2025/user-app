# Deployment Guide for Jharkhand Civic Reporting Platform

## Prerequisites

1. **Database Setup**: Ensure you have a PostgreSQL database available (Vercel Postgres, Supabase, or any PostgreSQL provider)
2. **Environment Variables**: Set up all required environment variables in Vercel dashboard

## Required Environment Variables

Set these in your Vercel project settings:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database"

# JWT Secret (generate a secure random string, 32+ characters)
JWT_SECRET_KEY="your-super-secret-jwt-key-here-32-characters-minimum"

# Frontend URL (your Vercel domain)
NEXT_PUBLIC_HOST_URL="https://your-app.vercel.app"

# Storage URL (for file uploads)
NEXT_PUBLIC_STORAGE_URL="https://your-app.vercel.app/uploads"

# Node Environment
NODE_ENV="production"
```

## Deployment Steps

### 1. Vercel Dashboard Setup

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all the environment variables listed above
4. Make sure to set them for "Production", "Preview", and "Development" environments

### 2. Database Migration

After deployment, you'll need to run database migrations:

```bash
# Connect to your database and run the migrations
npx prisma migrate deploy --schema=./src/prisma/schema.prisma
```

Or if using Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy --schema=./src/prisma/schema.prisma
```

### 3. Seed Initial Data (Optional)

To populate the database with initial ministries and admin users:

```bash
npm run db:seed
```

## Troubleshooting

### Build Issues

If the build fails with Prisma errors:

1. **Check Environment Variables**: Ensure `DATABASE_URL` is correctly set
2. **Prisma Version**: Make sure Prisma is in dependencies (not devDependencies)
3. **Build Command**: The build uses `npm run vercel-build` which includes Prisma generation

### Common Issues

1. **"prisma: command not found"**: 
   - Ensure Prisma is in `dependencies` in package.json
   - Check that the build command includes `npx prisma generate`

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` format is correct
   - Check if database allows external connections
   - Ensure database is accessible from Vercel's IP ranges

3. **Environment Variables**:
   - Make sure all required variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)

## Build Configuration

The project uses the following build configuration:

- **Build Command**: `npm run vercel-build`
- **Install Command**: `npm install --legacy-peer-deps`
- **Framework**: Next.js
- **Node Version**: 18+

## File Structure

```
├── src/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── client.ts              # Prisma client
│   │   └── seed.ts                # Database seeding
│   ├── app/                       # Next.js app directory
│   ├── components/                # React components
│   └── utilities/                 # Utility functions
├── public/                        # Static assets
├── vercel.json                    # Vercel configuration
└── package.json                   # Dependencies and scripts
```

## Support

For deployment issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test database connectivity
4. Review Prisma schema and migrations
