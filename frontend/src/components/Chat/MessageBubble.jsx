import React from 'react';
import { formatTime } from '../../utils/formatDate';
import { CheckIcon } from '@heroicons/react/24/outline'; // Could import a double check ideal for read receipts

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '70%',
        backgroundColor: isOwn ? 'var(--primary-color)' : 'var(--surface-color)',
        color: isOwn ? '#FFFFFF' : 'var(--text-primary)',
        padding: '10px 16px',
        borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        border: isOwn ? 'none' : '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ fontSize: '15px', wordBreak: 'break-word' }}>
          {message.content}
        </div>
        <div style={{ 
          alignSelf: 'flex-end', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          fontSize: '11px',
          color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'
        }}>
          {formatTime(message.createdAt)}
          {isOwn && (
            <CheckIcon style={{ width: '12px', height: '12px', color: message.read ? '#fff' : 'inherit' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
