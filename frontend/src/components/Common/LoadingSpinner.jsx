import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  const spinnerStyle = {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    border: '3px solid var(--border-color)',
    borderTopColor: 'var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const containerStyle = fullPage ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999
  } : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={spinnerStyle} />
      </div>
    </>
  );
};

export default LoadingSpinner;
