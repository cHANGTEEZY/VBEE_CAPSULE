# Backend Setup for User Registration

## Overview

After a user successfully signs up with Clerk and verifies their email, the app automatically saves the user information to your backend database.

## Configuration

### 1. Environment Variables

Add your backend API URL to your `.env` file:

```env
EXPO_PUBLIC_BASE_API_URL=https://your-backend-api.com/api
```

### 2. Backend Endpoint

Create a POST endpoint at `/users` that accepts the following payload:

**Endpoint:** `POST /users`

**Headers:**

```
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "clerkUserId": "user_xxxxxxxxxxxxxxxxxxxxx",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe"
}
```

**Expected Response:**

```json
{
  "success": true,
  "userId": "your-database-user-id",
  "message": "User created successfully"
}
```

### 3. Example Backend Implementation (Node.js/Express)

```javascript
// routes/users.js
const express = require("express");
const router = express.Router();
const { clerkAuthMiddleware } = require("../middleware/auth");
const User = require("../models/User");

router.post("/users", clerkAuthMiddleware, async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ clerkUserId });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        userId: existingUser._id,
        message: "User already exists",
      });
    }

    // Create new user
    const newUser = await User.create({
      clerkUserId,
      email,
      firstName,
      lastName,
      fullName,
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      userId: newUser._id,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

module.exports = router;
```

### 4. Database Schema Example (MongoDB/Mongoose)

```javascript
// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("User", userSchema);
```

## Features Implemented

### 1. 6-Digit OTP Input

- Clean, modern UI with individual input boxes for each digit
- Auto-focus next input on entry
- Auto-focus previous input on backspace
- Paste support for quick entry
- Visual feedback for focused and filled states

### 2. User Data Flow

1. User fills sign-up form (name, email, password)
2. Clerk creates user account
3. Email verification code sent to user
4. User enters 6-digit OTP code
5. Upon successful verification:
   - Get Clerk user ID from completed sign-up
   - Get authentication token
   - Save user to your backend with all details
   - Navigate to main app tabs

### 3. Additional Features

- **Resend Code:** Users can request a new verification code
- **Email Display:** Shows the email address where code was sent
- **Loading States:** Proper loading indicators during API calls
- **Error Handling:** Clear error messages for all failure scenarios
- **Back Navigation:** Option to go back and change sign-up details

## Testing

Test the flow:

1. Sign up with a valid email
2. Check that you receive the 6-digit code via email
3. Enter the code in the OTP input
4. Verify that user is saved to your backend
5. Check that user is navigated to the main app

## Troubleshooting

### Token Not Found

- Ensure Clerk is properly configured
- Check that session is set before getting token

### Backend Returns 401

- Verify JWT token middleware is configured correctly
- Check that token is being sent in Authorization header

### User Not Saved

- Check backend logs for errors
- Verify endpoint URL is correct in environment variables
- Ensure request body matches expected schema

## Security Considerations

1. **JWT Validation:** Always validate Clerk JWT tokens on your backend
2. **Idempotency:** Handle duplicate user creation gracefully
3. **Data Validation:** Validate all user input on backend
4. **Rate Limiting:** Implement rate limiting on user creation endpoint
5. **Error Messages:** Don't expose sensitive information in error messages
