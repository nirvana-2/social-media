import { useState, useCallback } from 'react';
import { usersService } from '../services/usersService';
import { followService } from '../services/followService';

export const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    setIsLoading(true);
    try {
      const data = await usersService.getUserProfile(userId);
      setProfileData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const follow = async (userId) => {
    try {
      await followService.followUser(userId);
      // Optimistically update
      setProfileData(prev => prev ? {
        ...prev, 
        followersCount: (prev.followersCount || 0) + 1,
        isFollowing: true
      } : prev);
    } catch (err) {
      setError('Failed to follow user');
    }
  };

  const unfollow = async (userId) => {
    try {
      await followService.unfollowUser(userId);
      setProfileData(prev => prev ? {
        ...prev, 
        followersCount: Math.max((prev.followersCount || 0) - 1, 0),
        isFollowing: false
      } : prev);
    } catch (err) {
      setError('Failed to unfollow user');
    }
  };

  return {
    profileData,
    isLoading,
    error,
    fetchProfile,
    follow,
    unfollow
  };
};
