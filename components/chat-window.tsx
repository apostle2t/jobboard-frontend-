"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, MapPin, DollarSign, CalendarDays, MessageSquare } from "lucide-react"
import { getUserById, type Message, type Conversation } from "@/lib/mock-messages"
import { mockJobs } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface ChatWindowProps {
  conversation?: Conversation
  onSendMessage?: (content: string, type: "text" | "job_share", jobId?: string) => void
}

export function ChatWindow({ conversation, onSendMessage }: ChatWindowProps): JSX.Element {
  const [newMessage, setNewMessage] = useState("")
  const messages = conversation?.messages || []
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  console.log('🖼️ ChatWindow rendering with conversation:', conversation);
  console.log('📨 Messages to render:', messages);

  const otherUserId = conversation?.participants?.find((id) => id !== "current-user")
  const otherUser = otherUserId ? getUserById(otherUserId) : null

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    onSendMessage?.(newMessage, "text")
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderJobShare = (message: Message) => {
    if (!message.jobId) return null;
    const job = mockJobs.find(j => j.id === message.jobId);
    if (!job) return null;

    return (
      <div className="mt-2">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <h4 className="font-semibold">{job.title}</h4>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {job.location}
              </Badge>
              {job.salary && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> {job.salary}
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> {job.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Yesterday"
    return `${diffInDays} days ago`
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <div className="text-center space-y-2">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-lg font-medium">Select a conversation</p>
          <p className="text-sm text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center space-x-4">
          {otherUser && (
            <>
              <Avatar>
                <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{otherUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {otherUser.title} at {otherUser.company}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const sender = getUserById(message.senderId)
            const isCurrentUser = message.senderId === "current-user"

            return (
              <div key={message.id} className={cn("flex", isCurrentUser && "justify-end")}>
                <div
                  className={cn(
                    "flex items-start space-x-2 max-w-[70%]",
                    isCurrentUser && "flex-row-reverse space-x-reverse",
                  )}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sender?.avatar || "/placeholder.svg"} alt={sender?.name} />
                      <AvatarFallback className="text-xs">{sender?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1">
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2",
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {message.type === "job_share" ? (
                        <div className="space-y-2">
                          <p className="text-sm">{message.content}</p>
                          {renderJobShare(message)}
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    <p className={cn("text-xs text-muted-foreground", isCurrentUser && "text-right")}>
                      {getTimeAgo(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
