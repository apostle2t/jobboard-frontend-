"use client"

import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Check } from "lucide-react"
import { mockChatUsers } from "@/lib/mock-messages"
import type { Job } from "@/src/lib/jobs-api"
import { cn } from "@/lib/utils"

interface JobShareModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
  onShare: (userIds: string[], message: string, jobId: string) => void
}

export function JobShareModal({ job, isOpen, onClose, onShare }: JobShareModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSharing, setIsSharing] = useState(false)

  const filteredUsers = mockChatUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleShareClick = () => {
    if (job.id) onShare(Array.from(selectedUsers), message, job.id);
    onClose();
  };

  const handleClose = () => {
    onClose()
    setSelectedUsers(new Set())
    setMessage("")
    setSearchQuery("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Job</DialogTitle>
          <DialogDescription>Share this job opportunity with your connections</DialogDescription>
        </DialogHeader>

        {/* Job Preview */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm">{job.title}</h4>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <p className="text-sm text-muted-foreground">{job.location}</p>
          <Badge className="mt-2 text-xs">{job.type?.replace("-", " ") || "Full-time"}</Badge>
        </div>

        {/* User Search */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select recipients</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.size > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedUsers).map((userId) => {
                const user = mockChatUsers.find((u) => u.id === userId)
                if (!user) return null
                return (
                  <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <button onClick={() => toggleUserSelection(userId)} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}

          {/* User List */}
          <ScrollArea className="h-48 border rounded-md">
            <div className="p-2 space-y-1">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors",
                    selectedUsers.has(user.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                  )}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.title} {user.company && `at ${user.company}`}
                    </p>
                  </div>
                  {selectedUsers.has(user.id) && <Check className="w-4 h-4 text-primary" />}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Add a message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal note..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSharing}>
            Cancel
          </Button>
          <Button onClick={handleShareClick} disabled={selectedUsers.size === 0 || isSharing}>
            {isSharing ? (
              "Sharing..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Share with {selectedUsers.size} {selectedUsers.size === 1 ? "person" : "people"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
