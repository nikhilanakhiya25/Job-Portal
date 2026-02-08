# Job Portal Application

A comprehensive job portal application with features for Job Seekers, Recruiters, and Admins.

## Features

### Job Seeker Features
- User registration and secure login (JWT Authentication)
- Profile management and resume upload
- Resume parsing and skill extraction
- Advanced job search with filters (location, salary, company, skills)
- Job recommendations based on resume skills
- Apply for jobs with application tracking
- Save jobs to wishlist
- Job match percentage and skill gap analysis
- Email notifications for application status updates

### Recruiter Features
- Recruiter registration and company management
- Create, edit, and delete job listings
- View applied candidates with resume download
- Candidate match score and skill gap analysis
- Accept/reject/shortlist candidates
- Automated email notifications to candidates
- Job performance insights and analytics

### Admin Features
- Admin dashboard with platform analytics
- Manage job seekers and recruiters
- Approve/block user accounts
- Approve/block job listings
- Monitor system activity and logs
- Skill demand analytics and platform usage reports

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- PDF parsing with pdf-parse
- Email notifications with Nodemailer
- bcryptjs for password hashing

### Frontend
- React.js with Material-UI (MUI)
- React Router for navigation
- Axios for API calls
- Chart.js for analytics visualization
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=5000
```

4. Start the backend server:
```bash
npm start
# or for development with auto-restart
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Database Setup

The application uses MongoDB. Make sure MongoDB is running locally or update the `MONGODB_URI` in the `.env` file to point to your MongoDB instance.

### Sample Data

The application includes sample data for testing. You can create initial admin user and sample jobs through the application interface.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job (Recruiter/Admin)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (Recruiter/Admin)
- `DELETE /api/jobs/:id` - Delete job (Recruiter/Admin)
- `POST /api/jobs/:id/apply` - Apply for job (Job Seeker)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/my-applications` - Get user's applications
- `GET /api/dashboard/recommendations` - Get job recommendations
- `POST /api/dashboard/wishlist/:jobId` - Add job to wishlist
- `DELETE /api/dashboard/wishlist/:jobId` - Remove job from wishlist
- `GET /api/dashboard/wishlist` - Get user's wishlist

### Resume
- `POST /api/resume/upload` - Upload resume (PDF)
- `GET /api/resume` - Get user's resume info
- `DELETE /api/resume` - Delete user's resume

### Company
- `GET /api/company` - Get all companies
- `POST /api/company` - Create company (Admin)
- `GET /api/company/:id` - Get company by ID
- `PUT /api/company/:id` - Update company (Admin)
- `DELETE /api/company/:id` - Delete company (Admin)

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id` - Update user (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/jobs` - Get all jobs (Admin)
- `PUT /api/admin/jobs/:id` - Update job status (Admin)
- `DELETE /api/admin/jobs/:id` - Delete job (Admin)
- `GET /api/admin/analytics` - Get analytics data (Admin)

## User Roles

1. **Job Seeker** - Can search jobs, apply, upload resume, save jobs
2. **Recruiter** - Can post jobs, manage applications, view candidates
3. **Admin** - Full platform management and analytics access

## File Structure

```
job-portal/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── dashboardController.js
│   │   ├── resumeController.js
│   │   ├── adminController.js
│   │   └── matchController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Company.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── job.js
│   │   ├── dashboard.js
│   │   ├── resume.js
│   │   ├── company.js
│   │   └── admin.js
│   ├── utils/
│   │   └── emailService.js
│   ├── uploads/ (created automatically)
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageJobs.jsx
│   │   │   │   ├── PostJob.jsx
│   │   │   │   └── ViewApplicants.jsx
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── JobList.js
│   │   │   ├── MyJobs.js
│   │   │   ├── UserProfile.js
│   │   │   ├── Wishlist.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── AdminRoute.js
│   │   │   └── CompanyProfile.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Configure MongoDB for production
4. Set up email service for production

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```
2. Serve the `build` folder with a static server
3. Configure API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.

---

## Quick Start Commands

### Start Backend:
```bash
cd backend
npm install
npm start
```

### Start Frontend:
```bash
cd frontend
npm install
npm start
```

### Access Application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Sample Users for Testing

### Admin User
- Email: admin@jobportal.com
- Password: admin123
- Role: admin

### Recruiter User
- Email: recruiter@jobportal.com
- Password: recruiter123
- Role: recruiter

### Job Seeker User
- Email: jobseeker@jobportal.com
- Password: jobseeker123
- Role: jobseeker

*Note: Create these users through the registration form or directly in the database for testing purposes.*



### Job Portal ( Designs And All The Structure About The project Build Some Files And Pending Some Files)

Act as a senior full-stack software engineer and build a production-ready Job Portal Web Application.

🎯 Project Goal

Build a modern, scalable job portal where employers can post jobs and candidates can apply for jobs.

🧱 Tech Stack (Must Follow)

Frontend:

React.js (Functional Components + Hooks)

Tailwind CSS (Modern Professional UI)

Axios (API Calls)

React Router DOM

Recharts (Dashboard Analytics)

Backend:

Node.js

Express.js

JWT Authentication

REST API Architecture

Database:

MongoDB (Mongoose ODM)

👥 User Roles
👤 Candidate

Register / Login

Create Profile

Upload Resume

Search Jobs

Apply for Jobs

View Application Status

🏢 Employer / Admin

Admin Dashboard

Post Job

Edit / Delete Job

View Applicants

Manage Users

Analytics Dashboard

📊 Dashboard Features

Show real data from database:

Total Jobs

Total Users

Total Applications

Recent Job Posts

Recent Applications

Graph Analytics (Monthly Applications)

🔐 Authentication

JWT Login System

Role Based Access (Admin / Candidate)

Protected Routes

📁 Project Structure

Create proper folder structure:

client/
  src/
    components/
    pages/
    dashboard/
    services/

server/
  controllers/
  models/
  routes/
  middleware/
  config/

🗄 Database Models
User Model

name

email

password (hashed)

role (admin / candidate)

resume

skills

Job Model

title

company

location

salary

description

requirements

postedBy

Application Model

jobId

userId

status

appliedDate

🎨 UI Requirements

Professional Corporate Design

Responsive (Mobile + Desktop)

Dashboard Cards

Sidebar Navigation

Table Data View

Loading States

🔌 API Endpoints

Create Full REST APIs:

Auth:

POST /api/auth/register

POST /api/auth/login

Jobs:

GET /api/jobs

POST /api/jobs

PUT /api/jobs/:id

DELETE /api/jobs/:id

Applications:

POST /api/applications

GET /api/applications

Dashboard:

GET /api/dashboard/stats

📈 Extra Professional Features

Search + Filter Jobs

Pagination

Error Handling Middleware

Environment Config (.env)

API Service Layer in Frontend

🧪 Testing

Add sample seed data

Show example API responses

🚀 Output Requirement

Generate:

Full Backend Code

Full Frontend Code

Database Models

API Integration Example

Dashboard UI with Real API Data

Step-by-step Setup Guide

Code must be clean, modular, and production-ready.