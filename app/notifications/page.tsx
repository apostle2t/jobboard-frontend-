"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Briefcase, MessageSquare, FileText, Eye, Check, Trash2 } from "lucide-react"
import { mockNotifications, type Notification } from "@/lib/mock-notifications"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "job_alert" | "message">("all")

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.isRead
      case "job_alert":
        return notification.type === "job_alert"
      case "message":
        return notification.type === "message"
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    return `${diffInDays} days ago`
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "job_alert":
        return <Briefcase className="w-5 h-5" />
      case "message":
        return <MessageSquare className="w-5 h-5" />
      case "application_update":
        return <FileText className="w-5 h-5" />
      case "profile_view":
        return <Eye className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground">Stay updated with job alerts and messages</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="w-4 h-4 mr-2" />
                Mark all read ({unreadCount})
              </Button>
            )}
          </div>
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && <Badge className="ml-1 text-xs">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="job_alert">Job Alerts</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn("transition-colors", !notification.isRead && "bg-muted/30 border-primary/20")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {notification.type === "message" && notification.senderAvatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={notification.senderAvatar || "/placeholder.svg"}
                            alt={notification.senderName}
                          />
                          <AvatarFallback className="text-sm">
                            {notification.senderName?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            notification.type === "job_alert" && "bg-primary/10 text-primary",
                            notification.type === "message" && "bg-accent/10 text-accent",
                            notification.type === "application_update" && "bg-secondary/10 text-secondary",
                            notification.type === "profile_view" && "bg-muted text-muted-foreground",
                          )}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-semibold text-foreground">{notification.title}</h3>
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{getTimeAgo(notification.timestamp)}</p>

                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                              onClick={() => markAsRead(notification.id)}
                            >
                              View details →
                            </Link>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h2>
            <p className="text-muted-foreground">
              {filter === "unread"
                ? "You're all caught up!"
                : "We'll notify you when there are job matches or new messages"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
