# Netlify Deployment Guide

## Quick Setup for Netlify

### 1. Environment Variables in Netlify Dashboard

Go to **Site Settings → Environment Variables** and add:

```
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET_KEY=your-super-secret-jwt-key-here-32-characters-minimum
NODE_ENV=production
NEXT_PUBLIC_HOST_URL=https://your-app.netlify.app
NEXT_PUBLIC_STORAGE_URL=https://your-app.netlify.app/uploads
NEXTAUTH_URL=https://your-app.netlify.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 2. Build Settings in Netlify

- **Build Command**: `npm run netlify-build`
- **Publish Directory**: `.next`
- **Node Version**: 18
- **NPM Version**: 8+

### 3. Database Setup Options

**Option A: Supabase (Recommended)**
1. Create account at supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

**Option B: PlanetScale**
1. Create account at planetscale.com
2. Create database
3. Get connection string
4. Format: `mysql://[username]:[password]@[host]/[database]`

**Option C: Railway**
1. Create account at railway.app
2. Create PostgreSQL service
3. Get connection string
4. Format: `postgresql://postgres:[password]@[host]:[port]/railway`

### 4. Prisma Configuration

The project includes a custom Prisma generation script that handles missing DATABASE_URL gracefully.

### 5. File Uploads

Netlify handles file uploads through API routes. Make sure:
- `NEXT_PUBLIC_STORAGE_URL` points to your Netlify domain
- File size limits are appropriate
- CORS is configured properly

### 6. Common Issues & Solutions

**Issue: Prisma Generate Fails**
- ✅ Fixed with custom generation script
- ✅ Handles missing DATABASE_URL gracefully

**Issue: Database Connection Error**
- Check DATABASE_URL format (must start with `postgresql://`)
- Verify database credentials
- Ensure database is accessible from Netlify

**Issue: Build Timeout**
- Netlify has 15-minute build limit
- Optimize build process
- Use build caching

**Issue: Function Timeout**
- Netlify Functions have 10-second timeout
- Optimize database queries
- Use connection pooling

### 7. Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Set build command: `npm run netlify-build`
   - Set publish directory: `.next`

2. **Set Environment Variables**
   - Add all required environment variables
   - Use production values

3. **Deploy**
   - Netlify will automatically deploy on git push
   - Check build logs for any errors

4. **Test Deployment**
   - Visit your Netlify URL
   - Test API endpoints
   - Verify database connectivity

### 8. Monitoring & Debugging

**Check Build Logs:**
- Go to Netlify Dashboard → Deployments
- Click on deployment to see logs

**Check Function Logs:**
- Go to Functions tab
- Check for runtime errors

**Test API Endpoints:**
- Visit `https://your-app.netlify.app/api/test-connection`
- Check database connectivity

### 9. Performance Optimization

- Enable Netlify caching
- Use CDN for static assets
- Optimize images
- Minimize bundle size
- Use build caching

### 10. Security Considerations

- Use environment variables for secrets
- Enable HTTPS
- Configure CORS properly
- Validate all inputs
- Use secure database credentials

## Troubleshooting

If deployment fails:

1. **Check Build Logs** for specific error messages
2. **Verify Environment Variables** are set correctly
3. **Test Database Connection** with a simple API call
4. **Check File Paths** for case sensitivity issues
5. **Verify Dependencies** are in package.json

## Support

For additional help:
- Check Netlify documentation
- Review build logs
- Test locally with production environment variables
- Verify all files are committed to git
