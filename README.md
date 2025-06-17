# 🎥 Video Streaming Platform Backend

A comprehensive **Node.js/Express.js** backend API for a YouTube-like video streaming platform featuring user authentication, video management, file uploads, and subscription functionality.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with access and refresh tokens
- **Bcrypt Password Hashing** for secure password storage
- **Protected Routes** with custom middleware
- **Cookie-based Token Storage** for enhanced security

### 👥 User Management  
- User registration with profile image uploads
- Login/logout functionality
- Profile management (avatar, cover image, account details)
- Password change capability
- User channel profiles
- Watch history tracking

### 🎬 Video System
- Video metadata management (title, description, duration, views)
- **Cloudinary Integration** for video and image storage
- Thumbnail support
- Publishing controls
- Owner-video relationships

### 📺 Subscription System
- User-to-channel subscription functionality
- Many-to-many relationships between users

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Password Security**: Bcrypt
- **Development**: Nodemon

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Cloudinary Account** for media storage

## ⚡ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Shubham2003-jha/Backend_project.git
cd Backend_project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=8000
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the server
```bash
# Development mode
npm run dev

# The server will start on http://localhost:8000
```

## 📁 Project Structure

```
src/
├── controllers/        # Business logic handlers
│   └── user.controller.js
├── middlewares/        # Custom middleware functions
│   ├── auth.middleware.js
│   └── multer.middleware.js
├── models/            # MongoDB schemas
│   ├── user.models.js
│   ├── video.models.js
│   └── subscription.models.js
├── routes/            # API route definitions
│   └── user.routes.js
├── utils/             # Utility functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
├── db/                # Database configuration
│   └── index.js
├── app.js             # Express app setup
├── index.js           # Main entry point
└── constants.js       # Application constants
```

## 🌐 API Endpoints

### Base URL: `http://localhost:8000`

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register new user with avatar/cover | ❌ |
| POST | `/users/login` | User login | ❌ |
| POST | `/users/logout` | User logout | ✅ |
| POST | `/users/refresh-token` | Refresh access token | ❌ |

### User Management Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/current-user` | Get current user info | ✅ |
| POST | `/users/change-password` | Change user password | ✅ |
| PATCH | `/users/update-account` | Update account details | ✅ |
| PATCH | `/users/avatar` | Update user avatar | ✅ |
| PATCH | `/users/cover-image` | Update cover image | ✅ |
| GET | `/users/watch-history` | Get user watch history | ✅ |
| GET | `/users/c/:username` | Get user channel profile | ✅ |

## 📝 Usage Examples

### User Registration
```javascript
// POST /users/register
// Form Data with files
{
  "userName": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "securepassword123",
  "avatar": [file],
  "coverImage": [file] // optional
}
```

### User Login
```javascript
// POST /users/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response
{
  "statusCode": 200,
  "data": {
    "user": {...},
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "message": "User logged in successfully"
}
```

### Update User Avatar
```javascript
// PATCH /users/avatar
// Form Data
{
  "avatar": [new_avatar_file]
}
// Headers: Authorization: Bearer <access_token>
```

## 🔧 Key Features Implementation

### JWT Authentication
- **Access tokens** for API authentication (short-lived)
- **Refresh tokens** for token renewal (long-lived)
- Automatic token verification middleware

### File Upload System
- **Multer** for handling multipart/form-data
- **Cloudinary** integration for cloud storage
- Automatic file cleanup after upload

### Database Relationships
- User-Video relationship (one-to-many)
- User-Subscription relationship (many-to-many)
- Proper indexing for optimized queries

## 🚦 Error Handling

The API uses custom error handling with structured responses:

```javascript
// Success Response
{
  "statusCode": 200,
  "data": {...},
  "message": "Success message"
}

// Error Response
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

## 🧪 Testing

You can test the API endpoints using tools like:
- **Postman**
- **Thunder Client** (VS Code extension)
- **cURL**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Shubham**
- GitHub: [@Shubham2003-jha](https://github.com/Shubham2003-jha)

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the excellent database
- Cloudinary for media storage solutions
- All the open-source contributors who made this project possible

---

⭐ **Star this repository if you found it helpful!** 
