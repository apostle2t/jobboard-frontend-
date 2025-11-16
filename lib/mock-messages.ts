export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  type: "text" | "job_share"
  jobId?: string
  isRead: boolean
}

export interface Conversation {
  id: string
  participants: string[]
  messages?: Message[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  title?: string
  company?: string
  isOnline: boolean
  lastSeen?: Date
}

export const mockChatUsers: ChatUser[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    title: "Senior Recruiter",
    company: "TechCorp Inc.",
    isOnline: true,
  },
  {
    id: "mike-chen",
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    title: "Engineering Manager",
    company: "StartupXYZ",
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: "emily-davis",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40&text=ED",
    title: "HR Director",
    company: "Design Studio",
    isOnline: true,
  },
  {
    id: "alex-rodriguez",
    name: "Alex Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40&text=AR",
    title: "CTO",
    company: "CloudTech Solutions",
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "lisa-wang",
    name: "Lisa Wang",
    avatar: "/placeholder.svg?height=40&width=40&text=LW",
    title: "Product Manager",
    company: "Analytics Pro",
    isOnline: true,
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "sarah-johnson",
    receiverId: "current-user",
    content:
      "Hi John! I saw your profile and I think you'd be a great fit for our Senior Frontend Developer position. Would you be interested in learning more?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    senderId: "current-user",
    receiverId: "sarah-johnson",
    content: "Hi Sarah! Thank you for reaching out. I'm definitely interested in learning more about the position.",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    type: "text",
    isRead: true,
  },
  {
    id: "3",
    senderId: "sarah-johnson",
    receiverId: "current-user",
    content: "Great! Let me share the job posting with you so you can review the details.",
    timestamp: new Date(Date.now() - 85 * 60 * 1000),
    type: "text",
    isRead: true,
  },
  {
    id: "4",
    senderId: "sarah-johnson",
    receiverId: "current-user",
    content: "Here's the position I mentioned:",
    timestamp: new Date(Date.now() - 80 * 60 * 1000),
    type: "job_share",
    jobId: "1",
    isRead: true,
  },
  {
    id: "5",
    senderId: "current-user",
    receiverId: "sarah-johnson",
    content:
      "This looks perfect! The tech stack aligns well with my experience. When would be a good time to discuss this further?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: "text",
    isRead: false,
  },
  {
    id: "6",
    senderId: "mike-chen",
    receiverId: "current-user",
    content:
      "Hey John! Thanks for connecting. I'd love to share some insights about the industry and discuss potential opportunities at StartupXYZ.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    type: "text",
    isRead: true,
  },
  {
    id: "7",
    senderId: "current-user",
    receiverId: "mike-chen",
    content:
      "Hi Mike! I appreciate you reaching out. I'd love to learn more about StartupXYZ and the opportunities there.",
    timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
    type: "text",
    isRead: true,
  },
  {
    id: "8",
    senderId: "emily-davis",
    receiverId: "current-user",
    content: "Hi John! We have an exciting UX Designer position that might interest you. Are you open to remote work?",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    type: "text",
    isRead: false,
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: ["current-user", "sarah-johnson"],
    lastMessage: mockMessages[4],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "conv-2",
    participants: ["current-user", "mike-chen"],
    lastMessage: mockMessages[6],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
  },
  {
    id: "conv-3",
    participants: ["current-user", "emily-davis"],
    lastMessage: mockMessages[7],
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
]

export function getConversationMessages(conversationId: string): Message[] {
  const conversation = mockConversations.find((c) => c.id === conversationId)
  if (!conversation) return []

  return mockMessages.filter(
    (message) =>
      (conversation.participants.includes(message.senderId) &&
        conversation.participants.includes(message.receiverId)) ||
      (conversation.participants.includes(message.receiverId) && conversation.participants.includes(message.senderId)),
  )
}

export function getUserById(userId: string): ChatUser | undefined {
  return mockChatUsers.find((user) => user.id === userId)
}

export function searchUsers(query: string): ChatUser[] {
  if (!query.trim()) return mockChatUsers

  return mockChatUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.company?.toLowerCase().includes(query.toLowerCase()) ||
      user.title?.toLowerCase().includes(query.toLowerCase()),
  )
}
