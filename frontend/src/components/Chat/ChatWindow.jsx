import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import useAuthStore from '../../store/authStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import Avatar from '../Common/Avatar';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import { FaceSmileIcon, PaperAirplaneIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { socketService } from '../../services/socketService';

const ChatWindow = ({ userId }) => {
  const { user: currentUser } = useAuthStore();
  const { messages, fetchMessages, sendMessage, isLoading } = useChat();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // For typing indicator logic
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  
  // Need the target user details (for header), in a real app, we'd fetch or extract from conversations list
  // Here we'll just mock it or assume it's part of messages fetch. 
  // We'll trust global state has conversations populated
  const { conversations, typingUsers } = useChatStoreState(); 
  const targetUser = conversations.find(c => c.user._id === userId)?.user || { name: 'Chat User' };
  
  const targetIsTyping = typingUsers.includes(userId);

  useEffect(() => {
    fetchMessages(userId);
  }, [userId, fetchMessages]);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, targetIsTyping]);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    
    // Typing indicator emit
    if (!isTyping) {
      setIsTyping(true);
      socketService.emitTyping(currentUser._id, userId);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.emitStopTyping(currentUser._id, userId);
    }, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(userId, inputText);
    setInputText('');
    
    // Stop typing immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    socketService.emitStopTyping(currentUser._id, userId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--surface-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={targetUser?.profilePicture} name={targetUser?.name} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>{targetUser?.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {/* Could be 'Active Now' ideally based on onlineUsers list */}
              Tap here for contact info
            </div>
          </div>
        </div>
        <button className="hover-scale" style={{ color: 'var(--text-secondary)' }}>
          <EllipsisVerticalIcon style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: 'var(--spacing-6)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)',
        backgroundColor: 'var(--surface-color-secondary)'
      }}>
        {isLoading && messages.length === 0 ? (
          <LoadingSpinner />
        ) : (
          messages.map(msg => (
            <MessageBubble 
              key={msg._id} 
              message={msg} 
              isOwn={msg.sender === currentUser._id || msg.sender?._id === currentUser._id} 
            />
          ))
        )}
        
        {targetIsTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: 'var(--spacing-4)',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--surface-color)'
      }}>
        <form onSubmit={handleSend} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--surface-color-secondary)',
          padding: '8px 16px',
          borderRadius: 'var(--border-radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          <button type="button" style={{ color: 'var(--text-secondary)' }} className="hover-scale">
            <FaceSmileIcon style={{ width: '24px', height: '24px' }} />
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={handleTextChange}
            placeholder="Type a message..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '15px',
              color: 'var(--text-primary)'
            }}
          />
          
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            style={{ 
              color: inputText.trim() ? 'var(--primary-color)' : 'var(--text-secondary)',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}
            className="hover-scale"
          >
            <PaperAirplaneIcon style={{ width: '24px', height: '24px' }} />
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper hook export trick since ChatWindow needs conversations
import useChatStore from '../../store/chatStore';
const useChatStoreState = () => {
  return useChatStore((state) => ({ 
    conversations: state.conversations,
    typingUsers: state.typingUsers 
  }));
};

export default ChatWindow;
