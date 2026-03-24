import React, { useEffect } from 'react';
import useUiStore from '../../store/uiStore';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = () => {
  const { notifications = [], removeNotification } = useUiStore();

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {Array.isArray(notifications) && notifications.map(notif => (
        <ToastItem
          key={notif.id}
          notification={notif}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ notification, onClose }) => {
  const { type = 'info', message, duration = 3000 } = notification;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: { icon: CheckCircleIcon, color: 'var(--success-color)' },
    error: { icon: XCircleIcon, color: 'var(--danger-color)' },
    warning: { icon: ExclamationTriangleIcon, color: '#FF9500' },
    info: { icon: InformationCircleIcon, color: 'var(--primary-color)' }
  };

  const { icon: Icon, color } = config[type] || config.info;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--surface-color)',
      borderLeft: `4px solid ${color}`,
      padding: '12px 16px',
      borderRadius: 'var(--border-radius-md)',
      boxShadow: 'var(--shadow-md)',
      minWidth: '300px',
      maxWidth: '400px',
      justifyContent: 'space-between',
      animation: 'slideIn 0.3s ease forwards'
    }}>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <Icon style={{ width: '24px', height: '24px', color }} />
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
          {message}
        </span>
      </div>
      <button onClick={onClose} style={{ color: 'var(--text-secondary)', marginLeft: '12px' }}>
        <XMarkIcon style={{ width: '20px', height: '20px' }} />
      </button>
    </div>
  );
};

export default Toast;