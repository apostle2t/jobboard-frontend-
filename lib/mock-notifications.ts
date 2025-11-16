export interface Notification {
  id: string
  type: "job_alert" | "message" | "application_update" | "profile_view"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  jobId?: string
  senderId?: string
  senderName?: string
  senderAvatar?: string
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "job_alert",
    title: "New job match found",
    message: "Senior Frontend Developer at TechCorp matches your preferences",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    actionUrl: "/jobs",
    jobId: "1",
  },
  {
    id: "2",
    type: "message",
    title: "New message from Sarah Johnson",
    message: "Hi John, I saw your profile and would like to discuss an opportunity...",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    actionUrl: "/messages",
    senderId: "sarah-johnson",
    senderName: "Sarah Johnson",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=SJ",
  },
  {
    id: "3",
    type: "application_update",
    title: "Application status updated",
    message: "Your application for UX Designer at Design Studio has been reviewed",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    actionUrl: "/applications",
    jobId: "3",
  },
  {
    id: "4",
    type: "profile_view",
    title: "Profile viewed",
    message: "A recruiter from CloudTech Solutions viewed your profile",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    actionUrl: "/profile",
  },
  {
    id: "5",
    type: "job_alert",
    title: "New remote job posted",
    message: "Backend Engineer (Remote) at Infrastructure Inc. matches your criteria",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isRead: true,
    actionUrl: "/jobs",
    jobId: "6",
  },
  {
    id: "6",
    type: "message",
    title: "New message from Mike Chen",
    message: "Thanks for connecting! I'd love to share some insights about the industry...",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isRead: true,
    actionUrl: "/messages",
    senderId: "mike-chen",
    senderName: "Mike Chen",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=MC",
  },
]

export function getUnreadNotificationsCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.isRead).length
}

export function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "job_alert":
      return "briefcase"
    case "message":
      return "message-square"
    case "application_update":
      return "file-text"
    case "profile_view":
      return "eye"
    default:
      return "bell"
  }
}

export function getNotificationColor(type: Notification["type"]) {
  switch (type) {
    case "job_alert":
      return "text-primary"
    case "message":
      return "text-accent"
    case "application_update":
      return "text-secondary"
    case "profile_view":
      return "text-muted-foreground"
    default:
      return "text-muted-foreground"
  }
}
