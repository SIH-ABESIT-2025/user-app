# Vercel Deployment Fix Guide

## Common Issues When Local Works But Vercel Fails

### 1. Environment Variables (MOST COMMON ISSUE)

**Required Environment Variables in Vercel Dashboard:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET_KEY=your-super-secret-jwt-key-here-32-characters-minimum
NODE_ENV=production
NEXT_PUBLIC_HOST_URL=https://your-app.vercel.app
NEXT_PUBLIC_STORAGE_URL=https://your-app.vercel.app/uploads
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 2. Database Setup

**Option A: Vercel Postgres (Recommended)**
1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Copy the connection string to `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy --schema=./src/prisma/schema.prisma`

**Option B: External Database**
1. Use services like Supabase, PlanetScale, or Railway
2. Get connection string and add to `DATABASE_URL`

### 3. Build Settings

**In Vercel Dashboard → Settings → General:**
- Framework Preset: Next.js
- Build Command: `npm run vercel-build`
- Install Command: `npm install --legacy-peer-deps`
- Output Directory: `.next`
- Node.js Version: 18.x

### 4. File Upload Issues

The app uses file uploads. Make sure:
1. `NEXT_PUBLIC_STORAGE_URL` points to your Vercel domain
2. The `/uploads` folder is properly configured
3. File size limits are appropriate

### 5. Prisma Issues

**Common Prisma Problems:**
1. Run `npx prisma generate` before build
2. Ensure `DATABASE_URL` is correct
3. Run migrations: `npx prisma migrate deploy`

### 6. Case Sensitivity Issues

Vercel runs on Linux (case-sensitive), Windows is not:
- Check all file names match exactly
- Import paths must be exact
- File extensions must match

### 7. Memory and Timeout Issues

**If you get timeout errors:**
1. Increase function timeout in `vercel.json`
2. Optimize database queries
3. Use connection pooling

### 8. Debugging Steps

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions
   - Check for error messages

2. **Test API Routes:**
   - Visit `https://your-app.vercel.app/api/test-connection`
   - Check if database connection works

3. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Check build logs for specific errors

### 9. Quick Fix Checklist

- [ ] All environment variables set in Vercel
- [ ] Database connection string is correct
- [ ] All files are committed to git
- [ ] Build command is correct
- [ ] Node.js version is 18.x
- [ ] Prisma schema is up to date
- [ ] File upload paths are correct

### 10. Emergency Rollback

If deployment fails:
1. Go to Vercel Dashboard → Deployments
2. Click on last working deployment
3. Click "Promote to Production"

## Still Having Issues?

1. Check Vercel Function Logs for specific error messages
2. Test API endpoints individually
3. Verify database connectivity
4. Check file permissions and paths
5. Ensure all dependencies are in package.json
