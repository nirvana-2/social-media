import React, { useState, useRef } from 'react';
import useAuthStore from '../../store/authStore';
import Avatar from '../Common/Avatar';
import Button from '../Common/Button';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePosts } from '../../hooks/usePosts';

const PostCreate = () => {
  const { user } = useAuthStore();
  const { createNewPost, isLoading } = usePosts();
  
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    
    try {
      await createNewPost(content, image);
      setContent('');
      removeImage();
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--border-radius-lg)',
      border: '1px solid var(--border-color)',
      padding: 'var(--spacing-4)',
      marginBottom: 'var(--spacing-6)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
        <Avatar src={user?.profilePicture} name={user?.name} />
        
        <div style={{ flex: 1 }}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: '80px',
              resize: 'none',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '18px',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              paddingTop: '8px'
            }}
          />

          {imagePreview && (
            <div style={{ position: 'relative', marginTop: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <img 
                src={imagePreview} 
                alt="Upload preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: 'var(--border-radius-md)', 
                  objectFit: 'cover' 
                }} 
              />
              <button 
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '4px'
                }}
              >
                <XMarkIcon style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: 'var(--spacing-3)',
            marginTop: 'var(--spacing-2)'
          }}>
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: '500' }}
              className="hover-scale"
            >
              <PhotoIcon style={{ width: '24px', height: '24px' }} />
              Photo
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
            />

            <Button 
              onClick={handleSubmit} 
              disabled={(!content.trim() && !image) || isLoading}
              loading={isLoading}
              size="sm"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;
