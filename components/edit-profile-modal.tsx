"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, X, Plus, CheckCircle } from "lucide-react"
import { type User, skillOptions, experienceLevels } from "@/lib/mock-user"
import { jobTypes } from "@/lib/mock-data"

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave: (updatedUser: User) => void
}

export function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<User>(user)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [newSkill, setNewSkill] = useState("")

  // Update formData when user prop changes (e.g., after profile picture upload)
  useEffect(() => {
    console.log("EditProfileModal: User prop changed, updating formData")
    console.log("New user data:", user)
    console.log("Profile image URL:", user.profileImage)
    setFormData(user)
  }, [user, isOpen]) // Also reset when modal opens

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof User] as any),
        [field]: value,
      },
    }))
  }

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
    setNewSkill("")
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Only validate salary if both values are greater than 0
    if (formData.preferences.salaryRange.max > 0 && 
        formData.preferences.salaryRange.min >= formData.preferences.salaryRange.max) {
      newErrors.salaryRange = "Minimum salary must be less than maximum salary"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    const isValid = validateForm()
    console.log("Form validation result:", isValid)
    console.log("Form errors:", errors)
    
    if (!isValid) {
      console.log("Validation failed - not saving")
      return
    }

    setIsLoading(true)
    setSuccess("")
    setErrors({})

    try {
      console.log("Calling onSave with:", formData)
      await onSave(formData)
      setSuccess("Profile updated successfully!")

      // Close modal after success
      setTimeout(() => {
        onClose()
        setSuccess("")
      }, 1500)
    } catch (error) {
      console.error("Failed to save profile:", error)
      setErrors({ general: error instanceof Error ? error.message : "Failed to save profile. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user.id) return

    try {
      setIsLoading(true)
      console.log("Uploading profile picture for user:", user.id)
      
      // Import the uploadProfilePicture function
      const { uploadProfilePicture } = await import("@/src/lib/user-api")
      
      const result = await uploadProfilePicture(parseInt(user.id), file)
      console.log("Profile picture upload result:", result)
      console.log("Presigned URL from upload:", result.url)
      
      // Update the form data with the presigned URL from backend
      setFormData((prev) => ({
        ...prev,
        profileImage: result.url, // This should be the presigned URL
      }))
      
      console.log("Updated form data with profile image URL:", result.url)
      
      setSuccess("Profile picture uploaded successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Failed to upload profile picture:", error)
      setErrors({ general: error instanceof Error ? error.message : "Failed to upload profile picture" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information to help employers find you</DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {errors.general && (
          <Alert variant="destructive">
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Profile Image */}
            <div className="flex items-center space-x-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onLoad={(e) => {
                      console.log("✅ Modal avatar loaded successfully")
                      console.log("Full URL used:", formData.profileImage)
                      console.log("Actual img src:", (e.target as HTMLImageElement).src)
                    }}
                    onError={(e) => {
                      console.error("❌ Modal avatar failed to load")
                      console.error("URL in state:", formData.profileImage)
                      console.error("Actual img src attempted:", (e.target as HTMLImageElement).src)
                      console.error("URL length:", formData.profileImage?.length)
                    }}
                  />
                ) : (
                  <span className="text-lg font-medium">
                    {formData.firstName[0]}
                    {formData.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </span>
                  </Button>
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Current Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle || ""}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Current Company</Label>
              <Input
                id="company"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleSkillRemove(skill)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newSkill} onValueChange={setNewSkill}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Add a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillOptions
                      .filter((skill) => !formData.skills.includes(skill))
                      .map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSkillAdd(newSkill)}
                  disabled={!newSkill}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label>Social Links</Label>
              <div className="space-y-2">
                <Input
                  placeholder="LinkedIn URL"
                  value={formData.socialLinks.linkedin || ""}
                  onChange={(e) => handleNestedChange("socialLinks", "linkedin", e.target.value)}
                />
                <Input
                  placeholder="GitHub URL"
                  value={formData.socialLinks.github || ""}
                  onChange={(e) => handleNestedChange("socialLinks", "github", e.target.value)}
                />
                <Input
                  placeholder="Portfolio URL"
                  value={formData.socialLinks.portfolio || ""}
                  onChange={(e) => handleNestedChange("socialLinks", "portfolio", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Job Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.preferences.jobType.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleNestedChange("preferences", "jobType", [...formData.preferences.jobType, type])
                        } else {
                          handleNestedChange(
                            "preferences",
                            "jobType",
                            formData.preferences.jobType.filter((t) => t !== type),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={type} className="text-sm">
                      {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Salary Range (USD)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minSalary" className="text-sm">
                    Minimum
                  </Label>
                  <Input
                    id="minSalary"
                    type="number"
                    value={formData.preferences.salaryRange.min}
                    onChange={(e) =>
                      handleNestedChange("preferences", "salaryRange", {
                        ...formData.preferences.salaryRange,
                        min: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxSalary" className="text-sm">
                    Maximum
                  </Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    value={formData.preferences.salaryRange.max}
                    onChange={(e) =>
                      handleNestedChange("preferences", "salaryRange", {
                        ...formData.preferences.salaryRange,
                        max: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              {errors.salaryRange && <p className="text-sm text-destructive">{errors.salaryRange}</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remoteWork"
                  checked={formData.preferences.remoteWork}
                  onCheckedChange={(checked) => handleNestedChange("preferences", "remoteWork", checked)}
                />
                <Label htmlFor="remoteWork">Open to remote work</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="willingToRelocate"
                  checked={formData.preferences.willingToRelocate}
                  onCheckedChange={(checked) => handleNestedChange("preferences", "willingToRelocate", checked)}
                />
                <Label htmlFor="willingToRelocate">Willing to relocate</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
