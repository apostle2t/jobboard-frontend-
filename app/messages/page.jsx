'use client';

import React, { useEffect, useState } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatWindow } from '@/components/chat-window';
import { mockConversations, getConversationMessages } from '@/lib/mock-messages';
import { mockMessages } from '@/lib/mock-messages';
import { mockJobs } from '@/lib/mock-data';
import { setupGlobalJobSharing } from '@/lib/global-job-sharing';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Process localStorage shared jobs
    const sharedJob = localStorage.getItem('sharedJob');
    console.log('🔍 Checking localStorage for sharedJob:', sharedJob);
    
    // Initialize conversations with messages
    const conversationsWithMessages = mockConversations.map(conv => ({
      ...conv,
      messages: getConversationMessages(conv.id)
    }));
    
    if (sharedJob) {
      try {
        const job = JSON.parse(sharedJob);
        console.log('📦 Processing shared job from localStorage:', job);
        // Find the currently selected conversation to add the job to
        const targetConversation = selectedConversation
          ? mockConversations.find(conv => conv.id === selectedConversation)
          : mockConversations[0];
        if (targetConversation) {
          const newMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'current-user',
            receiverId: targetConversation.participants.find(p => p !== 'current-user'),
            content: `Shared a job: ${job.title}`,
            timestamp: new Date(),
            type: 'job_share',
            jobId: job.id,
            isRead: false
          };
      // Add to global mockMessages so getConversationMessages will see it
          mockMessages.push(newMessage);
          // Set this as the selected conversation
          setSelectedConversation(targetConversation.id);
        }
        // Clear the shared job from localStorage
        localStorage.removeItem('sharedJob');
      } catch (error) {
        console.error('Error processing shared job:', error);
      }
    }
    // Always rebuild conversations from mockMessages
    const rebuiltConversations = mockConversations.map(conv => ({
      ...conv,
      messages: getConversationMessages(conv.id)
    }));
    setConversations(rebuiltConversations);
    console.log('📋 Set conversations:', rebuiltConversations);

    // Set up global job sharing function
    setupGlobalJobSharing(setConversations, setSelectedConversation);

    // Clean up global function on unmount
    return () => {
      if (window.shareJobToChat) {
        delete window.shareJobToChat;
      }
    };
  }, []);

  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const handleNewChat = (userId) => {
    console.log('Starting new chat with user:', userId);
    // This could be implemented later if needed
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  console.log('🔍 Selected conversation ID:', selectedConversation);
  console.log('🔍 Selected conversation data:', selectedConversationData);
  console.log('🔍 All conversations:', conversations);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex w-full">
        <ChatSidebar 
          conversations={conversations}
          selectedConversationId={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onNewChat={handleNewChat}
        />
        <div className="flex-1">
          <ChatWindow 
            conversation={selectedConversationData}
          />
        </div>
      </div>
    </div>
  );
}
