import { apiFetch } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  workTitle?: string;
  description?: string;
  yearsOfExperience?: number;
  skills?: string;
  location?: string;
  expectedSalary?: number;
  jobStatus?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  profilePictureUrl?: string;
  jobType?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  workTitle?: string;
  description?: string;
  yearsOfExperience?: number;
  skills?: string;
  location?: string;
  expectedSalary?: number;
  jobStatus?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  jobType?: string;
}

/**
 * Get current authenticated user's profile
 */
export async function getCurrentUser(): Promise<UserProfile> {
  const res = await apiFetch(`${API_BASE_URL}/api/users/me`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch current user: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<UserProfile> {
  const res = await apiFetch(`${API_BASE_URL}/api/users/${id}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Update user profile
 */
export async function updateUser(id: number, userData: UpdateUserData): Promise<UserProfile> {
  const res = await apiFetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to update user: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Upload profile picture
 * Note: apiFetch automatically handles FormData and doesn't set Content-Type
 */
export async function uploadProfilePicture(userId: number, file: File): Promise<{ url: string; message: string }> {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await apiFetch(`${API_BASE_URL}/api/users/${userId}/profile-picture`, {
    method: "POST",
    body: formData,
    // Content-Type will be automatically set by the browser with boundary
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to upload profile picture: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Delete profile picture
 */
export async function deleteProfilePicture(userId: number): Promise<{ message: string }> {
  const res = await apiFetch(`${API_BASE_URL}/api/users/${userId}/profile-picture`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete profile picture: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Delete user account
 */
export async function deleteUser(userId: number): Promise<void> {
  const res = await apiFetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete user: ${res.status}`);
  }
}
