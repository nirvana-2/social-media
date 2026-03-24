import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';
import Toast from '../Common/Toast';
import useAuthStore from '../../store/authStore';
import { socketService } from '../../services/socketService';
import { useEffect } from 'react';

const MainLayout = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    // Ensure socket tries to connect when layout mounts if user exists
    if (user && user._id) {
      socketService.connect(user._id);
    }
    return () => {
      // Keep running usually, or maybe disconnect if user logs out - handled in useAuth hook
    };
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ display: 'flex', flex: 1, maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <Sidebar />
        
        <main style={{
          flex: 1,
          padding: 'var(--spacing-6)',
          maxWidth: '1000px', // constrain middle content
          margin: '0 auto',
          width: '100%',
          overflowY: 'auto',
          height: 'calc(100vh - var(--navbar-height))'
        }}>
          <Outlet />
        </main>
      </div>
      
      {/* Global Modals/Toasts */}
      <Toast />
    </div>
  );
};

export default MainLayout;
