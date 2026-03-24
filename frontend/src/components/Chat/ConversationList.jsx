import React, { useEffect, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import Avatar from '../Common/Avatar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

const ConversationList = () => {
  const { conversations, fetchConversations, selectedConversation, isLoading } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = conversations.filter(c => 
    c.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header & Search */}
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: 'var(--spacing-3)' }}>Messages</h2>
        <div style={{ position: 'relative' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--border-radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color-secondary)',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading && conversations.length === 0 ? (
          <LoadingSpinner />
        ) : filteredConversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--text-secondary)', fontSize: '14px' }}>
            No conversations found.
          </div>
        ) : (
          filteredConversations.map(conv => (
            <div 
              key={conv._id}
              onClick={() => useChat().fetchMessages(conv.user?._id)} // Quick hack invocation
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: 'var(--spacing-3) var(--spacing-4)',
                cursor: 'pointer',
                backgroundColor: selectedConversation === conv.user?._id ? 'var(--surface-color)' : 'transparent',
                borderLeft: selectedConversation === conv.user?._id ? '4px solid var(--primary-color)' : '4px solid transparent',
                borderBottom: '1px solid var(--border-color)',
                transition: 'background-color 0.2s'
              }}
              className="hover-scale"
            >
              <Avatar src={conv.user?.profilePicture} name={conv.user?.name} size="md" isOnline={conv.isOnline} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.user?.name}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {formatDate(conv.lastMessage?.createdAt)}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: conv.unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: conv.unreadCount > 0 ? '600' : '400',
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}>
                  {conv.lastMessage?.content}
                </div>
              </div>
              {conv.unreadCount > 0 && (
                <div style={{
                  backgroundColor: 'var(--primary-color)',
                  color: '#FFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {conv.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ConversationList;
