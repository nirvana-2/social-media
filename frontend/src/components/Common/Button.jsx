import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary', // primary, secondary, danger, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: 'var(--border-radius-md)',
    transition: 'all 0.2s',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary-color)',
      color: '#FFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      backgroundColor: 'var(--danger-color)',
      color: '#FFF',
      border: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none',
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '10px 16px', fontSize: '16px' },
    lg: { padding: '14px 24px', fontSize: '18px' }
  };

  if (disabled || loading) {
    baseStyles.opacity = 0.6;
    baseStyles.cursor = 'not-allowed';
  } else {
    baseStyles.cursor = 'pointer';
  }

  const combinedStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button
      type={type}
      style={combinedStyles}
      onClick={disabled || loading ? undefined : onClick}
      className={`hover-scale ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}>
          {/* Simple CSS spinner icon */}
          <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%' }}></div>
        </span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
