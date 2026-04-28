# Content Broadcasting System

A production-ready Node.js backend for managing and broadcasting scheduled educational content. This system supports multi-role access (Teacher/Principal), secure file uploads, and a dynamic content rotation algorithm.

## 🚀 Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens) & BCrypt
- **Storage**: Local Storage & Cloudinary Integration
- **Validation**: Express-Validator
- **Security**: Helmet, CORS, and centralized Error Handling

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- PostgreSQL database

### 2. Installation
```bash
git clone https://github.com/Dharmndr/Content-Broadcasting-System.git
cd content-broadcasting-system
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and fill in your credentials:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=content_broadcasting
DB_USER=postgres
DB_PASS=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Running the App
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📡 API Usage

### Authentication
- `POST /api/v1/auth/register`: Create a new account (`teacher` or `principal`).
- `POST /api/v1/auth/login`: Authenticate and receive a JWT.

### Content Management (Teacher)
- `POST /api/v1/content/upload`: Upload file with metadata (Form-Data).
- `GET /api/v1/content/my-uploads`: View your own content status.

### Approval System (Principal)
- `GET /api/v1/content/pending`: View all pending submissions.
- `POST /api/v1/content/:id/approve`: Approve content for broadcast.
- `POST /api/v1/content/:id/reject`: Reject content with a mandatory reason.

### Scheduling & Broadcasting
- `POST /api/v1/schedule/:contentId`: (Principal) Schedule content rotation and time window.
- `GET /api/v1/schedule/active`: (Public) Get the currently live global content.
- `GET /api/v1/content/live/:teacherId`: (Public) Get the currently live content for a specific teacher.

## API Documentation

### Postman Docs:
https://documenter.getpostman.com/view/39086219/2sBXqJJLBH

## 📝 Assumptions & Decisions
- **Cloudinary vs Amazon S3**: I have chosen to use **Cloudinary** for cloud storage instead of AWS S3 to avoid complex billing setups and credit card requirements. Cloudinary provides an excellent free tier for development.
- **Local Storage Fallback**: To ensure reliability, all files are stored locally in the `/uploads` folder first. If the Cloudinary upload fails, the system automatically falls back to serving the local file.
- **Continuous Rotation**: The scheduling algorithm assumes that content should loop continuously within its valid time window based on the total duration of all active items.
- **Security**: Sensitive fields like `password_hash` are hidden by default at the database model level to prevent accidental exposure.

## 📂 Project Structure
- `src/controllers`: Request handlers.
- `src/services`: Business logic and rotation algorithm.
- `src/models`: Database schemas.
- `src/middlewares`: Auth, Role-check, and Validation.
- `src/routes`: API endpoint definitions.
- `uploads/`: Local file storage.
