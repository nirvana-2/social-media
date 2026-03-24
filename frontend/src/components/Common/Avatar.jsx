import React from 'react';
import { useNavigate } from 'react-router-dom';

const Avatar = ({
  src,
  userId,
  name,
  size = 'md', // sm, md, lg
  isOnline = false,
  onClick,
  className = ''
}) => {
  const navigate = useNavigate();

  const sizes = {
    sm: { width: '32px', height: '32px', fontSize: '14px' },
    md: { width: '48px', height: '48px', fontSize: '18px' },
    lg: { width: '80px', height: '80px', fontSize: '28px' }
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const initials = name ? name.split(' ').map(n => n.charAt(0).toUpperCase()).slice(0, 2).join('') : '?';

  return (
    <div 
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        cursor: onClick || userId ? 'pointer' : 'default',
        ...sizes[size]
      }}
      onClick={handleClick}
      className={`avatar-container ${className}`}
    >
      {src ? (
        <img 
          src={src} 
          alt={name || 'Avatar'} 
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '50%', 
            objectFit: 'cover',
            border: '2px solid var(--surface-color)',
            boxShadow: 'var(--shadow-sm)'
          }} 
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-color)',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          border: '2px solid var(--surface-color)'
        }}>
          {initials}
        </div>
      )}
      
      {isOnline && (
        <span style={{
          position: 'absolute',
          bottom: '2%',
          right: '2%',
          width: size === 'sm' ? '8px' : '12px',
          height: size === 'sm' ? '8px' : '12px',
          backgroundColor: 'var(--success-color)',
          borderRadius: '50%',
          border: '2px solid var(--surface-color)'
        }} />
      )}
    </div>
  );
};

export default Avatar;
