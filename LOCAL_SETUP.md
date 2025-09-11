# Local Development Setup Guide

This guide will help you set up the Jharkhand Civic Reporting Platform for local development using PostgreSQL instead of Supabase.

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 12+ installed locally
- Git

## 1. Install PostgreSQL

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Make sure PostgreSQL service is running

### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Or using Postgres.app
# Download from https://postgresapp.com/
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Create Database

1. Open PostgreSQL command line or pgAdmin
2. Create a new database:

```sql
-- Connect to PostgreSQL as postgres user
psql -U postgres

-- Create database
CREATE DATABASE jharkhand_civic_reporting;

-- Create a user (optional, you can use postgres user)
CREATE USER civic_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE jharkhand_civic_reporting TO civic_user;

-- Exit psql
\q
```

## 3. Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env.local
```

2. Edit `.env.local` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/jharkhand_civic_reporting"
JWT_SECRET_KEY="your-super-secret-jwt-key-here"
NODE_ENV="development"
```

## 4. Install Dependencies

```bash
npm install
# or
yarn install
```

## 5. Database Setup

1. Generate Prisma client:
```bash
npm run postinstall
```

2. Run database migrations:
```bash
npm run db:migrate
```

3. (Optional) Seed the database with sample data:
```bash
npm run db:seed
```

## 6. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 7. File Storage

The application now uses local file storage instead of Supabase:
- Uploaded files are stored in `public/uploads/` directory
- Files are served directly by Next.js
- No external storage service required

## 8. Database Management

### Reset Database
```bash
# Drop and recreate database
npx prisma migrate reset --schema=./src/prisma/schema.prisma
```

### View Database
```bash
# Open Prisma Studio
npx prisma studio --schema=./src/prisma/schema.prisma
```

### Manual Database Operations
```bash
# Connect to database
psql -U postgres -d jharkhand_civic_reporting

# List tables
\dt

# View table structure
\d table_name
```

## 9. Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL service is running
- Check if the database exists
- Verify connection string in `.env.local`
- Check if port 5432 is available

### Permission Issues
- Ensure the database user has proper permissions
- Check if the database exists and is accessible

### File Upload Issues
- Ensure `public/uploads/` directory exists and is writable
- Check file permissions

## 10. Production Considerations

For production deployment:
1. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Set up proper file storage (AWS S3, Google Cloud Storage, etc.)
3. Use environment-specific configuration
4. Set up proper backup strategies
5. Configure SSL/TLS for database connections

## 11. Migration from Supabase

If you're migrating from Supabase:
1. Export your data from Supabase
2. Import data into local PostgreSQL
3. Update file URLs to point to local storage
4. Test all functionality

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the application logs
3. Check database connection and permissions
4. Verify environment variables are set correctly
