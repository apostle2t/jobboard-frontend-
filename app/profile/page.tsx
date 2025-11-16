"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Mail, Phone, Briefcase, Edit, ExternalLink, DollarSign, Clock, Globe, Loader2 } from "lucide-react"
import { type User as UserType } from "@/lib/mock-user"
import { getCurrentUser, updateUser, type UserProfile } from "@/src/lib/user-api"

// Helper function to convert backend UserProfile to frontend User format
function mapUserProfileToUser(profile: UserProfile): UserType {
  return {
    id: profile.id.toString(),
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: undefined, // Backend doesn't have phone field yet
    location: profile.location || "",
    jobTitle: profile.workTitle,
    company: undefined, // Backend doesn't have company field yet
    bio: profile.description,
    skills: profile.skills ? profile.skills.split(',').map(s => s.trim()) : [],
    experience: profile.yearsOfExperience ? `${profile.yearsOfExperience}+ years` : "0 years",
    profileImage: profile.profilePictureUrl,
    preferences: {
      jobType: profile.jobType ? [profile.jobType.toLowerCase()] : ["full-time"],
      salaryRange: {
        min: profile.expectedSalary ? Math.floor(profile.expectedSalary * 0.8) : 0,
        max: profile.expectedSalary || 0,
      },
      remoteWork: profile.jobStatus === "OPEN_TO_REMOTE" || profile.jobStatus === "REMOTE_ONLY",
      willingToRelocate: false, // Backend doesn't have this field yet
    },
    socialLinks: {
      linkedin: profile.linkedInProfile,
      github: profile.githubProfile,
      portfolio: profile.portfolio,
    },
  }
}

// Helper function to convert frontend User to backend UpdateUserData
function mapUserToUpdateData(user: UserType) {
  // Extract years from experience string like "5+ years" or "Mid-level (3-5 years)"
  const experienceMatch = user.experience.match(/(\d+)/);
  const yearsOfExperience = experienceMatch ? parseInt(experienceMatch[1]) : undefined;

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    workTitle: user.jobTitle,
    description: user.bio,
    yearsOfExperience: yearsOfExperience,
    skills: user.skills.join(', '),
    location: user.location,
    expectedSalary: user.preferences.salaryRange.max,
    jobType: user.preferences.jobType[0]?.toUpperCase().replace('-', '_'),
    linkedInProfile: user.socialLinks.linkedin,
    githubProfile: user.socialLinks.github,
    portfolio: user.socialLinks.portfolio,
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const profile = await getCurrentUser()
      console.log("Loaded profile with picture URL:", profile.profilePictureUrl)
      
      // Check if profilePictureUrl is an S3 key (not a full URL)
      if (profile.profilePictureUrl && !profile.profilePictureUrl.startsWith('http')) {
        console.warn("Backend returned S3 key instead of presigned URL. Fetching via getUserById...")
        // Fetch the full user data which should have presigned URL
        const { getUserById } = await import("@/src/lib/user-api")
        const fullProfile = await getUserById(profile.id)
        console.log("Full profile with presigned URL:", fullProfile.profilePictureUrl)
        setUser(mapUserProfileToUser(fullProfile))
      } else {
        setUser(mapUserProfileToUser(profile))
      }
    } catch (err) {
      console.error("Failed to load user profile:", err)
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (updatedUser: UserType) => {
    if (!user) return

    try {
      const updateData = mapUserToUpdateData(updatedUser)
      console.log("Sending update data:", updateData)
      await updateUser(parseInt(user.id), updateData)
      console.log("Profile updated successfully")
      
      // Clear the user state to force a fresh load
      setUser(null)
      setIsEditModalOpen(false)
      
      // Reload profile from backend to get fresh presigned URL
      console.log("Reloading profile to get fresh presigned URL...")
      await loadUserProfile()
      console.log("Profile reloaded successfully")
    } catch (err) {
      console.error("Failed to update profile:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile"
      console.error("Error details:", errorMessage)
      alert(`Error: ${errorMessage}`)
      throw err // Re-throw to let modal handle the error state
    }
  }

  const formatSalaryRange = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <Button onClick={() => setIsEditModalOpen(true)} disabled={loading || !user}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading profile...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="border-destructive">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-destructive font-semibold">Failed to load profile</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button onClick={loadUserProfile} variant="outline">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Content */}
          {!loading && !error && user && (
            <>


          {/* Basic Information Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        console.log("✅ Profile page avatar loaded successfully")
                        console.log("Full URL used:", user.profileImage)
                        console.log("Actual img src:", (e.target as HTMLImageElement).src)
                      }}
                      onError={(e) => {
                        console.error("❌ Profile page avatar failed to load")
                        console.error("URL in state:", user.profileImage)
                        console.error("Actual img src attempted:", (e.target as HTMLImageElement).src)
                        console.error("URL length:", user.profileImage?.length)
                        console.error("Is it a presigned URL?", user.profileImage?.includes('X-Amz-Signature'))
                      }}
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {user.firstName} {user.lastName}
                    </h2>
                    {user.jobTitle && <p className="text-lg text-muted-foreground">{user.jobTitle}</p>}
                    {user.company && <p className="text-muted-foreground">at {user.company}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.phone}
                      </div>
                    )}
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {user.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {user.experience}
                    </div>
                  </div>

                  {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Job Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Job Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Job Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.jobType.map((type) => (
                      <Badge key={type} variant="outline">
                        {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Salary Range
                  </h4>
                  <p className="text-muted-foreground">
                    {formatSalaryRange(user.preferences.salaryRange.min, user.preferences.salaryRange.max)}
                  </p>
                </div>

                <div className="space-y-2">
                  {user.preferences.remoteWork && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="w-4 h-4 mr-2" />
                      Open to remote work
                    </div>
                  )}
                  {user.preferences.willingToRelocate && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      Willing to relocate
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          {(user.socialLinks.linkedin || user.socialLinks.github || user.socialLinks.portfolio) && (
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {user.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  {user.socialLinks.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  {user.socialLinks.portfolio && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                        Portfolio
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          </>
          )}
        </div>
      </main>

      {user && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}
