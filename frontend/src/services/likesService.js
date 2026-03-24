import api from './api';

export const likesService = {
  likePost: async (postId) => {
    const response = await api.post(`/likes/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId) => {
    const response = await api.post(`/likes/${postId}/unlike`);
    return response.data;
  },

  getLikes: async (postId) => {
    const response = await api.get(`/likes/${postId}/likes`);
    return response.data;
  }
};
