import React from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import useChatStore from '../../store/chatStore';

const ChatPage = () => {
  const { selectedConversation } = useChatStore();

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--border-radius-lg)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left Axis: Conversation List */}
      <div style={{
        width: '320px',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--surface-color-secondary)'
      }}>
        <ConversationList />
      </div>

      {/* Right Axis: Active Chat Window */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {selectedConversation ? (
          <ChatWindow userId={selectedConversation} />
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
