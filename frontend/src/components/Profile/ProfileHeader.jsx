import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';
import Avatar from '../Common/Avatar';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import { formatDate } from '../../utils/formatDate';
import { CalendarIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';
import { usersService } from '../../services/usersService';

const ProfileHeader = ({ profileData }) => {
  const { user, updateProfile: updateLocalStore } = useAuthStore();
  const { follow, unfollow } = useProfile();
  
  const isOwnProfile = user && user._id === profileData._id;
  const isFollowing = profileData.isFollowing;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit State
  const [editForm, setEditForm] = useState({
    name: profileData.name || '',
    bio: profileData.bio || '',
    location: profileData.location || '',
    website: profileData.website || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollow(profileData._id);
    } else {
      follow(profileData._id);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await usersService.updateProfile(editForm);
      updateLocalStore(updated.user); // update zustand
      // Assuming parent refetches or we do optimistic UI
      setIsEditModalOpen(false);
      window.location.reload(); // simple way to refresh data
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--border-radius-lg)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      marginBottom: 'var(--spacing-6)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Cover Image */}
      <div style={{
        height: '200px',
        width: '100%',
        backgroundColor: profileData.coverPicture ? 'transparent' : 'var(--border-color)',
        backgroundImage: profileData.coverPicture ? `url(${profileData.coverPicture})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />

      {/* Info Section */}
      <div style={{ padding: '0 var(--spacing-6) var(--spacing-6)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ marginTop: '-60px' }}>
            <Avatar 
              src={profileData.profilePicture} 
              name={profileData.name} 
              size="lg" 
              style={{ border: '4px solid var(--surface-color)', backgroundColor: 'var(--surface-color)' }}
            />
          </div>
          
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            {isOwnProfile ? (
              <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
            ) : (
              <Button 
                variant={isFollowing ? 'secondary' : 'primary'} 
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-3)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', lineHeight: 1.2 }}>{profileData.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>@{profileData.username}</p>
        </div>

        {profileData.bio && (
          <div style={{ marginTop: 'var(--spacing-3)', fontSize: '15px', color: 'var(--text-primary)' }}>
            {profileData.bio}
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-3)', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '14px' }}>
          {profileData.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPinIcon style={{ width: '18px' }} /> {profileData.location}
            </span>
          )}
          {profileData.website && (
            <a href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)' }}>
              <LinkIcon style={{ width: '18px' }} /> {profileData.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarIcon style={{ width: '18px' }} /> Joined {formatDate(profileData.createdAt)}
          </span>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Name</label>
            <input 
              value={editForm.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--surface-color-secondary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Bio</label>
            <textarea 
              value={editForm.bio} 
              onChange={e => setEditForm({...editForm, bio: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '80px', background: 'var(--surface-color-secondary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Location</label>
            <input 
              value={editForm.location} 
              onChange={e => setEditForm({...editForm, location: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--surface-color-secondary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Website</label>
            <input 
              value={editForm.website} 
              onChange={e => setEditForm({...editForm, website: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--surface-color-secondary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} loading={isSaving}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
