import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import ProfileHeader from './ProfileHeader';
import UserPosts from './UserPosts';
import FollowersList from './FollowersList';
import FollowingList from './FollowingList';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProfilePage = () => {
  const { userId } = useParams();
  const { fetchProfile, profileData, isLoading, error } = useProfile();
  const [activeTab, setActiveTab] = useState('posts'); // posts, followers, following

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
      setActiveTab('posts');
    }
  }, [userId, fetchProfile]);

  if (isLoading && !profileData) return <LoadingSpinner fullPage />;
  if (error) return <div style={{ color: 'var(--danger-color)', textAlign: 'center', padding: '2rem' }}>{error}</div>;
  if (!profileData) return <div style={{ textAlign: 'center', padding: '2rem' }}>Profile not found</div>;

  const tabs = [
    { id: 'posts', label: 'Posts', count: profileData.postsCount || 0 },
    { id: 'followers', label: 'Followers', count: profileData.followersCount || 0 },
    { id: 'following', label: 'Following', count: profileData.followingCount || 0 }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: 'var(--spacing-8)' }}>
      <ProfileHeader profileData={profileData} />
      
      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: 'var(--spacing-6)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '16px 0',
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent',
              fontSize: '16px',
              transition: 'all 0.2s',
              backgroundColor: 'transparent'
            }}
          >
            {tab.label} <span style={{ color: 'var(--text-secondary)', fontSize: '14px', marginLeft: '4px' }}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '300px' }}>
        {activeTab === 'posts' && <UserPosts userId={userId} />}
        {activeTab === 'followers' && <FollowersList userId={userId} />}
        {activeTab === 'following' && <FollowingList userId={userId} />}
      </div>
    </div>
  );
};

export default ProfilePage;
