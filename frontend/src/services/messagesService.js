import api from './api';

export const messagesService = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data.conversations || [];
  },

  getConversationWithUser: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data.messages || [];
  },

  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  }
};
