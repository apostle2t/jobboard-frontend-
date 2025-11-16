import type { Job } from "@/lib/mock-data";

declare global {
  interface Window {
    shareJobToChat?: (userIds: string[] | string, message: string, job: Job) => void;
  }
}

export {};
