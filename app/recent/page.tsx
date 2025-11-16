"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { JobCard } from "@/components/job-card"
import { JobDetailsModal } from "@/components/job-details-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Grid, List, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { setupGlobalJobSharing } from "@/lib/global-job-sharing"
import { getRecentJobs, type Job } from "@/src/lib/jobs-api"

// Global job sharing handler

export default function RecentJobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch recent jobs from backend
  useEffect(() => {
    const fetchRecentJobs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fetchedJobs = await getRecentJobs(20) // Get 20 most recent jobs
        
        // Add id field for tracking
        const jobsWithIds = fetchedJobs.map((job, index) => ({
          ...job,
          id: job.url || `recent-job-${index}`,
          isNew: true, // Mark all recent jobs as new
        }))
        
        setRecentJobs(jobsWithIds)
      } catch (err) {
        console.error('Error fetching recent jobs:', err)
        setError('Failed to load recent jobs. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentJobs()
  }, [])

  // Set up global job sharing function if not already available
  useEffect(() => {
    if (!window.shareJobToChat) {
      console.log('🔧 Setting up global job sharing from Recent page');
      setupGlobalJobSharing();
    }
  }, []);

  // Handle URL-based job selection
  useEffect(() => {
    const jobId = searchParams.get('id')
    if (jobId) {
      const job = recentJobs.find(j => j.id === jobId)
      if (job) {
        setSelectedJob(job)
        setIsModalOpen(true)
      }
    } else {
      setIsModalOpen(false)
      setSelectedJob(null)
    }
  }, [searchParams, recentJobs])

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const jobId = new URLSearchParams(window.location.search).get('id')
      if (!jobId) {
        setIsModalOpen(false)
        setSelectedJob(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, []);

  const handleBookmark = (jobId: string) => {
    const newBookmarked = new Set(bookmarkedJobs)
    if (newBookmarked.has(jobId)) {
      newBookmarked.delete(jobId)
    } else {
      newBookmarked.add(jobId)
    }
    setBookmarkedJobs(newBookmarked)
  }

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
    // Update URL with job ID (shallow routing)
    if (job.id) {
      const params = new URLSearchParams(window.location.search)
      params.set('id', job.id)
      router.push(`?${params.toString()}`, { scroll: false })
    }
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setSelectedJob(null)
      // Remove job ID from URL
      const params = new URLSearchParams(window.location.search)
      params.delete('id')
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
      router.push(newUrl, { scroll: false })
    }
  }

  const handleShare = (userIds: string[], message: string, jobId: string) => {
    if (typeof window !== 'undefined' && window.shareJobToChat) {
      const job = recentJobs.find(j => j.id === jobId)
      if (job) {
        window.shareJobToChat(userIds, message, job as any)
        alert(`Job shared successfully! Check the messages page to see it.`)
      }
    } else {
      // Store the job data for localStorage fallback for the first user
      const job = recentJobs.find(j => j.id === jobId)
      if (job) {
        localStorage.setItem('sharedJob', JSON.stringify(job))
      }
      // Redirect to messages page
      window.location.href = '/messages'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Recent Jobs</h1>
          </div>
          <p className="text-muted-foreground">
            Jobs posted in the last 24 hours - don't miss out on fresh opportunities!
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">{recentJobs.length} recent jobs</p>
            <Badge className="bg-accent text-accent-foreground">Last 24 hours</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Recent Job Listings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading recent jobs...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : recentJobs.length > 0 ? (
          <div
            className={cn(
              "mb-8",
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4",
            )}
          >
            {recentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onBookmark={handleBookmark}
                onShare={handleShare}
                isBookmarked={job.id ? bookmarkedJobs.has(job.id) : false}
                onJobClick={handleJobClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No jobs posted in the last 24 hours</p>
            <p className="text-sm text-muted-foreground">Check back later for fresh opportunities!</p>
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onBookmark={handleBookmark}
        onShare={(jobId) => {
          console.log('Share job from modal:', jobId)
        }}
        isBookmarked={selectedJob && selectedJob.id ? bookmarkedJobs.has(selectedJob.id) : false}
      />
    </div>
  )
}
