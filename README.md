# Jharkhand Civic Reporting Platform

A modern civic issue reporting platform for the Government of Jharkhand, built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Citizen Complaint System**: Submit and track civic issues
- **Real-time Updates**: Get notifications on complaint status
- **Interactive Map**: View complaints on a map interface
- **File Attachments**: Upload images, videos, and documents
- **Multi-role Support**: Citizens, ministry staff, and administrators
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Material-UI (MUI)
- **Maps**: Leaflet
- **Authentication**: JWT-based
- **File Storage**: Local file system

## Quick Start

1. **Prerequisites**
   - Node.js 18+
   - PostgreSQL 12+
   - npm or yarn

2. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd user-app
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb jharkhand_civic_reporting
   
   # Copy environment file
   cp env.example .env.local
   
   # Edit .env.local with your database credentials
   ```

4. **Environment Variables**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/jharkhand_civic_reporting"
   JWT_SECRET_KEY="your-super-secret-jwt-key-here"
   NODE_ENV="development"
   ```

5. **Initialize Database**
   ```bash
   npm run postinstall
   npm run db:migrate
   npm run db:seed  # Optional: seed with sample data
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit http://localhost:3000 to see the application.

## Detailed Setup

For comprehensive setup instructions, see [LOCAL_SETUP.md](./LOCAL_SETUP.md).

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin dashboard pages
│   ├── (public)/          # Public pages
│   ├── (twitter)/         # User interface pages
│   └── api/               # API routes
├── components/            # React components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── prisma/                # Database schema and migrations
├── types/                 # TypeScript type definitions
├── utilities/             # Utility functions
└── styles/                # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:push` - Push schema changes to database

## Database Schema

The application uses PostgreSQL with the following main entities:
- **Users**: Citizens, ministry staff, and administrators
- **Complaints**: Civic issues with status tracking
- **Ministries**: Government departments
- **Messages**: Communication between users
- **Notifications**: System notifications
- **Tweets**: Social media style posts

## File Storage

The application uses local file storage:
- Uploaded files are stored in `public/uploads/`
- Files are served directly by Next.js
- Supports images, videos, audio, and documents

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- File type and size restrictions
- SQL injection protection via Prisma

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
1. Check the [LOCAL_SETUP.md](./LOCAL_SETUP.md) guide
2. Review the troubleshooting section
3. Check application logs
4. Verify database connection and permissions

## Migration from Supabase

This project has been migrated from Supabase to local PostgreSQL. If you're upgrading from a Supabase version:
1. Follow the setup instructions in [LOCAL_SETUP.md](./LOCAL_SETUP.md)
2. Export your data from Supabase
3. Import data into local PostgreSQL
4. Update file URLs to point to local storage