import { useCallback } from 'react';
import useChatStore from '../store/chatStore';
import { messagesService } from '../services/messagesService';
import { socketService } from '../services/socketService';

export const useChat = () => {
  const { 
    conversations, setConversations, 
    messages, setMessages, addMessage, 
    selectedConversation, selectConversation,
    isLoading, setLoading 
  } = useChatStore();

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await messagesService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
    }
  }, [setConversations, setLoading]);

  const fetchMessages = useCallback(async (userId) => {
    setLoading(true);
    try {
      const data = await messagesService.getConversationWithUser(userId);
      setMessages(data);
      selectConversation(userId);
      // Join room via socket if backend supports room logic per user pairs
      // socketService.joinRoom(roomString);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  }, [setMessages, selectConversation, setLoading]);

  const sendMessage = async (recipientId, content) => {
    try {
      socketService.sendMessage(null, recipientId, content);
      // Depending on backend socket implementation, listen for 'message_sent' 
      // or just optimistically add to list. We assume listening handles the local echo.
    } catch (err) {
      console.error('Failed to send message via socket', err);
    }
  };

  return {
    conversations,
    messages,
    selectedConversation,
    isLoading,
    fetchConversations,
    fetchMessages,
    sendMessage
  };
};
