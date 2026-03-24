import React, { useEffect, useState } from 'react';
import { postsService } from '../../services/postsService';
import PostCard from '../Feed/PostCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoading(true);
      try {
        // Since we don't have a specific GET /users/:id/posts in the requirements API list,
        // we'll fetch all posts and filter, OR we can pretend the backend supports filtering by ?userId=...
        // Assuming /posts supports ?userId query param:
        const response = await postsService.getAllPosts(); // This will return all, we filter client side for now
        const userPosts = response.filter(post => post.user?._id === userId || post.user === userId);
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to fetch user posts', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  
  if (posts.length === 0) return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
      This user hasn't posted anything yet.
    </div>
  );

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserPosts;
