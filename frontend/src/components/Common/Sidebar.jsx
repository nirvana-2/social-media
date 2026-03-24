import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { HomeIcon, ChatBubbleLeftRightIcon, UserIcon, Cog6ToothIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, ChatBubbleLeftRightIcon as ChatSolid, UserIcon as UserSolid } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const { user } = useAuthStore();

  const links = [
    { name: 'Feed', path: '/', icon: HomeIcon, activeIcon: HomeSolid },
    { name: 'Chat', path: '/chat', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolid },
    { name: 'Profile', path: `/profile/${user?._id}`, icon: UserIcon, activeIcon: UserSolid },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - var(--navbar-height))',
      position: 'sticky',
      top: 'var(--navbar-height)',
      borderRight: '1px solid var(--border-color)',
      padding: 'var(--spacing-6) var(--spacing-4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-color)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => `hover-scale`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-4)',
              padding: 'var(--spacing-3) var(--spacing-4)',
              borderRadius: 'var(--border-radius-full)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? '700' : '500',
              backgroundColor: isActive ? 'var(--surface-color-secondary)' : 'transparent',
              transition: 'all 0.2s',
              fontSize: '18px'
            })}
          >
            {({ isActive }) => {
              const Icon = isActive ? link.activeIcon : link.icon;
              return (
                <>
                  <Icon style={{ width: '28px', height: '28px' }} />
                  {link.name}
                </>
              );
            }}
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div style={{
          backgroundColor: 'var(--surface-color)',
          padding: 'var(--spacing-4)',
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Trending Topics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HashtagIcon style={{ width: '16px' }} /> ReactJS
            </span>
            <span style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HashtagIcon style={{ width: '16px' }} /> WebDevelopment
            </span>
          </div>
        </div>

        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          padding: 'var(--spacing-3) var(--spacing-4)',
          borderRadius: 'var(--border-radius-full)',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          fontSize: '16px'
        }} className="hover-scale">
          <Cog6ToothIcon style={{ width: '24px', height: '24px' }} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
