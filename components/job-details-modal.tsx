"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Job } from "@/src/lib/jobs-api"
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  X,
  ExternalLink,
  Bookmark,
  Share2,
  Building2,
  CheckCircle2,
  Award,
  Users
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

interface JobDetailsModalProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookmark?: (jobId: string) => void
  onShare?: (jobId: string) => void
  isBookmarked?: boolean
}

export function JobDetailsModal({
  job,
  open,
  onOpenChange,
  onBookmark,
  onShare,
  isBookmarked = false,
}: JobDetailsModalProps) {
  if (!job) return null

  const handleApply = () => {
    // Use applyUrl first, fallback to url, or show alert if neither exists
    const applicationLink = job.applyUrl || job.url
    if (applicationLink) {
      window.open(applicationLink, "_blank", "noopener,noreferrer")
    } else {
      alert("Application link not available for this job.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 bg-background border-b px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {job.companyLogoUrl && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border flex-shrink-0 flex items-center justify-center bg-muted">
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-2xl font-bold mb-1 line-clamp-2">{job.title}</DialogTitle>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium truncate">{job.company}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap text-xs sm:text-sm">{formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 mt-4">
            <div className="flex gap-2 flex-1 sm:flex-none">
              <Button size="default" className="flex-1 sm:flex-none" onClick={handleApply}>
                <span className="hidden sm:inline">Apply Now</span>
                <span className="sm:hidden">Apply</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="default"
                variant={isBookmarked ? "default" : "outline"}
                onClick={() => job.id && onBookmark?.(job.id)}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button size="default" variant="outline" onClick={() => job.id && onShare?.(job.id)}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <Badge variant={job.type === "remote" ? "default" : "secondary"} className="capitalize">
                <Briefcase className="w-3 h-3 mr-1" />
                {job.type.replace("-", " ")}
              </Badge>
              {job.isNew && (
                <Badge variant="destructive" className="animate-pulse">
                  New
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-6 sm:space-y-8 pb-4 sm:pb-6">
            {/* Job Description */}
            <section>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 flex-shrink-0" />
                About the Role
              </h3>
              <div className="text-sm sm:text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </section>

            <Separator />

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <>
                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <Separator />
              </>
            )}

            {/* Requirements */}
            <section>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 flex-shrink-0" />
                Requirements
              </h3>
              <ul className="space-y-3">
                {(job.requirements || []).map((requirement: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <>
                <Separator />
                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 flex-shrink-0" />
                    Benefits & Perks
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Company Description */}
            {job.companyDescription && (
              <>
                <Separator />
                <section>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 flex-shrink-0" />
                    About {job.company}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{job.companyDescription}</p>
                </section>
              </>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 border-t bg-background px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Ready to take the next step in your career?
            </div>
            <Button size="default" className="w-full sm:w-auto" onClick={handleApply}>
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}