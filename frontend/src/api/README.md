# API Service Documentation

## Overview

This directory contains API service files that handle communication with the backend. All API services use the `BACKEND_URL` from the config file for consistent URL management.

## Configuration

### BACKEND_URL
The `BACKEND_URL` is imported from `../config` and provides a centralized way to manage the backend API endpoint:

```typescript
import BACKEND_URL from '../config';

// Usage
const API_BASE = `${BACKEND_URL}/sub-app/auth`;
```

### Environment Variables
The `BACKEND_URL` is configured via environment variables:
- `VITE_BACKEND_URL` - Custom backend URL (optional)
- Default: `/api` (uses Vite proxy in development)

## API Services

### 1. Sub-App Authentication (`subAppAuth.ts`)
Handles authentication for sub-applications using the existing user database.

**Endpoints:**
- `POST /sub-app/auth/login` - User login
- `GET /sub-app/auth/verify-token` - Token verification
- `GET /sub-app/auth/profile` - User profile

**Usage:**
```typescript
import { login, verifyToken, getProfile } from '@/api/subAppAuth';

// Login
const result = await login({
  identifier: 'username_or_email',
  password: 'password',
  appId: 'sub-app-id'
});

// Verify token
const verification = await verifyToken(token);

// Get profile
const profile = await getProfile(token);
```

### 2. App Creation (`appCreation.ts`)
Handles application creation and management.

**Endpoints:**
- `POST /apps` - Create new app
- `GET /apps` - Get generated apps
- `GET /health` - Health check

### 3. Meter Connection (`meterConnection.ts`)
Handles meter-related API calls.

## Helper Functions

### Authentication Helpers
```typescript
import { 
  getStoredToken, 
  getStoredUser, 
  clearAuthData, 
  isAuthenticated, 
  logout 
} from '@/api/subAppAuth';

// Get stored authentication data
const token = getStoredToken();
const user = getStoredUser();

// Check authentication status
const isLoggedIn = isAuthenticated();

// Clear authentication data
clearAuthData();

// Logout and redirect
logout();
```

## Error Handling

All API services include proper error handling:

```typescript
try {
  const result = await login(credentials);
  if (result.success) {
    // Handle success
  } else {
    // Handle API error
    console.error(result.message);
  }
} catch (error) {
  // Handle network/connection error
  console.error('Network error:', error);
}
```

## Testing

Use the `TestSubAppAuth` component to test API functionality:

```typescript
import TestSubAppAuth from '@components/TestSubAppAuth';

// In your component
<TestSubAppAuth />
```

## Development vs Production

### Development
- Uses Vite proxy (`/api` → `http://localhost:3001`)
- `BACKEND_URL` defaults to `/api`

### Production
- Direct API calls to configured backend URL
- `VITE_BACKEND_URL` environment variable sets the backend URL

## Best Practices

1. **Always use BACKEND_URL** - Don't hardcode API URLs
2. **Handle errors properly** - Use try-catch blocks
3. **Type your responses** - Use TypeScript interfaces
4. **Test API calls** - Use the test component
5. **Clear auth data** - Use helper functions for logout

## Example Usage

```typescript
import { login } from '@/api/subAppAuth';

const handleLogin = async (credentials) => {
  try {
    const result = await login({
      identifier: credentials.username,
      password: credentials.password,
      appId: window.location.hostname
    });

    if (result.success && result.data) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      // Redirect or update UI
    } else {
      // Show error message
      setError(result.message);
    }
  } catch (error) {
    setError('Network error. Please try again.');
  }
};
``` 