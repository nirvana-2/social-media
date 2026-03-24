import api from './api';

export const postsService = {
  getAllPosts: async () => {
    const response = await api.get('/posts');
    const posts = response.data.posts || response.data;
    return Array.isArray(posts) ? posts : [];
  },

  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (content, image) => {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (image) formData.append('image', image);

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  updatePost: async (postId, content, image) => {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (image) formData.append('image', image);
    const response = await api.put(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  }
};