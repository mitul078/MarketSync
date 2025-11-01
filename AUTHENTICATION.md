# Authentication System Documentation

## Overview

MarketSync now includes a complete user authentication system with JWT token-based security. All trades are user-specific and protected.

## Backend Implementation

### User Model (`server/models/User.js`)

Stores user credentials and profile:
- `name` - Full name (required, 2-50 chars)
- `username` - Unique username (required, 3-30 chars, alphanumeric + underscores)
- `email` - Unique email (required, validated)
- `password` - Hashed password (required, min 6 chars, not returned in queries)

**Features:**
- Automatic password hashing with bcrypt before save
- Password comparison method
- Email and username uniqueness
- Input validation

### Authentication Middleware (`server/middleware/auth.js`)

Protects routes by:
1. Extracting JWT token from Authorization header
2. Verifying token signature and expiration
3. Fetching user from database
4. Attaching user to request object

**Usage:**
```javascript
const auth = require('../middleware/auth');

router.use(auth); // Protect all routes
// or
router.get('/protected', auth, handler); // Protect specific route
```

### Input Validators (`server/middleware/validators.js`)

Validates user input using express-validator:
- **Signup**: name, username, email, password validation
- **Login**: email, password validation
- Sanitizes and normalizes input
- Returns detailed error messages

### Authentication Controller (`server/controllers/authController.js`)

**Signup:**
- Validates input
- Checks for existing users
- Creates new user with hashed password
- Returns JWT token and user data

**Login:**
- Validates credentials
- Compares password with hash
- Returns JWT token and user data

**Get Me:**
- Returns current user data (protected route)

### Authentication Routes (`server/routes/authRoutes.js`)

- `POST /api/auth/signup` - Public, user registration
- `POST /api/auth/login` - Public, user login
- `GET /api/auth/me` - Protected, get current user

### Protected Trade Routes

All trade routes now require authentication:
- User-specific trade filtering
- Automatic user ID injection on creation
- User ownership verification on updates/deletes

## Frontend Implementation

### Auth Context (`client/src/context/AuthContext.js`)

Global authentication state management:

**State:**
- `user` - Current user object
- `token` - JWT token
- `loading` - Initial auth check
- `isAuthenticated` - Boolean flag

**Methods:**
- `login(credentials)` - Authenticate user
- `signup(userData)` - Register new user
- `logout()` - Clear session
- `useAuth()` - Hook to access auth state

**Features:**
- Persistent session via localStorage
- Automatic token attachment to axios requests
- Protected route handling

### Login Component (`client/src/components/Login.js`)

Login form with:
- Email and password fields
- Form validation
- Error handling
- Loading states
- Link to signup

### Signup Component (`client/src/components/Signup.js`)

Registration form with:
- Name, username, email, password fields
- Client-side validation
- Error handling
- Loading states
- Link to login

### App Component Updates (`client/src/App.js`)

**Changes:**
- Wrapped in AuthProvider
- Shows Login/Signup if not authenticated
- Protected routes for dashboard and trade entry
- User info in header
- Logout functionality

**User Experience:**
1. Unauthenticated users see login/signup pages
2. After authentication, access to full app
3. Logout clears session and redirects
4. Auto-logout on token expiration/invalid

## Security Features

### Password Security
- Bcrypt hashing with 12 salt rounds
- Never returned in API responses
- Minimum 6 characters required

### Token Security
- JWT with 7-day expiration
- HTTP-only (stored in localStorage)
- Verified on every protected request
- Invalid tokens trigger logout

### Input Validation
- Server-side validation for all inputs
- Email format verification
- Username pattern matching
- SQL injection prevention via Mongoose
- XSS protection through validation

### User Isolation
- Each user only sees their own trades
- Database filtering by user ID
- Ownership verification on mutations
- Cross-user data access prevented

## Environment Variables

Add to `server/.env`:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** Use a strong, random secret in production!

## API Usage Examples

### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Protected Request
```bash
GET /api/trades
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Frontend Flow

1. **Unauthenticated State**
   - Shows login/signup forms
   - No access to trades

2. **Authentication**
   - User enters credentials
   - Token saved to localStorage
   - User redirected to dashboard
   - Token attached to all requests

3. **Authenticated State**
   - Full app access
   - User trades displayed
   - Header shows username

4. **Logout**
   - Clear localStorage
   - Remove auth headers
   - Redirect to login

5. **Token Expiration**
   - Auto-logout on 401 responses
   - Prompt to login again

## Testing Authentication

### Manual Testing

1. **Signup:**
   - Create new account
   - Verify user created
   - Token received

2. **Login:**
   - Enter credentials
   - Verify token received
   - Access protected routes

3. **Protected Routes:**
   - Try accessing `/api/trades` without token → 401
   - Add token to header → success
   - Try accessing other user's trades → empty/filtered

4. **Logout:**
   - Click logout button
   - Verify redirect to login
   - Try accessing trades → redirect to login

## Error Handling

### Common Errors

**Invalid Credentials:**
- Status: 401
- Message: "Invalid email or password"

**User Already Exists:**
- Status: 400
- Message: "User already exists"
- Field: "email" or "username"

**Validation Errors:**
- Status: 400
- Errors: Array of validation errors

**Missing Token:**
- Status: 401
- Message: "No authentication token, access denied"

**Invalid Token:**
- Status: 401
- Message: "Invalid token"

**Expired Token:**
- Status: 401
- Message: "Token expired"

## Best Practices

1. **Never store plain text passwords**
2. **Use strong JWT secrets in production**
3. **Implement token refresh for long sessions**
4. **Add rate limiting to auth endpoints**
5. **Log failed authentication attempts**
6. **Use HTTPS in production**
7. **Implement password reset flow**
8. **Add email verification**
9. **Consider two-factor authentication**
10. **Regular security audits**

## Future Enhancements

- [ ] Password reset via email
- [ ] Email verification
- [ ] Remember me functionality
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Rate limiting
- [ ] Session management
- [ ] Token refresh mechanism

---

**Security Note:** This is a production-ready authentication system, but always follow security best practices and keep dependencies updated.







