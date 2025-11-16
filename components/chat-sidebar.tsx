"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, Users, Plus } from "lucide-react"
import { mockConversations, getUserById, searchUsers, type Conversation, type ChatUser } from "@/lib/mock-messages"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onConversationSelect: (conversationId: string) => void
  onNewChat?: (userId: string) => void
}

export function ChatSidebar({ conversations, selectedConversationId, onConversationSelect, onNewChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("conversations")

  const filteredUsers = searchUsers(searchQuery)

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${diffInMinutes}m`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d`
  }

  const getOtherParticipant = (conversation: Conversation): ChatUser | undefined => {
    const otherUserId = conversation.participants.find((id) => id !== "current-user")
    return otherUserId ? getUserById(otherUserId) : undefined
  }

  return (
    <div className="w-64 min-w-[16rem] max-w-[16rem] border-r border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversations" className="text-xs">
              <MessageSquare className="w-4 h-4 mr-1" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="people" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              People
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="conversations" className="flex-1">
          <ScrollArea className="h-full pt-2">
            <div className="space-y-1 px-4">
              {conversations
                .filter((conversation) => {
                  if (!searchQuery) return true
                  const otherUser = getOtherParticipant(conversation)
                  return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
                })
                .map((conversation) => {
                  const otherUser = getOtherParticipant(conversation)
                  if (!otherUser) return null

                  return (
                    <div
                      key={conversation.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedConversationId === conversation.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50",
                      )}
                      onClick={() => onConversationSelect(conversation.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.name} />
                          <AvatarFallback>{otherUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {otherUser.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{otherUser.name}</p>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge className="w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage?.type === "job_share"
                              ? "Shared a job opportunity"
                              : conversation.lastMessage?.content || "No messages yet"}
                          </p>
                          {otherUser.isOnline && (
                            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="people" className="flex-1">
          <ScrollArea className="h-full pt-2">
            <div className="space-y-1 px-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onNewChat(user.id)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 mr-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-muted-foreground truncate">
                        {user.title}
                      </p>
                      {user.company && (
                        <p className="text-xs text-muted-foreground/75 truncate">
                          at {user.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button size="sm" variant="ghost" className="flex-shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
