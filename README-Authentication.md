# AdminModule Authentication System

This document describes the authentication system implemented for the AdminModule Dashboard.

## Overview

The authentication system provides secure login/logout functionality with JWT token-based authentication. It includes user management, role-based access control, and protected routes.

## Features

- **User Authentication**: Login/logout with JWT tokens
- **User Registration**: New user registration with validation
- **Role-Based Access**: Support for different user roles (admin, user)
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token Persistence**: Automatic token storage and validation
- **User Profile Management**: View and update user information

## Default Admin User

A default admin user is automatically created when the backend starts:

- **Username**: `admin`
- **Email**: `admin@adminmodule.com`
- **Password**: `admin123`
- **Role**: `admin`

💡 **Login Options**: You can login using either the username (`admin`) or email (`admin@adminmodule.com`)

⚠️ **Important**: Please change the default password after first login for security.

## Backend API Endpoints

### Authentication Routes (`/api/auth/`)

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `GET /api/auth/verify-token` - Verify JWT token (protected)
- `GET /api/auth/users` - Get all users (admin only)

### Request/Response Examples

#### Login Request
```json
POST /api/auth/login
{
    "identifier": "admin",
    "password": "admin123"
}
```

**Note**: The `identifier` field accepts either username or email address.

#### Login Response
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "username": "admin",
            "email": "admin@adminmodule.com",
            "role": "admin"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

## Frontend Authentication

### Authentication Context

The `AuthContext` provides:
- `user` - Current user information
- `token` - JWT token
- `isAuthenticated` - Authentication status
- `isLoading` - Loading state
- `login(email, password)` - Login function
- `register(username, email, password)` - Registration function
- `logout()` - Logout function

### Protected Routes

All main application routes are protected and require authentication:
- Dashboard and all module pages
- Profile and settings pages
- Administrative pages

### Login Page

The login page (`/login`) includes:
- Email/password login form
- Registration form toggle
- Form validation
- Error handling
- Automatic redirect after successful login

## File Structure

### Backend Files
```
backend/
├── models/User.js              # User model and database operations
├── controllers/authController.js # Authentication logic
├── middleware/auth.js          # JWT middleware
├── routes/auth.js             # Authentication routes
├── utils/seedAdmin.js         # Default admin user creation
└── data/users.json            # User data storage (JSON file)
```

### Frontend Files
```
frontend/src/
├── context/AuthContext.tsx    # Authentication context
├── components/auth/ProtectedRoute.tsx # Protected route wrapper
├── pages/Login.tsx            # Login page
└── components/global/Header.tsx # Header with user menu
```

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: 24-hour token expiration
- **Role-Based Access**: Admin-only endpoints
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request protection

## Getting Started

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the Frontend Development Server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

4. **Login with Default Admin**:
   - Username: `admin` (or Email: `admin@adminmodule.com`)
   - Password: `admin123`

## Environment Variables

Create a `.env` file in the backend directory:
```
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
```

## User Data Storage

Currently, user data is stored in a JSON file (`backend/data/users.json`). For production deployment, consider migrating to a proper database like PostgreSQL, MongoDB, or MySQL.

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Email verification for registration
- Password reset functionality
- Multi-factor authentication (MFA)
- Session management
- Audit logging
- OAuth integration (Google, GitHub, etc.)

## Security Considerations

1. **Change Default Credentials**: Always change the default admin password
2. **Use Strong JWT Secret**: Use a strong, random JWT secret in production
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for authentication endpoints
5. **Input Sanitization**: Validate and sanitize all user inputs

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if the JWT token is valid and not expired
2. **CORS Errors**: Ensure backend CORS is configured correctly
3. **Login Fails**: Verify email and password are correct
4. **Token Persistence**: Check if localStorage is working correctly

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in the backend environment. 