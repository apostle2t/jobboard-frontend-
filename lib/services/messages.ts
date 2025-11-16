import { Message, mockConversations } from "../mock-messages"
import type { Job } from "../mock-data"

// This will be replaced with real API calls later
export const messageService = {
  shareJob: async (conversationId: string, job: Job, message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      receiverId: mockConversations.find(c => c.id === conversationId)?.participants.find(p => p !== "current-user") || "",
      content: message,
      timestamp: new Date(),
      type: "job_share",
      jobId: job.id,
      isRead: false
    }

    // In real implementation, this would be an API call
    const conversation = mockConversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.lastMessage = newMessage
      conversation.updatedAt = new Date()
    }

    return newMessage
  },

  sendMessage: async (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      receiverId: mockConversations.find(c => c.id === conversationId)?.participants.find(p => p !== "current-user") || "",
      content,
      timestamp: new Date(),
      type: "text",
      isRead: false
    }

    // In real implementation, this would be an API call
    const conversation = mockConversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.lastMessage = newMessage
      conversation.updatedAt = new Date()
    }

    return newMessage
  }
}
