import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        if (userId) {
          this.socket.emit('user_join', userId);
        }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(conversationId) {
    if (this.socket) {
      this.socket.emit('join_room', conversationId);
    }
  }

  sendMessage(senderId, recipientId, content) {
    if (this.socket) {
      this.socket.emit('send_message', { senderId, recipientId, content });
    }
  }

  emitTyping(senderId, recipientId) {
    if (this.socket) {
      this.socket.emit('user_typing', { senderId, recipientId });
    }
  }

  emitStopTyping(senderId, recipientId) {
    if (this.socket) {
      this.socket.emit('user_stop_typing', { senderId, recipientId });
    }
  }

  markMessageRead(messageId) {
    if (this.socket) {
      this.socket.emit('message_read', { messageId });
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', callback);
    }
  }

  onUsersOnline(callback) {
    if (this.socket) {
      this.socket.on('users_online', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
