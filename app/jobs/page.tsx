"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { JobSearch } from "@/components/job-search"
import { JobCard } from "@/components/job-card"
import { JobDetailsModal } from "@/components/job-details-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid, List, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { setupGlobalJobSharing } from "@/lib/global-job-sharing"
import { getAllJobs, type Job } from "@/src/lib/jobs-api"


const JOBS_PER_PAGE = 6

export default function JobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: ""
  })

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fetchedJobs = await getAllJobs({
          page: currentPage,
          keyword: searchFilters.keyword || undefined,
          location: searchFilters.location || undefined
        })
        
        // Add id field for tracking
        const jobsWithIds = fetchedJobs.map((job, index) => ({
          ...job,
          id: job.url || `job-${currentPage}-${index}`,
        }))
        
        setJobs(jobsWithIds)
        setFilteredJobs(jobsWithIds)
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Failed to load jobs. Please try again later.')
        setJobs([])
        setFilteredJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage, searchFilters])

  // Set up global job sharing function if not already available
  useEffect(() => {
    if (!window.shareJobToChat) {
      console.log('🔧 Setting up global job sharing from Jobs page');
      setupGlobalJobSharing();
    }
  }, []);

  // Load bookmarked job IDs from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedJobs')
    if (savedBookmarks) {
      try {
        const bookmarks = JSON.parse(savedBookmarks)
        const bookmarkIds = new Set<string>(bookmarks.map((job: any) => job.id))
        setBookmarkedJobs(bookmarkIds)
      } catch (error) {
        console.error('Failed to load bookmarks:', error)
      }
    }
  }, [])

  // Handle URL-based job selection
  useEffect(() => {
    const jobId = searchParams.get('id')
    if (jobId) {
      const job = jobs.find(j => j.id === jobId)
      if (job) {
        setSelectedJob(job)
        setIsModalOpen(true)
      }
    } else {
      setIsModalOpen(false)
      setSelectedJob(null)
    }
  }, [searchParams, jobs])

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
  }, [])

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE
  const endIndex = startIndex + JOBS_PER_PAGE
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const handleSearch = (filters: {
    searchTerm: string
    location: string
    jobType: string
    dateFilter: string
  }) => {
    // Update search filters to trigger API call
    setSearchFilters({
      keyword: filters.searchTerm,
      location: filters.location
    })
    setCurrentPage(1)
    
    // Also apply client-side filtering for jobType and dateFilter
    let filtered = jobs
    if (filters.jobType && filters.jobType !== 'all') {
      filtered = filtered.filter(job => 
        job.type.toLowerCase().includes(filters.jobType.toLowerCase())
      )
    }
    setFilteredJobs(filtered)
  }

  const handleBookmark = (jobId: string) => {
    const newBookmarked = new Set(bookmarkedJobs)
    if (newBookmarked.has(jobId)) {
      newBookmarked.delete(jobId)
      // Remove from localStorage
      const savedBookmarks = localStorage.getItem('bookmarkedJobs')
      if (savedBookmarks) {
        try {
          const bookmarks = JSON.parse(savedBookmarks)
          const updatedBookmarks = bookmarks.filter((job: any) => job.id !== jobId)
          localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks))
        } catch (error) {
          console.error('Failed to update bookmarks:', error)
        }
      }
    } else {
      newBookmarked.add(jobId)
      // Add to localStorage
      const job = filteredJobs.find(j => j.id === jobId)
      if (job) {
        const savedBookmarks = localStorage.getItem('bookmarkedJobs')
        let bookmarks = []
        if (savedBookmarks) {
          try {
            bookmarks = JSON.parse(savedBookmarks)
          } catch (error) {
            console.error('Failed to parse bookmarks:', error)
          }
        }
        // Add job if not already in bookmarks
        if (!bookmarks.find((b: any) => b.id === jobId)) {
          bookmarks.push(job)
          localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarks))
        }
      }
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
    console.log("🎯 handleShare called:", { userIds, message, jobId });
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    if (typeof window !== 'undefined' && window.shareJobToChat) {
      window.shareJobToChat(userIds, message, job as any);
      alert(`Job shared successfully! Go to Messages to see it.`);
    } else {
      // Fallback: store in localStorage and redirect for the first user
      const shareData = { userId: userIds[0], message, jobId, timestamp: Date.now() };
      localStorage.setItem('pendingJobShare', JSON.stringify(shareData));
      localStorage.setItem('sharedJob', JSON.stringify(job));
      window.location.href = '/messages';
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground">Discover {jobs.length} job opportunities from top companies</p>
        </div>

        <JobSearch onSearch={handleSearch} />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">{filteredJobs.length} jobs found</p>
            {filteredJobs.length !== jobs.length && (
              <Badge variant="secondary">Filtered from {jobs.length} total</Badge>
            )}
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

        {/* Job Listings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading jobs...</span>
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
        ) : currentJobs.length > 0 ? (
          <div
            className={cn(
              "mb-8",
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4",
            )}
          >
            {currentJobs.map((job) => (
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
            <p className="text-muted-foreground mb-4">No jobs found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchFilters({ keyword: "", location: "" })
                setCurrentPage(1)
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
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
          // Trigger share modal for this job
          const job = jobs.find(j => j.id === jobId)
          if (job) {
            // This would trigger the share modal - for now just log
            console.log('Share job from modal:', jobId)
          }
        }}
        isBookmarked={selectedJob && selectedJob.id ? bookmarkedJobs.has(selectedJob.id) : false}
      />
    </div>
  )
}