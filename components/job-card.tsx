"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { JobShareModal } from "@/components/job-share-modal"
import { MapPin, Clock, DollarSign, Share2, Bookmark, BookmarkCheck } from "lucide-react"
import type { Job } from "@/src/lib/jobs-api"
import { cn } from "@/lib/utils"

interface JobCardProps {
  job: Job
  onBookmark?: (jobId: string) => void
  onShare?: (userIds: string[], message: string, jobId: string) => void
  isBookmarked?: boolean
  onJobClick?: (job: Job) => void
}

export function JobCard({ job, onBookmark, onShare, isBookmarked = false, onJobClick }: JobCardProps) {
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setIsBookmarkedState(!isBookmarkedState)
    if (job.id) onBookmark?.(job.id)
  }

  const handleCardClick = () => {
    onJobClick?.(job)
  }

  const handleShare = (userIds: string[], message: string) => {
    if (job.id) onShare?.(userIds, message, job.id);
    setIsShareModalOpen(false)
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    const applicationLink = job.applyUrl || job.url
    if (applicationLink) {
      window.open(applicationLink, "_blank", "noopener,noreferrer")
    } else {
      alert("Application link not available for this job.")
    }
  }

  const getTimeAgo = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just posted"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks === 1) return "1 week ago"
    return `${diffInWeeks} weeks ago`
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-primary text-primary-foreground"
      case "part-time":
        return "bg-secondary text-secondary-foreground"
      case "contract":
        return "bg-accent text-accent-foreground"
      case "remote":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <>
      <Card
        className={cn("hover:shadow-md transition-shadow cursor-pointer group", job.isNew && "ring-2 ring-accent/20")}
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={job.companyLogoUrl || "/placeholder.svg"} alt={job.company || 'Company'} />
                <AvatarFallback>{job.company?.slice(0, 2).toUpperCase() || 'CO'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-muted-foreground">{job.company}</p>
              </div>
            </div>
            {job.isNew && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                New
              </Badge>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              {getTimeAgo(job.postedAt)}
            </div>
            {job.salary && (
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-2" />
                {job.salary}
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

          <div className="flex items-center justify-between mb-6">
            <Badge className={getJobTypeColor(job.type)}>{job.type?.replace("-", " ") || "Full-time"}</Badge>

            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="text-muted-foreground hover:text-foreground"
              >
                {isBookmarkedState ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsShareModalOpen(true)}>Share in chat</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(window.location.href + "/job/" + job.id)}
                  >
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem>Share on LinkedIn</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex justify-center">
            <Button className="w-full sm:w-1/2" size="lg" onClick={handleApply}>
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <JobShareModal
        job={job}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShare}
      />
    </>
  )
}

 