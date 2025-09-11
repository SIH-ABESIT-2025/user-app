# Admin Dashboard - Jharkhand Civic Reporting Platform

## Overview

The Admin Dashboard is a comprehensive management interface for the Jharkhand Civic Reporting Platform, designed for administrators and ministry staff to manage complaints, users, ministries, and system analytics.

## Features

### 🔐 Authentication & Authorization
- **Role-based access control** with four user roles:
  - `CITIZEN` - Regular users who can report complaints
  - `MINISTRY_STAFF` - Government staff who can manage assigned complaints
  - `ADMIN` - Platform administrators with full management access
  - `SUPER_ADMIN` - System administrators with complete control
- **JWT-based authentication** with secure cookie storage
- **Middleware protection** for all admin routes
- **Automatic redirect** for unauthorized access

### 📊 Dashboard Overview
- **Real-time statistics** showing:
  - Total complaints, users, and ministries
  - Resolution rates and pending complaints
  - Urgent complaint alerts
  - Recent activity summaries
- **Visual charts** and progress indicators
- **Quick access** to key management functions

### 🏛️ Complaints Management
- **Comprehensive complaint listing** with advanced filtering
- **Status management** (Submitted → Under Review → In Progress → Resolved)
- **Priority assignment** (Low, Medium, High, Urgent)
- **Ministry assignment** and staff allocation
- **Bulk operations** and export functionality
- **Detailed complaint view** with full history
- **File attachment management**

### 👥 User Management
- **User directory** with search and filtering
- **Role management** and permission assignment
- **Account activation/deactivation**
- **User statistics** and activity tracking
- **Profile management** and verification status
- **Bulk user operations**

### 🏢 Ministry Management
- **Ministry directory** with full CRUD operations
- **Ministry-specific complaint tracking**
- **Staff assignment** and management
- **Ministry performance metrics**
- **Color-coded organization** system

### 📈 Analytics & Reporting
- **Comprehensive analytics dashboard** with:
  - Complaints by status and priority
  - Ministry-wise complaint distribution
  - Monthly trends and patterns
  - Top users and activity metrics
- **Customizable time ranges** (7 days, 30 days, 90 days, 1 year)
- **Visual charts** and progress indicators
- **Export capabilities** for reports

### 🗺️ Map View
- **Interactive map** showing complaint locations
- **Geographic distribution** analysis
- **Priority-based color coding** for markers
- **Filtered map views** by status and priority
- **Click-to-view** complaint details
- **Location-based statistics**

### 💬 Message Management
- **System-wide message monitoring**
- **User communication oversight**
- **Message search and filtering**
- **Attachment management**
- **Reply and moderation capabilities**

### ⚙️ System Settings
- **Platform configuration** management
- **User registration controls**
- **File upload settings**
- **Email configuration**
- **Maintenance mode** controls
- **System information** display

## Technical Implementation

### Frontend Architecture
- **Next.js 14** with App Router
- **Material-UI (MUI)** for consistent design
- **TypeScript** for type safety
- **React Query** for data fetching and caching
- **Responsive design** for all screen sizes

### Backend API
- **RESTful API** design with proper HTTP methods
- **Prisma ORM** for database operations
- **PostgreSQL** database with proper indexing
- **JWT authentication** with role-based access
- **Input validation** and error handling

### Database Schema
```sql
-- User roles enum
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'MINISTRY_STAFF', 'ADMIN', 'SUPER_ADMIN');

-- Updated User table
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'CITIZEN';
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
```

### Security Features
- **Role-based access control** at API and UI levels
- **JWT token validation** for all admin routes
- **Input sanitization** and validation
- **SQL injection prevention** through Prisma
- **XSS protection** with proper escaping
- **CSRF protection** with secure cookies

## Getting Started

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL database
- Environment variables configured

### Installation
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

3. **Seed the database:**
   ```bash
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Default Admin Accounts
After seeding, you can access the admin dashboard with:

**Super Admin:**
- Username: `admin`
- Password: `admin123`
- Access: Full system control

**Ministry Staff:**
- Username: `ministry_staff`
- Password: `staff123`
- Access: Limited to assigned complaints

## Usage Guide

### Accessing the Admin Dashboard
1. **Login** with admin credentials
2. **Navigate** to the admin panel via the sidebar or direct URL `/admin`
3. **Select** the desired management section from the navigation menu

### Managing Complaints
1. **View** all complaints in the complaints management page
2. **Filter** by status, priority, ministry, or search terms
3. **Update** complaint status and assign to staff
4. **View** detailed complaint information and history
5. **Export** complaint data for reporting

### User Management
1. **Browse** all registered users
2. **Search** users by name, username, or email
3. **Change** user roles and permissions
4. **Activate/deactivate** user accounts
5. **View** user statistics and activity

### Analytics and Reporting
1. **Access** the analytics dashboard
2. **Select** time range for analysis
3. **View** visual charts and statistics
4. **Export** reports for external use
5. **Monitor** system performance metrics

## API Endpoints

### Admin Dashboard
- `GET /api/admin/dashboard/complaints` - Complaint statistics
- `GET /api/admin/dashboard/users` - User statistics
- `GET /api/admin/dashboard/ministries` - Ministry statistics

### Complaints Management
- `GET /api/admin/complaints` - List complaints with filtering
- `PATCH /api/admin/complaints/[id]/status` - Update complaint status
- `DELETE /api/admin/complaints/[id]` - Delete complaint

### User Management
- `GET /api/admin/users` - List users with filtering
- `PATCH /api/admin/users/[id]/role` - Update user role
- `PATCH /api/admin/users/[id]/status` - Update user status
- `DELETE /api/admin/users/[id]` - Delete user

### Ministry Management
- `GET /api/admin/ministries` - List ministries
- `POST /api/admin/ministries` - Create ministry
- `PUT /api/admin/ministries/[id]` - Update ministry
- `DELETE /api/admin/ministries/[id]` - Delete ministry
- `PATCH /api/admin/ministries/[id]/status` - Update ministry status

### Analytics
- `GET /api/admin/analytics` - Get analytics data

### Messages
- `GET /api/admin/messages` - List messages
- `DELETE /api/admin/messages/[id]` - Delete message

## Security Considerations

### Access Control
- All admin routes are protected by middleware
- Role-based permissions are enforced at API level
- JWT tokens are validated for every request
- Session management with secure cookies

### Data Protection
- Input validation and sanitization
- SQL injection prevention through Prisma
- XSS protection with proper escaping
- Secure file upload handling

### Audit Trail
- All admin actions are logged
- User activity tracking
- System change monitoring
- Error logging and monitoring

## Customization

### Adding New Admin Features
1. **Create** new API routes in `/api/admin/`
2. **Add** corresponding UI components
3. **Update** navigation menu
4. **Implement** proper authorization checks

### Modifying User Roles
1. **Update** the `UserRole` enum in Prisma schema
2. **Modify** middleware authorization logic
3. **Update** UI components to handle new roles
4. **Run** database migration

### Styling and Theming
- **Material-UI** theme customization
- **SCSS** variables for consistent styling
- **Responsive** design breakpoints
- **Dark/Light** theme support

## Troubleshooting

### Common Issues
1. **Access Denied**: Check user role and permissions
2. **Database Errors**: Verify Prisma schema and migrations
3. **Authentication Issues**: Check JWT token validity
4. **UI Loading Problems**: Verify API endpoints and data flow

### Debug Mode
- Enable debug logging in development
- Check browser console for errors
- Verify network requests in DevTools
- Monitor database queries in Prisma Studio

## Support

For technical support or feature requests:
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs through the project issue tracker
- **Development**: Follow the established coding patterns and conventions

---

**Note**: This admin dashboard is designed for government use and includes appropriate security measures for handling sensitive civic data. Always follow your organization's security policies and data protection regulations.
