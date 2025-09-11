# Vercel Deployment Guide

## Environment Variables Required

Set these environment variables in your Vercel dashboard:

### Required Variables

1. **DATABASE_URL**
   - Format: `postgresql://username:password@hostname:port/database`
   - Example: `postgresql://user:pass@db.vercel-storage.com:5432/verceldb`

2. **JWT_SECRET**
   - Generate a secure random string
   - Example: `your-super-secret-jwt-key-here-32-chars-min`

### Optional Variables

3. **NODE_ENV**
   - Value: `production`

4. **NEXTAUTH_URL**
   - Value: `https://your-domain.vercel.app`

5. **NEXTAUTH_SECRET**
   - Generate a secure random string

## Database Setup

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Copy the connection string to DATABASE_URL

### Option 2: External Database
1. Use any PostgreSQL provider (Supabase, Neon, etc.)
2. Get the connection string
3. Set as DATABASE_URL

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment issues"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables
   - Deploy

3. **Run Database Migrations**
   ```bash
   # After deployment, run migrations
   npx prisma migrate deploy --schema=./src/prisma/schema.prisma
   ```

4. **Seed Database** (Optional)
   ```bash
   # Seed with initial data
   npm run db:seed
   npm run db:seed-complaints
   ```

## Build Issues Fixed

✅ **Dynamic Server Usage** - Added `export const dynamic = 'force-dynamic'` to all API routes
✅ **Static Generation** - Made admin pages dynamic to prevent build-time data fetching
✅ **Database Connection** - Added graceful handling for missing DATABASE_URL
✅ **Vercel Configuration** - Updated vercel.json with proper settings

## Troubleshooting

### Build Fails with Database Errors
- Ensure DATABASE_URL is set correctly
- Check database connection string format
- Verify database is accessible from Vercel

### Admin Pages Not Loading
- Check if JWT_SECRET is set
- Verify admin user exists in database
- Check browser console for errors

### API Routes Returning 500
- Check Vercel function logs
- Verify all environment variables are set
- Check database connection

## Default Admin Credentials

After seeding the database:
- **Super Admin**: `admin` / `admin123`
- **Ministry Staff**: `ministry_staff` / `staff123`

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connection
4. Check Next.js build logs
