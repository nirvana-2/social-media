import api from './api';

export const commentsService = {
  getComments: async (postId) => {
    const response = await api.get(`/comments/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId, content) => {
    const response = await api.post(`/comments/${postId}/comments`, { content });
    return response.data;
  },

  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};
