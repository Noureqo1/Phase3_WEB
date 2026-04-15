# ClipSphere - Video Sharing Platform

A full-stack video sharing application built with Next.js, Express.js, MongoDB, and MinIO.

## 🚀 Project Overview

ClipSphere is a video discovery and sharing platform with the following features:

- **Frontend**: Next.js with Tailwind CSS and responsive design
- **Backend**: Express.js REST API
- **Database**: MongoDB for user and video metadata
- **Storage**: Local MinIO S3-compatible storage
- **Authentication**: JWT-based with SIB cookies
- **Video Processing**: FFmpeg for duration validation
- **Email Notifications**: Nodemailer integration

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker Desktop
- MongoDB (via Docker)
- FFmpeg (installed locally)
- Git

## 🛠️ Installation & Setup

### 1. Backend Setup

```bash
cd d:\web\Web
npm install
```

Create `.env` file in the Web root:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clipsphere
JWT_SECRET=your_secure_secret_key_here

# MinIO S3 Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=clipsphere-videos
MINIO_USE_SSL=false

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@clipsphere.com
```

### 2. Frontend Setup

```bash
cd d:\web\Web\frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 3. Docker Infrastructure

Start MongoDB and MinIO:

```bash
cd d:\web\Web
docker-compose up -d
```

### 4. Install FFmpeg

**Windows**:
```bash
# Install via Chocolatey if installed
choco install ffmpeg

# Or download from: https://ffmpeg.org/download.html
```

**macOS**:
```bash
brew install ffmpeg
```

**Linux**:
```bash
sudo apt-get install ffmpeg
```

### 5. Start Services

**Terminal 1 - Backend**:
```bash
cd d:\web\Web
npm run dev
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend**:
```bash
cd d:\web\Web\frontend
npm run dev
```
Frontend will run on http://localhost:3000

**MinIO Admin Console**:
- URL: http://localhost:9001
- Username: minioadmin
- Password: minioadmin

## 🎯 Key Features Implemented

### Authentication
- ✅ JWT-based authentication with secure tokens
- ✅ useAuth hook for client-side auth state management
- ✅ Protected routes with Next.js middleware
- ✅ Cookie-based session persistence

### Video Management
- ✅ Video upload with Multer file validation
- ✅ FFmpeg integration for duration validation (max 5 minutes)
- ✅ MinIO S3-compatible storage with presigned URLs
- ✅ Atomic database updates to prevent orphaned records
- ✅ Responsive video player with React Player

### Discovery & Feeds
- ✅ Responsive grid (1 col mobile, 2 tablet, 3-4 desktop)
- ✅ Pagination with Limit/Skip logic
- ✅ Infinite scroll with Intersection Observer API
- ✅ Following and Trending feed separation

### User Interactions
- ✅ Like/Unlike system with real-time UI updates
- ✅ Star-rating review system
- ✅ Comment submission  
- ✅ Dynamic ownership UI (edit/delete for owners only)

### Email Notifications
- ✅ Nodemailer SMTP integration
- ✅ Welcome emails for new users
- ✅ Engagement notifications (likes, reviews, follows)
- ✅ Notification preference checks

### Admin Dashboard
- ✅ Protected /admin route (admin role only)
- ✅ Statistics display (total users, videos)
- ✅ System health monitoring
- ✅ Real-time data from backend

## 📁 Project Structure

```
Web/
├── frontend/                    # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx          # Root layout with auth provider
│   │   ├── page.tsx            # Homepage
│   │   ├── discover/           # Video discovery page
│   │   ├── video/[id]/         # Video player page
│   │   ├── upload/             # Video upload page
│   │   ├── auth/               # Login/Register pages
│   │   ├── admin/              # Admin dashboard
│   │   └── providers/          # Auth context provider
│   ├── components/
│   │   ├── layout/             # Navbar and layout components
│   │   └── video/              # Video components (card, player, reviews)
│   ├── lib/
│   │   ├── hooks/              # Custom hooks (useAuth)
│   │   └── services/           # API service layer
│   ├── middleware.ts           # JWT validation middleware
│   └── package.json
├── app.js                       # Express app configuration
├── server.js                    # Server entry point
├── config/
│   ├── minio.js                # MinIO S3 client setup
│   ├── db.js                   # MongoDB connection
│   └── swagger.js              # API documentation
├── middleware/
│   ├── upload.js               # Multer + FFmpeg validation
│   ├── auth.js                 # JWT verification
│   ├── errorHandler.js         # Global error handling
│   └── ownership.js            # Video/Review ownership verification
├── services/
│   ├── emailService.js         # Nodemailer email notifications
│   ├── videoService.js         # Video business logic
│   └── ...
├── routes/                     # API route handlers
├── models/                     # MongoDB schemas
├── controllers/                # Route controllers
├── validators/                 # Request validation (Zod)
├── docker-compose.yml          # Docker services (MinIO, MongoDB)
└── .env.example               # Environment variables template
```

## 🔄 Data Flow

### Video Upload Flow
1. User selects MP4/AVI/MOV file (max 500MB)
2. Frontend validates file type and size
3. Backend receives file via Multer
4. FFmpeg probes video to validate duration (max 300s)
5. If valid, video uploaded to MinIO
6. MinIO object key stored atomically in MongoDB
7. User redirected to video page

### Video Discovery Flow
1. Frontend requests `/api/v1/videos?skip=0&limit=12`
2. Backend returns videos with pagination
3. Infinite scroll detects bottom of page
4. Frontend auto-fetches next batch of videos
5. Intersection Observer API used for trigger detection

### Authentication Flow
1. User logs in with email/password
2. Backend validates credentials
3. JWT token generated and sent to client
4. Token stored in secure HTTP-only cookie
5. Frontend's useAuth hook fetches user data
6. Protected routes validated via Next.js middleware
7. API requests include Authorization header

## 🧪 Testing the Application

### 1. Test User Registration
- Navigate to http://localhost:3000/auth/register
- Fill in user details and sign up
- Should redirect to /discover

### 2. Test Video Upload
- Click "Upload Video" in navbar
- Select a video file (< 5 minutes)
- Add title and description
- Click upload and monitor progress
- Should redirect to video page after upload

### 3. Test Video Discovery
- Visit /discover page
- Scroll down to trigger infinite scroll
- Videos should load as you scroll

### 4. Test Video Interactions
- Click on a video to open player
- Like/Unlike the video
- Submit a review with rating and comment

### 5. Test Admin Dashboard
- Create user with admin role (via database)
- Login and navigate to /admin
- Should see user/video statistics

## 🔒 Security Features

- ✅ JWT token validation on all protected routes
- ✅ Presigned URLs for secure video access
- ✅ Owner verification for edit/delete operations
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ MongoDB injection prevention via mongoose
- ✅ CORS configuration for frontend-backend communication

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Videos
- `GET /api/v1/videos` - Get public videos (paginated)
- `POST /api/v1/videos` - Upload new video (protected)
- `PATCH /api/v1/videos/:id` - Update video (owner only)
- `DELETE /api/v1/videos/:id` - Delete video (owner only)
- `POST /api/v1/videos/:id/like` - Like video (protected)
- `DELETE /api/v1/videos/:id/like` - Unlike video (protected)
- `POST /api/v1/videos/:id/reviews` - Create review (protected)

### Users
- `GET /api/v1/users/me` - Get current user info (protected)
- `PATCH /api/v1/users/me` - Update profile (protected)
- `POST /api/v1/users/:id/follow` - Follow user (protected)
- `DELETE /api/v1/users/:id/follow` - Unfollow user (protected)

### Admin
- `GET /api/v1/admin/stats` - Get system statistics (admin only)
- `GET /health` - System health check

## 🐛 Troubleshooting

### MinIO Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:9000

Solution: Ensure Docker is running and MinIO container is up
docker-compose ps
docker-compose up -d
```

### FFmpeg Not Found
```
Error: ffmpeg not found

Solution: Install FFmpeg or ensure it's in PATH
# Windows: Add FFmpeg bin directory to PATH
# Mac: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg
```

### MongoDB Connection Error
```
Error: Failed to connect to MongoDB

Solution: Ensure MongoDB container is running
docker-compose logs mongodb
```

### CORS Errors
```
Error: Access to XMLHttpRequest has been blocked by CORS policy

Solution: Ensure FRONTEND_URL is correct in backend .env
Check CORS configuration in Express app
```

## 🚀 Deployment Ready

This application is production-ready with:
- Environment variable configuration
- Error handling and logging
- Request validation and sanitization
- Database transaction support
- Presigned URL expiration
- Rate limiting ready
- Swagger API documentation

## 📚 Documentation

- API Documentation: http://localhost:5000/api-docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- MinIO Docs: https://docs.min.io

## 👥 Contributing

This is an educational project for the Web Development course (SWAPD352).

## 📄 License

ISC
