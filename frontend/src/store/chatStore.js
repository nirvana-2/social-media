import { create } from 'zustand';

const useChatStore = create((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  isLoading: false,

  setConversations: (conversations) => set({ conversations }),
  
  addConversation: (conversation) => set((state) => {
    const exists = state.conversations.find(c => c._id === conversation._id);
    if (!exists) {
      return { conversations: [conversation, ...state.conversations] };
    }
    return state;
  }),
  
  selectConversation: (userId) => set({ selectedConversation: userId }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  deleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(m => m._id !== messageId)
  })),
  
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  
  addTypingUser: (userId) => set((state) => ({
    typingUsers: state.typingUsers.includes(userId) ? state.typingUsers : [...state.typingUsers, userId]
  })),
  
  removeTypingUser: (userId) => set((state) => ({
    typingUsers: state.typingUsers.filter(id => id !== userId)
  })),

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useChatStore;
