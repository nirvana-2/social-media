import { useState, useCallback } from 'react';
import usePostsStore from '../store/postsStore';
import { postsService } from '../services/postsService';
import { commentsService } from '../services/commentsService';
import { likesService } from '../services/likesService';
import useAuthStore from '../store/authStore';

export const usePosts = () => {
  const { posts, setPosts, addPost, updatePost, deletePost, likePost: storeLikePost, unlikePost: storeUnlikePost, addComment, removeComment, isLoading, setLoading, setError } = usePostsStore();
  const { user } = useAuthStore();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postsService.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [setPosts, setLoading, setError]);

  const createNewPost = async (content, imageFile) => {
    setLoading(true);
    try {
      const newPost = await postsService.createPost(content, imageFile);
      addPost(newPost);
      return newPost;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const like = async (postId) => {
    try {
      if (user) storeLikePost(postId, user._id);
      await likesService.likePost(postId);
    } catch (err) {
      setError('Failed to like post');
      // Revert optimism if needed
      if (user) storeUnlikePost(postId, user._id);
    }
  };

  const unlike = async (postId) => {
    try {
      if (user) storeUnlikePost(postId, user._id);
      await likesService.unlikePost(postId);
    } catch (err) {
      setError('Failed to unlike post');
      // Revert optimism
      if (user) storeLikePost(postId, user._id);
    }
  };

  const comment = async (postId, content) => {
    try {
      const newComment = await commentsService.createComment(postId, content);
      addComment(postId, newComment);
      return newComment;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    }
  };

  return {
    posts,
    isLoading,
    fetchPosts,
    createNewPost,
    like,
    unlike,
    comment
  };
};
