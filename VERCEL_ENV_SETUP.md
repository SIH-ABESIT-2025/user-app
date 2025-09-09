# Vercel Environment Variables Setup

## Required Environment Variables

You need to add these environment variables to your Vercel project:

### 1. Database Configuration
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ekteyncawtxgonkiblvp.supabase.co:5432/postgres
DIRECT_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ekteyncawtxgonkiblvp.supabase.co:5432/postgres
```

### 2. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://ekteyncawtxgonkiblvp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SUPABASE-SERVICE-ROLE-KEY]
```

### 3. JWT Secret
```
JWT_SECRET=[YOUR-JWT-SECRET]
```

### 4. Application URL
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above with the correct values
5. Make sure to set them for "Production", "Preview", and "Development" environments
6. Redeploy your application

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Go to Settings → Database
3. Copy the connection string and replace [YOUR-PASSWORD] with your database password
4. Go to Settings → API
5. Copy the Project URL and anon key
6. Copy the service_role key (keep this secret!)

## Important Notes

- Replace [YOUR-PASSWORD] with your actual Supabase database password
- Replace [YOUR-SUPABASE-ANON-KEY] with your actual Supabase anon key
- Replace [YOUR-SUPABASE-SERVICE-ROLE-KEY] with your actual service role key
- Replace [YOUR-JWT-SECRET] with a secure random string
- Replace [YOUR-APP-URL] with your actual Vercel app URL

## After Adding Environment Variables

1. Redeploy your application on Vercel
2. The database connection should work properly
3. Your Prisma client will be able to connect to the database
