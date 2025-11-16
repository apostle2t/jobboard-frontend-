import { mockConversations, getConversationMessages, mockMessages } from './mock-messages';
import type { Job } from '@/src/lib/jobs-api';

export function setupGlobalJobSharing(setConversations?: (conversations: any[]) => void, setSelectedConversation?: (id: string) => void) {
  // Set up global job sharing function that accepts userIds array, message, and job
  if (typeof window !== 'undefined') {
    (window as any).shareJobToChat = (userIds: string | string[], message: string, job: Job) => {
      console.log('🔥 shareJobToChat called with:', { userIds, message, job });
      
      // Handle single user or array of users
      const usersArray = Array.isArray(userIds) ? userIds : [userIds];
      let lastConversationId = null;
    
    usersArray.forEach(userId => {
      console.log(`📧 Creating/finding conversation for user: ${userId}`);
      
      // Find or create the conversation with this user
      let conversation = mockConversations.find(conv => 
        conv.participants.includes('current-user') && conv.participants.includes(userId)
      );
      
      if (!conversation) {
        console.log(`🆕 Creating new conversation for user: ${userId}`);
        // Create new conversation
        conversation = {
          id: `conv-${Date.now()}-${userId}`,
          participants: ['current-user', userId],
          messages: [],
          unreadCount: 0,
          updatedAt: new Date(),
        };
        mockConversations.push(conversation);
      } else {
        console.log(`📝 Found existing conversation for user: ${userId}`);
      }
      
      const newMessage = {
        id: `msg-${Date.now()}-${userId}`,
        senderId: 'current-user',
        receiverId: userId,
        content: message || `Shared a job: ${job.title}`,
        timestamp: new Date(),
        type: 'job_share' as const,
        jobId: job.id,
        isRead: false
      };
      
      console.log(`💬 Adding message:`, newMessage);
      mockMessages.push(newMessage);
      lastConversationId = conversation.id;
    });
    
    // If setConversations callback is provided, rebuild conversations
    if (setConversations) {
      const rebuiltConversations = mockConversations.map(conv => ({
        ...conv,
        messages: getConversationMessages(conv.id)
      }));
      setConversations(rebuiltConversations);
    }
    
    // If setSelectedConversation callback is provided, select the last conversation
    if (setSelectedConversation && lastConversationId) {
      setSelectedConversation(lastConversationId);
    }
    
    console.log(`✅ Job shared to ${usersArray.length} conversation(s)`);
  };
  
  console.log('🌍 Global shareJobToChat function set up');
  }
}
