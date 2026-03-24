import React, { useState, useEffect } from 'react';
import Avatar from '../Common/Avatar';
import useAuthStore from '../../store/authStore';
import { usePosts } from '../../hooks/usePosts';
import { commentsService } from '../../services/commentsService';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../Common/LoadingSpinner';

const CommentSection = ({ post }) => {
  const { user } = useAuthStore();
  const { comment } = usePosts();
  
  const [commentsList, setCommentsList] = useState([]);
  const [content, setContent] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoadingComments(true);
      try {
        const data = await commentsService.getComments(post.id);
        setCommentsList(data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    
    if (post.id) {
      fetchComments();
    }
  }, [post.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await comment(post.id, content);
      setCommentsList([...commentsList, newComment]);
      setContent('');
    } catch (error) {
      console.error('Submit comment error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--surface-color-secondary)', 
      padding: 'var(--spacing-4)',
      borderBottomLeftRadius: 'var(--border-radius-lg)',
      borderBottomRightRadius: 'var(--border-radius-lg)',
      borderTop: '1px solid var(--border-color)'
    }}>
      
      {/* List of comments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        {isLoadingComments ? (
          <LoadingSpinner />
        ) : commentsList.length === 0 ? (
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>No comments yet. Be the first!</div>
        ) : (
          commentsList.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Avatar src={c.user?.profilePicture} name={c.user?.name} size="sm" />
              <div style={{ flex: 1 }}>
                <div style={{ 
                  backgroundColor: 'var(--surface-color)', 
                  padding: '10px 14px',
                  borderRadius: '0 12px 12px 12px',
                  border: '1px solid var(--border-color)',
                  display: 'inline-block'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {c.user?.name}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    {c.content}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginLeft: '6px' }}>
                  {formatDate(c.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
        <Avatar src={user?.profilePicture} name={user?.name} size="sm" />
        <input 
          type="text" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 'var(--border-radius-full)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)',
            fontSize: '14px'
          }}
        />
        <button 
          type="submit" 
          disabled={!content.trim() || isSubmitting}
          style={{
            fontWeight: '600',
            color: content.trim() && !isSubmitting ? 'var(--primary-color)' : 'var(--text-secondary)',
            cursor: content.trim() && !isSubmitting ? 'pointer' : 'not-allowed'
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
