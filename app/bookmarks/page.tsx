"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { JobCard } from "@/components/job-card"
import { JobDetailsModal } from "@/components/job-details-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockJobs, type Job as MockJob } from "@/lib/mock-data"
import type { Job } from "@/src/lib/jobs-api"
import { Bookmark, Grid, List, Trash2, BookmarkX } from "lucide-react"
import { cn } from "@/lib/utils"
import { setupGlobalJobSharing } from "@/lib/global-job-sharing"

// Convert mock job to API job format
const convertMockToApiJob = (mockJob: MockJob): Job => ({
  id: mockJob.id,
  title: mockJob.title,
  company: mockJob.company,
  location: mockJob.location,
  type: mockJob.type,
  salary: mockJob.salary,
  description: mockJob.description,
  requirements: mockJob.requirements,
  responsibilities: mockJob.responsibilities,
  benefits: mockJob.benefits,
  companyDescription: mockJob.companyDescription,
  postedAt: mockJob.postedDate.toISOString(),
  isNew: mockJob.isNew,
  companyLogoUrl: mockJob.companyLogo,
  applyUrl: mockJob.applicationUrl,
  language: "English",
  url: mockJob.applicationUrl || "#"
})

export default function BookmarksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Load bookmarked jobs from localStorage
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [removedJobs, setRemovedJobs] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedJobs')
    if (savedBookmarks) {
      try {
        setBookmarkedJobs(JSON.parse(savedBookmarks))
      } catch (error) {
        console.error('Failed to load bookmarks:', error)
        // Set default bookmarks if parsing fails
        const defaultBookmarks = [
          convertMockToApiJob(mockJobs[0]),
          convertMockToApiJob(mockJobs[2]),
          convertMockToApiJob(mockJobs[4]),
        ]
        setBookmarkedJobs(defaultBookmarks)
        localStorage.setItem('bookmarkedJobs', JSON.stringify(defaultBookmarks))
      }
    } else {
      // Set default bookmarks on first visit
      const defaultBookmarks = [
        convertMockToApiJob(mockJobs[0]),
        convertMockToApiJob(mockJobs[2]),
        convertMockToApiJob(mockJobs[4]),
      ]
      setBookmarkedJobs(defaultBookmarks)
      localStorage.setItem('bookmarkedJobs', JSON.stringify(defaultBookmarks))
    }
    setIsLoaded(true)
  }, [])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs))
    }
  }, [bookmarkedJobs, isLoaded])

  // Set up global job sharing function 
  useEffect(() => {
    if (!window.shareJobToChat) {
      console.log('🔧 Setting up global job sharing from Bookmarks page');
      setupGlobalJobSharing();
    }
  }, []);

  // Handle URL-based job selection
  useEffect(() => {
    const jobId = searchParams.get('id')
    if (jobId) {
      const job = bookmarkedJobs.find(j => j.id === jobId)
      if (job) {
        setSelectedJob(job)
        setIsModalOpen(true)
      }
    } else {
      setIsModalOpen(false)
      setSelectedJob(null)
    }
  }, [searchParams, bookmarkedJobs])

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



  // This handles bookmark removal
  const handleRemoveBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => prev.filter((job) => job.id !== jobId))
    setRemovedJobs((prev) => new Set([...prev, jobId]))
  }


  // This handle Job click to open modal
  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
    // Update URL with job ID (shallow routing)
    const params = new URLSearchParams(window.location.search)
    params.set('id', job.id)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // This handles modal close and URL cleanup
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


  // This handles job sharing
  const handleShare = (userIds: string[], message: string, jobId: string) => {
    if (typeof window !== 'undefined' && window.shareJobToChat) {
      const job = bookmarkedJobs.find(j => j.id === jobId)
      if (job) {
        window.shareJobToChat(userIds, message, job)
        alert(`Job shared successfully! Check the messages page to see it.`)
      }
    } else {
      // Store the job data for localStorage fallback for the first user
      const job = bookmarkedJobs.find(j => j.id === jobId)
      if (job) {
        localStorage.setItem('sharedJob', JSON.stringify(job))
      }
      // Redirect to messages page
      window.location.href = '/messages'
    }
  }

  const clearAllBookmarks = () => {
    setBookmarkedJobs([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Bookmark className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Bookmarked Jobs</h1>
          </div>
          <p className="text-muted-foreground">Keep track of jobs you're interested in</p>
        </div>

        {bookmarkedJobs.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-muted-foreground">{bookmarkedJobs.length} bookmarked jobs</p>
                <Badge variant="secondary">Saved</Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllBookmarks}
                  className="text-destructive bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Bookmarked Jobs */}
            <div
              className={cn(
                "mb-8",
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4",
              )}
            >
              {bookmarkedJobs.map((job) => (
                <div key={job.id} className="relative group">
                  <JobCard 
                    job={job} 
                    onBookmark={handleRemoveBookmark} 
                    onShare={handleShare} 
                    isBookmarked={true}
                    onJobClick={handleJobClick}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveBookmark(job.id)
                    }}
                  >
                    <BookmarkX className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Recently Removed Alert */}
            {removedJobs.size > 0 && (
              <Alert className="mb-6">
                <AlertDescription>
                  {removedJobs.size} job{removedJobs.size > 1 ? "s" : ""} removed from bookmarks
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No bookmarked jobs yet</h2>
            <p className="text-muted-foreground mb-6">
              Start bookmarking jobs you're interested in to keep track of them here
            </p>
            <Button asChild>
              <a href="/jobs">Browse Jobs</a>
            </Button>
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onBookmark={handleRemoveBookmark}
        onShare={(jobId) => {
          console.log('Share job from modal:', jobId)
        }}
        isBookmarked={true}
      />
    </div>
  )
}