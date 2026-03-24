import { useEffect } from 'react';
import { socketService } from '../services/socketService';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

export const useSocket = () => {
  const { setOnlineUsers, addMessage, addTypingUser, removeTypingUser } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Connect automatically when hook mounts if a user exists
    socketService.connect(user._id);

    // Listeners
    const handleReceiveMessage = (message) => {
      addMessage(message);
    };

    const handleUsersOnline = (users) => {
      setOnlineUsers(users);
    };

    const handleUserTyping = (data) => {
      addTypingUser(data.senderId);
    };

    const handleUserStopTyping = (data) => {
      removeTypingUser(data.senderId);
    };

    socketService.onMessageReceived(handleReceiveMessage);
    socketService.onUsersOnline(handleUsersOnline);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);

    return () => {
      socketService.removeListener('receive_message', handleReceiveMessage);
      socketService.removeListener('users_online', handleUsersOnline);
      socketService.removeListener('user_typing', handleUserTyping);
      socketService.removeListener('user_stop_typing', handleUserStopTyping);
    };
  }, [user, addMessage, setOnlineUsers, addTypingUser, removeTypingUser]);
};
