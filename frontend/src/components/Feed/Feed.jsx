import React, { useEffect } from 'react';
import { usePosts } from '../../hooks/usePosts';
import PostCreate from './PostCreate';
import PostCard from './PostCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const Feed = () => {
  const { posts = [], fetchPosts, isLoading, error } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading && posts.length === 0) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: 'var(--spacing-6)' }}>Home</h1>
        <PostCreate />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: 'var(--spacing-6)' }}>Home</h1>
        <div style={{ color: 'var(--danger-color)', textAlign: 'center', padding: 'var(--spacing-4)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: 'var(--spacing-6)' }}>Home</h1>
      <PostCreate />

      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
          No posts to show. Start following people or create a post!
        </div>
      )}
    </div>
  );
};

export default Feed;