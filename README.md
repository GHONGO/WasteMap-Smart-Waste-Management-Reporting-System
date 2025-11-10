# 🗑️ WasteMap — Smart Waste Management & Reporting System

### 🌟 Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)

---
### DEPLOYMENT
- The frontend is deployed on Netlify.
- The live site can be accessed on: https://wastemap.netlify.app/
- The backend is deployed using render.

### 🌍 SDG-Aligned Project
**WasteMap** addresses:
- **SDG 11:** Sustainable Cities & Communities  
- **SDG 12:** Responsible Consumption & Production  
- **SDG 13:** Climate Action  

---

## 📘 Project Overview

**WasteMap** is a full-stack web application that empowers communities and municipalities to manage waste efficiently.  
**Citizens** can report waste issues with photos and GPS locations, while **municipal authorities** can assign cleanup teams, optimize routes, and monitor cleanup performance in real time.

**📍 Map Location:** The application is configured for **Kenya** (centered on Nairobi: -1.2921, 36.8219)

---

## 🚀 Features

### 👥 For Citizens
- 📍 Report waste issues with location tagging (GPS coordinates)
- 📸 Upload multiple photos of waste sites
- 🔔 Live status updates on reports (Real-time via Socket.io)
- 🗺️ Interactive map view with React-Leaflet (Kenya-focused)
- 📱 Mobile-friendly responsive design
- 🔍 Filter reports by status and priority
- 📊 View personal report history
- 🔑 **Password Reset:** Request password reset from login screen (superadmin will be notified)

### 🏛️ For Municipal Admins
- 📊 Admin dashboard with comprehensive analytics
- 👥 **User Management System:**
  - Create, edit, and delete users through UI
  - **Can only see and manage Citizen and Worker users** (cannot see other admins or superadmins)
  - Manage user roles (Citizen/Worker only)
  - Assign users to cleanup teams
  - No MongoDB commands needed after initial setup
- 👷 **Team Management:**
  - Create and manage cleanup teams
  - Assign team leaders
  - Add/remove team members
  - View team performance
- 📋 **Report Assignment:**
  - Assign reports to teams
  - **Assign reports to individual workers** (multiple workers can be assigned)
  - Track assignment status
- 🚗 **Route Optimization:**
  - Functional route optimization algorithm
  - Visual display of optimized routes
  - Priority-based sorting
  - Distance calculations
  - Estimated time calculations
- 🕒 Real-time report updates
- 🗂️ Data-driven insights (reports by priority, status, completion times)

### ⚙️ For Super Admins (Developers)
- 🔐 Full system access and control
- 👥 **Advanced User Management:**
  - **See and manage ALL users** (including other admins and superadmins)
  - Create admin and superadmin users
  - Manage all user roles including municipal admins
  - System-wide configuration access
- 👷 **Team Management:**
  - Create and manage all teams
  - Full team configuration access
- 🔑 **Password Reset Management:**
  - View all password reset requests from users
  - Reset user passwords with temporary passwords
  - Users are required to change password on next login after reset
- 📊 System analytics and monitoring
- 🔧 Complete administrative control

---

## 👤 User Roles & Access Control

The system supports **4 distinct user roles** with different access levels:

| Role | Description | Access Level | Portal |
|------|-------------|-------------|---------|
| **Citizen** | Regular users who report waste issues | Basic | `/map`, `/reports` |
| **Worker** | Cleanup team members | Medium | `/map`, `/reports`, report status updates |
| **Admin** | Municipal administrators | High | `/dashboard` (Municipal Portal) |
| **Superadmin** | System developers/administrators | Full | `/superadmin` (Super Admin Portal) |

### Role Permissions

**Citizen:**
- ✅ Register and login
- ✅ Create waste reports
- ✅ View own reports
- ✅ Filter own reports
- ❌ Cannot access admin features

**Worker:**
- ✅ All citizen permissions
- ✅ Update report statuses
- ✅ View assigned reports
- ✅ Access team-specific features
- ❌ Cannot manage users

**Admin (Municipal):**
- ✅ All worker permissions
- ✅ Access Municipal Portal (`/dashboard`)
- ✅ View all reports
- ✅ Assign reports to teams **or individual workers**
- ✅ Create/edit/delete users (**Citizen and Worker only** - cannot see or manage other admins or superadmins)
- ✅ **Create and manage teams** (Team Management tab in Dashboard)
- ✅ View analytics and statistics
- ✅ **Route optimization** (functional with visual results)
- ❌ Cannot create admin or superadmin users
- ❌ Cannot see other admin or superadmin users

**Superadmin (Developer):**
- ✅ All admin permissions
- ✅ Access Super Admin Portal (`/superadmin`)
- ✅ **See and manage ALL users** (including other admins and superadmins)
- ✅ Create admin and superadmin users
- ✅ Modify any user role
- ✅ **Create and manage teams** (Team Management tab in Super Admin Portal)
- ✅ **Password Reset Management** (view requests and reset passwords)
- ✅ Full system access
- ✅ System configuration

---

## 🔑 Password Reset Feature

The system includes a comprehensive password reset workflow that ensures security and proper access control.

### How It Works

1. **User Requests Password Reset:**
   - Users can click "Forgot Password?" on the login screen
   - They enter their email address
   - A password reset request is submitted to the system
   - The superadmin is notified (visible in the Super Admin Portal)

2. **Superadmin Resets Password:**
   - Superadmin navigates to the "Password Resets" tab in the Super Admin Portal
   - All pending password reset requests are displayed
   - Superadmin can set a new temporary password for the user
   - The system automatically marks the user to change password on next login

3. **User Changes Password:**
   - After password reset, when the user logs in with the temporary password
   - They are immediately prompted to change their password
   - The temporary password becomes the "old password" in the change password form
   - Once changed, the user can access the system normally

### Security Features

- ✅ Password reset requests are only visible to superadmins
- ✅ Users must change the temporary password on first login
- ✅ The temporary password is used as the "old password" during password change
- ✅ Password reset requests are tracked with timestamps
- ✅ System prevents users from accessing other features until password is changed

### API Endpoints

- `POST /api/auth/request-password-reset` - Public endpoint for requesting password reset
- `GET /api/admin/password-reset-requests` - Superadmin only - Get all reset requests
- `POST /api/admin/reset-password/:userId` - Superadmin only - Reset user password
- `POST /api/auth/change-password` - Private endpoint - Change password after reset

---

## 🛠️ Tech Stack Details

| Layer | Technology | Purpose |
|-------|-------------|---------|
| **Frontend** | React + Vite | Fast SPA with hot module replacement |
|  | React Router DOM | Client-side routing |
|  | React-Leaflet | Interactive maps (Kenya-focused) |
|  | Tailwind CSS | Modern utility-first CSS framework |
|  | Axios | HTTP client for API calls |
|  | React Hot Toast | Toast notifications |
|  | Socket.io Client | Real-time updates |
| **Backend** | Node.js + Express.js | RESTful API server |
|  | MongoDB Atlas | Cloud NoSQL database |
|  | Mongoose | ODM for MongoDB |
|  | Multer + Cloudinary | Image upload and storage |
|  | JWT + bcryptjs | Secure authentication |
|  | Socket.io | WebSocket for real-time communication |
| **Dev Tools** | Git, Vite, Nodemon | Development workflow |

---

## 📂 Project Structure

```
WasteMap/
├── backend/
│   ├── server.js                 # Express server with Socket.io
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model (citizen/admin/worker/superadmin)
│   │   ├── Report.js            # Report model with geospatial index
│   │   └── Team.js              # Team model for cleanup crews
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── reportController.js  # Report CRUD operations
│   │   └── adminController.js   # Admin dashboard & team management
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── reportRoutes.js      # Report endpoints
│   │   └── adminRoutes.js       # Admin endpoints
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication & role-based authorization
│   ├── utils/
│   │   ├── cloudinary.js        # Image upload configuration
│   │   └── generateToken.js     # JWT token generation
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   ├── ReportForm.jsx   # Report creation form
│   │   │   ├── ReportCard.jsx   # Report display card
│   │   │   ├── PrivateRoute.jsx # Protected route wrapper
│   │   │   ├── UserManagement.jsx # User management component
│   │   │   └── ChangePasswordModal.jsx # Password change modal
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── MapView.jsx      # Interactive map with reports (Kenya)
│   │   │   ├── Reports.jsx      # User's reports list
│   │   │   ├── ReportDetail.jsx # Individual report view
│   │   │   ├── Dashboard.jsx    # Admin dashboard (Municipal Portal)
│   │   │   └── SuperAdmin.jsx  # Super Admin portal
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global authentication state
│   │   ├── services/
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js  # Auth API calls
│   │   │   ├── reportService.js # Report API calls
│   │   │   └── adminService.js # Admin API calls
│   │   ├── hooks/
│   │   │   └── useSocket.js     # Socket.io hook
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── vite.config.js           # Vite configuration
│   ├── package.json
│   └── .env.example
├── .gitignore
├── SETUP.md                     # Detailed setup instructions
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration (use either CLOUDINARY_URL or individual vars)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# OR
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Required variables:** `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_URL` (or individual Cloudinary vars)

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_token_optional
```

**Note:** Frontend `.env` is optional. Default values will be used if not provided.

---

## 🆕 Recent Updates & Features

### Latest Enhancements

1. **Password Reset System:**
   - Users can request password reset from the login screen
   - Superadmin receives notifications for all password reset requests
   - Superadmin can reset user passwords with temporary passwords
   - Users are required to change password on next login after reset
   - Secure workflow ensures proper access control and password management

2. **Role-Based User Filtering:**
   - **Admin (Municipal)** users can now only see and manage **Citizen** and **Worker** users
   - **Superadmin** users can see and manage **ALL** users (including other admins and superadmins)
   - This ensures proper access control and data privacy

3. **Team Management System:**
   - Full team creation and management UI in both Dashboard and Super Admin Portal
   - Create teams with names, leaders, and members
   - Assign workers to teams
   - View team performance and member counts
   - Teams can be assigned to reports for organized cleanup operations

4. **Worker Assignment to Reports:**
   - Admins can now assign reports to **individual workers** (not just teams)
   - Multiple workers can be assigned to a single report
   - Visual display of assigned workers on report detail page
   - Better flexibility in report assignment workflow

5. **Functional Route Optimization:**
   - Route optimization algorithm is now fully functional
   - Visual display of optimized routes with:
     - Priority-based sorting (High → Medium → Low)
     - Distance calculations between report locations
     - Estimated completion time
     - Step-by-step route visualization
   - Click "Optimize Routes" button in Dashboard to generate optimized routes for pending reports

6. **Enhanced Report Assignment:**
   - Admins can assign reports to both teams and individual workers
   - Multiple assignment options for better flexibility
   - Real-time updates when assignments are made

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB Atlas** account (or local MongoDB instance)
- **Cloudinary** account (for image uploads)
- **npm** or **yarn** package manager

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/WasteMap.git
cd WasteMap
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Edit .env with your actual credentials:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: A strong random string for authentication
# - CLOUDINARY_URL or individual Cloudinary credentials
# See SETUP.md for detailed instructions

# Start development server
npm run dev
```

✅ Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file from example (optional)
cp .env.example .env

# Edit .env if your backend runs on a different URL
# Default: VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

✅ Frontend will run on `http://localhost:5173`

### Step 4: Create Initial Users

#### Create a Superadmin User (One-Time Setup)

Since registration is restricted to citizens only, you need to create a superadmin user directly in MongoDB:

**Option 1: Using MongoDB Shell**

```javascript
// Connect to your MongoDB database
use wastemap

// Insert superadmin user (password will be hashed on first login)
// You'll need to hash the password first using bcrypt
db.users.insertOne({
  name: "Super Admin",
  email: "superadmin@wastemap.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash your password
  role: "superadmin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Option 2: Using MongoDB Compass or GUI**

1. Connect to your MongoDB database
2. Navigate to the `users` collection
3. Insert a new document with:
   - `name`: "Super Admin"
   - `email`: "your-email@example.com"
   - `password`: (hashed password - use bcrypt)
   - `role`: "superadmin"

**Option 3: Temporary Registration Method**

1. Temporarily modify `backend/controllers/authController.js` to allow role assignment
2. Register a user with superadmin role
3. Revert the changes

#### Create an Admin User (Municipal)

After logging in as superadmin:

1. Navigate to **Super Admin Portal** (`/superadmin`)
2. Go to **User Management** tab
3. Click **Create User**
4. Fill in details and select **Admin (Municipal)** role
5. Click **Create User**

#### Create Regular Users

**As Citizen:**
- Register through the registration page at `/register`

**As Admin/Superadmin:**
- Use the User Management interface in the respective portals

---

## 📖 How to Run the Application

### Development Mode

#### Running Backend

```bash
# Navigate to backend directory
cd backend

# Start development server with nodemon (auto-restart on changes)
npm run dev
```

The backend server will start on `http://localhost:5000`

**Available Scripts:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

#### Running Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Start development server with Vite
npm run dev
```

The frontend will start on `http://localhost:5173`

**Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Production Mode

#### Building Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` folder.

#### Running Backend in Production

```bash
cd backend
npm start
```

**Note:** Make sure to set `NODE_ENV=production` in your `.env` file for production.

### Running Both Servers

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open your browser and navigate to `http://localhost:5173`

---

## 🎯 Usage Guide

### For Citizens

1. **Register:** Go to `/register` and create an account
2. **Login:** Use your credentials at `/login`
3. **Report Issues:**
   - Navigate to **Map** (`/map`)
   - Click on the map to select a location
   - Click **"Report Waste Issue"** button
   - Fill in the form with description, photos, and priority
   - Submit the report
4. **View Reports:** Go to **My Reports** (`/reports`) to see all your reports
5. **Track Status:** Reports update in real-time as admins/workers update them

### For Municipal Admins

1. **Login:** Use your admin credentials
2. **Access Dashboard:** Click **"Municipal Portal"** in the navbar
3. **View Analytics:**
   - See statistics on the Overview tab
   - View reports by priority and status
   - Monitor completion times
4. **Manage Users:**
   - Go to **User Management** tab
   - Create new users (Citizen, Worker, Admin)
   - Edit user details and roles
   - Assign users to teams
   - Delete users (except yourself)
5. **Manage Reports:**
   - Assign reports to teams
   - Update report statuses
   - Add notes to reports
6. **Optimize Routes:** Use the route optimization feature to plan cleanup routes

### For Super Admins

1. **Login:** Use your superadmin credentials
2. **Access Super Admin Portal:** Click **"Super Admin"** in the navbar
3. **Full System Access:**
   - View system-wide analytics
   - Create admin and superadmin users
   - Manage all user roles
   - System configuration access
4. **User Management:**
   - Create users with any role (including admin and superadmin)
   - Modify any user's role
   - Full administrative control
5. **Password Reset Management:**
   - Navigate to **"Password Resets"** tab
   - View all pending password reset requests
   - Reset user passwords with temporary passwords
   - Users will be required to change password on next login

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Citizen only)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/request-password-reset` - Request password reset (Public)
- `POST /api/auth/change-password` - Change password after reset (Protected)

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/nearby` - Get nearby reports (geospatial query)
- `POST /api/reports` - Create new report (Protected)
- `PUT /api/reports/:id/status` - Update report status (Admin/Worker)
- `PUT /api/reports/:id/assign` - Assign report to team (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (Admin/Superadmin)
- `GET /api/admin/users` - Get all users (Admin/Superadmin)
- `POST /api/admin/users` - Create new user (Admin/Superadmin)
- `PUT /api/admin/users/:id` - Update user (Admin/Superadmin)
- `DELETE /api/admin/users/:id` - Delete user (Admin/Superadmin)
- `GET /api/admin/teams` - Get all teams (Admin/Superadmin)
- `POST /api/admin/teams` - Create team (Admin/Superadmin)
- `PUT /api/admin/teams/:id` - Update team (Admin/Superadmin)
- `GET /api/admin/optimize-routes` - Get optimized route (Admin/Superadmin)
- `GET /api/admin/password-reset-requests` - Get password reset requests (Superadmin only)
- `POST /api/admin/reset-password/:userId` - Reset user password (Superadmin only)

---

## 🎨 Design & Theme

The application features a **modern, eco-friendly design** with:

- **Color Scheme:** Green/eco-friendly theme with gradients
- **Responsive Design:** Mobile-first approach
- **Smooth Animations:** Fade-in, slide-up, and hover effects
- **Modern UI Elements:**
  - Gradient buttons
  - Rounded corners (xl/2xl)
  - Enhanced shadows
  - Backdrop blur effects
  - Custom scrollbars

**Map Location:** Configured for **Kenya** (Nairobi: -1.2921, 36.8219)

---

## 🔄 Real-time Features

The application uses **Socket.io** for real-time updates:
- ✅ New reports appear instantly on the map
- ✅ Status changes broadcast to all connected clients
- ✅ Report updates visible in real-time without refresh
- ✅ Live notifications for report assignments

---

## 📊 Current Features (MVP Complete)

✅ User authentication (Register/Login)  
✅ **Password Reset System** - Request, manage, and reset passwords  
✅ **Role-based access control** (Citizen, Worker, Admin, Superadmin)  
✅ Report creation with location and images  
✅ Interactive map view with markers (Kenya-focused)  
✅ Report filtering and status management  
✅ **Municipal Admin Dashboard** with analytics  
✅ **Super Admin Portal** for system management  
✅ **User Management UI** - Full CRUD operations:
   - Create new users with role selection
   - Edit user details and roles
   - Assign users to cleanup teams
   - Delete users
   - All managed through Admin Portals  
✅ Route optimization algorithm  
✅ Team assignment system  
✅ Real-time updates via WebSocket  
✅ Responsive mobile-friendly design  

---

## 🐛 Troubleshooting

### Backend Issues

**Server won't start:**
- ✅ Check that MongoDB connection string is correct
- ✅ Verify all environment variables are set
- ✅ Ensure PORT 5000 is not in use
- ✅ Check for syntax errors in `package.json`

**Dependencies not installing:**
- ✅ Delete `node_modules` and `package-lock.json`
- ✅ Run `npm install` again
- ✅ Check Node.js version (v16+ required)

### Frontend Issues

**Frontend won't connect to backend:**
- ✅ Ensure backend is running on port 5000
- ✅ Check CORS settings in backend/server.js
- ✅ Verify `VITE_API_URL` in frontend `.env`
- ✅ Check browser console for errors

**Build errors:**
- ✅ Clear `node_modules` and reinstall
- ✅ Check for missing dependencies
- ✅ Verify all imports are correct

### Authentication Issues

**Cannot login:**
- ✅ Verify user exists in database
- ✅ Check password is correct
- ✅ Ensure JWT_SECRET is set in backend `.env`
- ✅ Check backend logs for errors

**Role not working:**
- ✅ Verify user role in database
- ✅ Logout and login again after role changes
- ✅ Check browser console for errors
- ✅ Verify middleware is correctly configured

### Image Upload Issues

**Images not uploading:**
- ✅ Verify Cloudinary credentials
- ✅ Check file size limits (5MB max)
- ✅ Ensure `CLOUDINARY_URL` or individual Cloudinary env vars are set correctly
- ✅ Check network tab for upload errors

### Admin Dashboard Issues

**Cannot access Dashboard:**
- ✅ Ensure user role is set to "admin" or "superadmin" in MongoDB
- ✅ Logout and login again after role changes
- ✅ Check browser console for authentication errors
- ✅ Verify route protection is working

**User Management not working:**
- ✅ Verify you're logged in as admin or superadmin
- ✅ Check that backend API endpoints are accessible
- ✅ Ensure MongoDB connection is active
- ✅ Check browser console for API errors

**Cannot create admin users:**
- ✅ Only superadmin can create admin users
- ✅ Verify you're logged in as superadmin
- ✅ Check backend logs for permission errors

### Password Reset Issues

**Password reset request not showing:**
- ✅ Verify you're logged in as superadmin
- ✅ Check that the user's email exists in the database
- ✅ Ensure the password reset request was successfully submitted
- ✅ Check the "Password Resets" tab in Super Admin Portal

**Cannot reset password:**
- ✅ Verify you're logged in as superadmin
- ✅ Ensure the new password is at least 6 characters long
- ✅ Check backend logs for errors
- ✅ Verify the user ID is correct

**Password change modal not appearing:**
- ✅ Verify the user's `mustChangePassword` flag is set to `true` in database
- ✅ Logout and login again after password reset
- ✅ Check browser console for errors
- ✅ Ensure the user is using the temporary password provided by superadmin

**Cannot change password after reset:**
- ✅ Verify you're using the correct temporary password as "old password"
- ✅ Ensure new password is at least 6 characters long
- ✅ Check that new password is different from the temporary password
- ✅ Verify both password fields match
- ✅ Check backend logs for authentication errors

---

## 📚 Additional Resources

- 💻 Check individual component files for code documentation
- 📝 API documentation available in code comments
- 🗺️ Map configuration: Kenya (Nairobi coordinates)


---


## Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for mapping library
- Cloudinary for image hosting
- MongoDB Atlas for cloud database
- React and Vite communities

---

## 📝 Changelog

### Version 2.1.0
- ✅ Added Password Reset System
  - Users can request password reset from login screen
  - Superadmin can view and manage password reset requests
  - Secure password reset workflow with forced password change
  - Password change modal for users after reset

### Version 2.0.0
- ✅ Added Superadmin role and portal
- ✅ Enhanced role-based access control
- ✅ Updated map to Kenya location
- ✅ Improved UI with modern design
- ✅ Enhanced user management system
- ✅ Team management system
- ✅ Route optimization feature
- ✅ Worker assignment to reports

### Version 1.0.0
- ✅ Initial release
- ✅ Basic reporting system
- ✅ Admin dashboard
- ✅ Real-time updates
