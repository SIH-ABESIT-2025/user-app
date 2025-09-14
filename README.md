# Jharkhand Civic Reporting Platform

A modern civic issue reporting platform for the Government of Jharkhand, built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **Citizen Complaint System**: Submit and track civic issues
- **Real-time Updates**: Get notifications on complaint status
- **Interactive Map**: View complaints on a map interface
- **File Attachments**: Upload images, videos, and documents
- **Multi-role Support**: Citizens, ministry staff, and administrators
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Material-UI (MUI)
- **Maps**: Leaflet
- **Authentication**: JWT-based
- **File Storage**: Local file system

## 🚀 AWS Amplify Deployment

This project is optimized for AWS Amplify deployment.

### Prerequisites

- AWS Account
- PostgreSQL database (AWS RDS recommended)
- Node.js 18+

### Deployment Steps

1. **Connect Repository**
   - Connect your GitHub repository to AWS Amplify
   - Select the main branch

2. **Configure Build Settings**
   - Build command: `npm run amplify-build`
   - Output directory: `.next`

3. **Set Environment Variables**
   ```env
   DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/jharkhand_civic_reporting
   JWT_SECRET_KEY=your-super-secret-jwt-key-here-32-characters-minimum
   NODE_ENV=production
   NEXT_PUBLIC_HOST_URL=https://your-app-id.amplifyapp.com
   NEXT_PUBLIC_STORAGE_URL=https://your-app-id.amplifyapp.com/uploads
   ```

4. **Database Setup**
   - Create PostgreSQL database on AWS RDS
   - Run migrations: `npm run db:migrate`
   - Seed data (optional): `npm run db:seed`

5. **Deploy**
   - Amplify will automatically build and deploy
   - Access your app at the provided Amplify URL

## 📁 Project Structure

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

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run amplify-build` - Build for AWS Amplify
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:push` - Push schema changes to database

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:
- **Users**: Citizens, ministry staff, and administrators
- **Complaints**: Civic issues with status tracking
- **Ministries**: Government departments
- **Messages**: Communication between users
- **Notifications**: System notifications
- **Tweets**: Social media style posts

## 📁 File Storage

The application uses local file storage:
- Uploaded files are stored in `public/uploads/`
- Files are served directly by Next.js
- Supports images, videos, audio, and documents

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- File type and size restrictions
- SQL injection protection via Prisma
- Security headers for production

## 🚀 Production Optimizations

- **Image Optimization**: WebP and AVIF formats
- **Compression**: Gzip compression enabled
- **Caching**: Optimized cache strategies
- **Bundle Optimization**: Tree shaking and code splitting
- **Security Headers**: XSS and CSRF protection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
1. Check the deployment logs in AWS Amplify console
2. Verify environment variables are set correctly
3. Check database connection and permissions
4. Review application logs for errors