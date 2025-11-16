import { mockConversations, mockChatUsers, type Conversation, type Message } from './mock-messages'

// Global state for conversations (in a real app, this would be in a state management system)
let globalConversations: Conversation[] = [...mockConversations]

export function findOrCreateConversation(userId: string): string {
  // Look for existing conversation
  const existingConv = globalConversations.find(conv => 
    conv.participants.includes("current-user") && conv.participants.includes(userId)
  )
  
  if (existingConv) {
    return existingConv.id
  }
  
  // Create new conversation
  const newConvId = `conv-${Date.now()}`
  const newConversation: Conversation = {
    id: newConvId,
    participants: ["current-user", userId],
    messages: [],
    unreadCount: 0,
    updatedAt: new Date(),
  }
  
  globalConversations.push(newConversation)
  return newConvId
}

export function addJobShareMessage(conversationId: string, message: string, jobId: string): Message {
  const newMessage: Message = {
    id: Date.now().toString(),
    senderId: "current-user", 
    receiverId: getOtherParticipant(conversationId) || "",
    content: message,
    type: "job_share",
    jobId,
    timestamp: new Date(),
    isRead: false,
  }
  
  // Update the conversation
  globalConversations = globalConversations.map(conv => {
    if (conv.id === conversationId) {
      return {
        ...conv,
        lastMessage: newMessage,
        messages: [...(conv.messages || []), newMessage],
        updatedAt: new Date(),
      }
    }
    return conv
  })
  
  return newMessage
}

function getOtherParticipant(conversationId: string): string | undefined {
  const conversation = globalConversations.find(conv => conv.id === conversationId)
  return conversation?.participants.find(id => id !== "current-user")
}

export function getUpdatedConversations(): Conversation[] {
  return [...globalConversations]
}

// Event system for real-time updates (simple implementation)
type ConversationUpdateListener = (conversations: Conversation[]) => void
let listeners: ConversationUpdateListener[] = []

export function subscribeToConversationUpdates(listener: ConversationUpdateListener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

export function notifyConversationUpdate() {
  listeners.forEach(listener => listener(getUpdatedConversations()))
}
