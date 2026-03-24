import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';
import Avatar from './Avatar';
import { MagnifyingGlassIcon, BellIcon, MoonIcon, SunIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      height: 'var(--navbar-height)',
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 100,
      padding: '0 var(--spacing-6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand */}
      <Link to="/" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>
        Socialize
      </Link>

      {/* Search Bar - Center */}
      <div style={{ flex: 1, maxWidth: '500px', margin: '0 24px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '12px',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)'
        }}>
          <MagnifyingGlassIcon style={{ width: '20px', height: '20px' }} />
        </div>
        <input 
          type="text" 
          placeholder="Search for people, posts, spaces..." 
          style={{
            width: '100%',
            padding: '10px 16px 10px 42px',
            backgroundColor: 'var(--surface-color-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-full)',
            color: 'var(--text-primary)',
            fontSize: '15px'
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <button onClick={toggleTheme} className="hover-scale" style={{ color: 'var(--text-secondary)' }}>
          {theme === 'dark' ? <SunIcon style={{ width: '28px', height: '28px' }} /> : <MoonIcon style={{ width: '28px', height: '28px' }} />}
        </button>

        <button className="hover-scale" style={{ position: 'relative', color: 'var(--text-secondary)' }}>
          <BellIcon style={{ width: '28px', height: '28px' }} />
          {/* Notification Badge */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '10px',
            height: '10px',
            backgroundColor: 'var(--danger-color)',
            borderRadius: '50%',
            border: '2px solid var(--surface-color)'
          }} />
        </button>

        <div style={{ position: 'relative' }}>
          <Avatar 
            src={user?.profilePicture} 
            name={user?.name || 'User'} 
            size="sm" 
            onClick={() => setShowDropdown(!showDropdown)} 
            className="hover-scale"
          />

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '220px',
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px 0',
              zIndex: 110,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{user?.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>@{user?.username}</div>
              </div>

              <Link to={`/profile/${user?._id}`} onClick={() => setShowDropdown(false)} style={{
                padding: '10px 16px',
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '500',
                fontSize: '15px'
              }} className="hover-scale">
                Profile
              </Link>

              <button 
                onClick={handleLogout} 
                style={{
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--danger-color)',
                  fontWeight: '600',
                  fontSize: '15px',
                  width: '100%',
                  textAlign: 'left'
                }} 
                className="hover-scale"
              >
                <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px' }} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
