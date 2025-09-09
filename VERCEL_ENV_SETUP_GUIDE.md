# 🚨 URGENT: Vercel Environment Variables Setup

## Why Your APIs Are Failing (500 Errors)

Your APIs are returning 500 Internal Server Error because **the database connection is failing**. This happens when the required environment variables are not set on Vercel.

## Required Environment Variables

You MUST add these environment variables to your Vercel project:

### 1. Database Connection
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

### 3. JWT Authentication
```
JWT_SECRET=[YOUR-JWT-SECRET]
```

### 4. Application URL
```
NEXT_PUBLIC_APP_URL=https://user-app-delta-six.vercel.app
```

## How to Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in to your account
3. Select your project: `user-app-delta-six`

### Step 2: Navigate to Environment Variables
1. Click on your project
2. Go to **Settings** tab
3. Click on **Environment Variables** in the left sidebar

### Step 3: Add Each Variable
1. Click **Add New**
2. Enter the **Name** (e.g., `DATABASE_URL`)
3. Enter the **Value** (your actual connection string)
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**

### Step 4: Repeat for All Variables
Add all 6 environment variables listed above.

## Getting Your Supabase Credentials

### Database Connection String
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string**
4. Copy the **URI** connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password

### Supabase API Keys
1. Go to **Settings** → **API**
2. Copy the **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
3. Copy the **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Copy the **service_role** key (for `SUPABASE_SERVICE_ROLE_KEY`)

### JWT Secret
Generate a secure random string for JWT authentication:
```bash
# You can use this command to generate a secure secret
openssl rand -base64 32
```

## After Adding Environment Variables

1. **Redeploy** your application on Vercel
2. **Test** the API endpoints:
   - `https://user-app-delta-six.vercel.app/api/ministries`
   - `https://user-app-delta-six.vercel.app/api/complaints`

## Verification

Once you've added the environment variables and redeployed:

✅ **Success Indicators:**
- APIs return 200 status codes
- Data is returned from endpoints
- No more 500 Internal Server Errors

❌ **Failure Indicators:**
- Still getting 500 errors
- "Failed to fetch" messages
- Database connection errors

## Troubleshooting

If you're still getting errors after adding environment variables:

1. **Check Variable Names**: Make sure they match exactly (case-sensitive)
2. **Check Values**: Ensure no extra spaces or quotes
3. **Redeploy**: Environment variables require a new deployment
4. **Check Logs**: Look at Vercel function logs for specific error messages

## Example Environment Variables

Here's what your environment variables should look like (with your actual values):

```
DATABASE_URL=postgresql://postgres:your_actual_password@db.ekteyncawtxgonkiblvp.supabase.co:5432/postgres
DIRECT_DATABASE_URL=postgresql://postgres:your_actual_password@db.ekteyncawtxgonkiblvp.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://ekteyncawtxgonkiblvp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_secure_random_string_here
NEXT_PUBLIC_APP_URL=https://user-app-delta-six.vercel.app
```

## ⚠️ IMPORTANT NOTES

- **Never commit** these values to your repository
- **Keep service_role key secret** - don't expose it publicly
- **Use different JWT secrets** for different environments
- **Test locally** with a `.env.local` file before deploying

---

**This is the root cause of your API failures. Once you add these environment variables, your APIs will work correctly!**
