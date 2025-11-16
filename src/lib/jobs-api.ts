import { apiFetch } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface Job {
  title: string;
  language: string;
  description: string;
  url: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
  applyUrl?: string;
  companyLogoUrl?: string;
  // Optional fields from mock data (not yet in backend)
  id?: string;
  salary?: string;
  isNew?: boolean;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  companyDescription?: string;
}

export interface JobSearchParams {
  page?: number;
  keyword?: string;
  location?: string;
  limit?: number;
}

/**
 * Fetch all jobs with pagination and filters
 */
export async function getAllJobs(params: JobSearchParams = {}): Promise<Job[]> {
  const { page = 1, keyword, location } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  if (keyword) queryParams.append('keyword', keyword);
  if (location) queryParams.append('location', location);

  const res = await apiFetch(`${API_BASE_URL}/api/jobs/all?${queryParams.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Fetch recent jobs (sorted by posted date)
 */
export async function getRecentJobs(limit: number = 10): Promise<Job[]> {
  const res = await apiFetch(`${API_BASE_URL}/api/jobs/recent?limit=${limit}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch recent jobs: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Search jobs with pagination and filters
 */
export async function searchJobs(params: JobSearchParams = {}): Promise<Job[]> {
  const { page = 1, keyword, location } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  if (keyword) queryParams.append('keyword', keyword);
  if (location) queryParams.append('location', location);

  const res = await apiFetch(`${API_BASE_URL}/api/jobs/search?${queryParams.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to search jobs: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Fetch English jobs only
 */
export async function getEnglishJobs(params: JobSearchParams = {}): Promise<Job[]> {
  const { page = 1, keyword, location } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  if (keyword) queryParams.append('keyword', keyword);
  if (location) queryParams.append('location', location);

  const res = await apiFetch(`${API_BASE_URL}/api/jobs/english?${queryParams.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch English jobs: ${res.status}`);
  }
  
  return res.json();
}
