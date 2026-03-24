import api from './api';

export const followService = {
  followUser: async (userId) => {
    const response = await api.post(`/follow/${userId}/follow`);
    return response.data;
  },

  unfollowUser: async (userId) => {
    const response = await api.post(`/follow/${userId}/unfollow`);
    return response.data;
  },

  getFollowers: async (userId) => {
    const response = await api.get(`/follow/${userId}/followers`);
    return response.data;
  },

  getFollowing: async (userId) => {
    const response = await api.get(`/follow/${userId}/following`);
    return response.data;
  }
};
