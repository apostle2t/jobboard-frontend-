# Profile API Integration Guide

## Overview
This document describes the integration between the frontend profile management system and the Spring Boot backend API.

## Files Created/Modified

### 1. `src/lib/user-api.ts` (NEW)
API utility functions for user profile management.

**Exports:**
- `UserProfile` interface - matches backend UserDTO
- `UpdateUserData` interface - matches backend UpdateUser DTO
- `getCurrentUser()` - GET /api/users/me
- `getUserById(id)` - GET /api/users/{id}
- `updateUser(id, data)` - PUT /api/users/{id}
- `uploadProfilePicture(userId, file)` - POST /api/users/{id}/profile-picture
- `deleteProfilePicture(userId)` - DELETE /api/users/{id}/profile-picture
- `deleteUser(userId)` - DELETE /api/users/{id}

**Key Features:**
- Uses `apiFetch` from `@/src/lib/auth` for automatic JWT token injection
- Proper error handling with descriptive error messages
- FormData handling for profile picture uploads
- TypeScript interfaces matching backend DTOs

### 2. `app/profile/page.tsx` (MODIFIED)
Updated profile page to fetch and display real user data from the backend.

**Changes:**
- Added `useEffect` to load user profile on component mount
- Replaced mock data with API calls to `getCurrentUser()`
- Added loading state with spinner
- Added error state with retry button
- Implemented `handleSaveProfile` to call `updateUser()` API
- Created mapping functions:
  - `mapUserProfileToUser()` - converts backend UserProfile to frontend User format
  - `mapUserToUpdateData()` - converts frontend User to backend UpdateUserData format

**Data Mapping:**
```typescript
Backend → Frontend:
- firstName, lastName → name (concatenated)
- workTitle → title
- description → bio
- yearsOfExperience → experience (with "years" suffix)
- skills (comma-separated string) → skills (array of objects)
- expectedSalary → preferences.salaryRange.max
- jobType → preferences.jobType (array)
- profilePictureUrl → avatar
- linkedInProfile, githubProfile, portfolio → socialLinks

Frontend → Backend:
- name (split) → firstName, lastName
- title → workTitle
- bio → description
- experience (parsed) → yearsOfExperience
- skills (array joined) → skills (comma-separated)
- preferences.salaryRange.max → expectedSalary
- preferences.jobType → jobType (uppercase with underscores)
- socialLinks → linkedInProfile, githubProfile, portfolio
```

### 3. `components/edit-profile-modal.tsx` (MODIFIED)
Updated to handle async API calls properly.

**Changes:**
- Modified `handleSave` to await the async `onSave` callback
- Added try-catch error handling
- Display general errors at the top of the modal
- Proper loading states during save operations

## Backend Endpoints Used

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/api/users/me` | GET | Get current authenticated user | None | UserDTO |
| `/api/users/{id}` | GET | Get user by ID | None | UserDTO |
| `/api/users/{id}` | PUT | Update user profile | UpdateUser | UserDTO |
| `/api/users/{id}/profile-picture` | POST | Upload profile picture | multipart/form-data | { url, message } |
| `/api/users/{id}/profile-picture` | DELETE | Delete profile picture | None | { message } |
| `/api/users/{id}` | DELETE | Delete user account | None | None |

## Backend DTOs

### UserDTO (Response)
```java
{
  id: number
  email: string
  firstName: string
  lastName: string
  workTitle?: string
  description?: string
  yearsOfExperience?: number
  skills?: string  // comma-separated
  location?: string
  expectedSalary?: number
  jobStatus?: string  // ACTIVE, OPEN_TO_REMOTE, REMOTE_ONLY, etc.
  linkedInProfile?: string
  githubProfile?: string
  portfolio?: string
  profilePictureUrl?: string
  jobType?: string  // FULL_TIME, PART_TIME, CONTRACT, FREELANCE
}
```

### UpdateUser (Request)
```java
{
  firstName?: string
  lastName?: string
  email?: string
  workTitle?: string
  description?: string
  yearsOfExperience?: number
  skills?: string  // comma-separated
  location?: string
  expectedSalary?: number
  jobStatus?: string
  linkedInProfile?: string
  githubProfile?: string
  portfolio?: string
  jobType?: string
}
```

## Authentication

All API requests automatically include the JWT token from localStorage via the `apiFetch` utility function:
- Token is stored in localStorage with key `"auth_token"`
- `Authorization: Bearer <token>` header is added automatically
- 401 responses trigger automatic redirect to login page

## Usage Example

```typescript
import { getCurrentUser, updateUser } from "@/src/lib/user-api"

// Fetch current user profile
const profile = await getCurrentUser()

// Update user profile
const updatedProfile = await updateUser(profile.id, {
  firstName: "John",
  lastName: "Doe",
  workTitle: "Senior Developer",
  skills: "React, TypeScript, Node.js",
  expectedSalary: 150000,
})

// Upload profile picture
const file = event.target.files[0]
const result = await uploadProfilePicture(profile.id, file)
console.log(result.url) // S3 URL of uploaded image
```

## Error Handling

All API functions throw errors on failure:
```typescript
try {
  const profile = await getCurrentUser()
} catch (error) {
  console.error("Failed to load profile:", error)
  // Display error message to user
}
```

## Next Steps

### Profile Picture Upload
To implement profile picture upload functionality:

1. Add file input to the profile page or edit modal
2. Call `uploadProfilePicture(userId, file)` when user selects an image
3. Update the user state with the new profile picture URL
4. Display success/error messages

Example:
```typescript
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file && user) {
    try {
      const result = await uploadProfilePicture(parseInt(user.id), file)
      // Refresh user data to get new profile picture URL
      await loadUserProfile()
      alert("Profile picture updated successfully!")
    } catch (error) {
      alert("Failed to upload profile picture")
    }
  }
}
```

### Missing Backend Fields
Some frontend fields don't have corresponding backend fields yet:
- `phone` - Consider adding to backend UserDTO
- `company` - Consider adding to backend UserDTO  
- `joinDate` - Consider adding createdAt timestamp in backend
- `willingToRelocate` - Consider adding to backend UserDTO

## Testing

1. Start your Spring Boot backend (should be running on port 8080)
2. Login to the application
3. Navigate to the profile page
4. Verify your profile data loads correctly
5. Click "Edit Profile" and make changes
6. Click "Save Changes"
7. Verify the changes are saved and reflected in the UI
8. Check backend logs to confirm API calls are working

## Troubleshooting

**Profile not loading:**
- Check if JWT token exists in localStorage
- Verify backend is running on port 8080
- Check browser console for errors
- Verify `/api/users/me` endpoint returns user data

**Update failing:**
- Check network tab for error responses
- Verify data format matches backend expectations
- Check backend logs for validation errors
- Ensure JWT token is valid

**Profile picture upload not working:**
- Verify file size is within backend limits
- Check AWS S3 configuration in backend
- Ensure multipart/form-data is properly sent
- Check backend logs for S3 errors
