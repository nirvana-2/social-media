import { create } from 'zustand';

const usePostsStore = create((set) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  
  updatePost: (postId, updates) => set((state) => ({
    posts: state.posts.map(post => post.id === postId ? { ...post, ...updates } : post)
  })),
  
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter(post => post.id !== postId)
  })),
  
  likePost: (postId, userId) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id === postId) {
        return { 
          ...post, 
          likes: [...(post.likes || []), userId],
          likesCount: (post.likesCount || 0) + 1 
        };
      }
      return post;
    })
  })),
  
  unlikePost: (postId, userId) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id === postId) {
        return { 
          ...post, 
          likes: (post.likes || []).filter(id => id !== userId),
          likesCount: Math.max((post.likesCount || 0) - 1, 0)
        };
      }
      return post;
    })
  })),
  
  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), comment],
          commentsCount: (post.commentsCount || 0) + 1
        };
      }
      return post;
    })
  })),
  
  removeComment: (postId, commentId) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: (post.comments || []).filter(c => c._id !== commentId),
          commentsCount: Math.max((post.commentsCount || 0) - 1, 0)
        };
      }
      return post;
    })
  })),

  setCurrentPost: (post) => set({ currentPost: post }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error: error ? error.toString() : null }),
}));

export default usePostsStore;
