import React, { useState } from 'react';
import Avatar from '../Common/Avatar';
import Button from '../Common/Button';
import { usePosts } from '../../hooks/usePosts';
import { formatDate } from '../../utils/formatDate';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import CommentSection from './CommentSection';
import useAuthStore from '../../store/authStore';

const PostCard = ({ post }) => {
  const { user } = useAuthStore();
  const { like, unlike } = usePosts();
  const [showComments, setShowComments] = useState(false);

  const isLikedByMe = Array.isArray(post.likes) ? post.likes.includes(user?.id) : false;

  const handleLikeToggle = async () => {
    if (isLikedByMe) {
      await unlike(post.id);
    } else {
      await like(post.id);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--border-radius-lg)',
      border: '1px solid var(--border-color)',
      marginBottom: 'var(--spacing-4)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 'var(--spacing-4)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Avatar src={post.user?.profilePicture} name={post.user?.name} userId={post.user?._id} />
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '15px' }}>
              {post.user?.name}
            </div>
            <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <span>@{post.user?.username}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <button style={{ color: 'var(--text-secondary)' }} className="hover-scale">
          <EllipsisHorizontalIcon style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '0 var(--spacing-4) var(--spacing-4)', color: 'var(--text-primary)', fontSize: '16px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </div>

      {/* Image */}
      {post.image && (
        <div style={{ padding: '0 var(--spacing-4) var(--spacing-4)' }}>
          <img 
            src={post.image.url || post.image} 
            alt="Post content" 
            style={{ 
              width: '100%', 
              maxHeight: '500px', 
              objectFit: 'cover', 
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-color)'
            }} 
          />
        </div>
      )}

      {/* Footer Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--spacing-2) var(--spacing-4)',
        borderTop: '1px solid var(--border-color)',
        gap: 'var(--spacing-6)'
      }}>
        <button 
          onClick={handleLikeToggle}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: isLikedByMe ? 'var(--danger-color)' : 'var(--text-secondary)',
            padding: '8px 0',
            fontWeight: '500'
          }}
          className="hover-scale"
        >
          {isLikedByMe ? <HeartSolid style={{ width: '24px', height: '24px' }} /> : <HeartIcon style={{ width: '24px', height: '24px' }} />}
          {post.likesCount || (post.likes ? post.likes.length : 0)}
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-secondary)',
            padding: '8px 0',
            fontWeight: '500'
          }}
          className="hover-scale"
        >
          <ChatBubbleLeftIcon style={{ width: '24px', height: '24px' }} />
          {post.commentsCount || (post.comments ? post.comments.length : 0)}
        </button>

        <button 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-secondary)',
            padding: '8px 0',
            fontWeight: '500',
            marginLeft: 'auto'
          }}
          className="hover-scale"
        >
          <ShareIcon style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      {/* Comments Section Toggle */}
      {showComments && (
        <CommentSection post={post} />
      )}
    </div>
  );
};

export default PostCard;
