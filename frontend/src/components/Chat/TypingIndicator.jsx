import React from 'react';

const TypingIndicator = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '8px 0' }}>
      <div style={{
        backgroundColor: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        padding: '12px 16px',
        borderRadius: '16px 16px 16px 4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        width: 'fit-content'
      }}>
        <style>
          {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            .dot {
              width: 8px;
              height: 8px;
              background-color: var(--text-secondary);
              border-radius: 50%;
              animation: bounce 1.4s infinite ease-in-out both;
            }
            .dot-1 { animation-delay: -0.32s; }
            .dot-2 { animation-delay: -0.16s; }
          `}
        </style>
        <div className="dot dot-1" />
        <div className="dot dot-2" />
        <div className="dot" />
      </div>
    </div>
  );
};

export default TypingIndicator;
