import React from 'react';

export function EmptyState({ 
  icon, title, description, buttonText, onButtonClick 
}: {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
        opacity: 0.5,
      }}>
        {icon}
      </div>
      <h3 style={{
        color: '#fff',
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
      }}>
        {title}
      </h3>
      <p style={{
        color: '#6B7280',
        fontSize: '14px',
        maxWidth: '320px',
        lineHeight: 1.6,
        marginBottom: '24px',
      }}>
        {description}
      </p>
      {buttonText && (
        <button
          onClick={onButtonClick}
          style={{
            background: '#00D4FF',
            color: '#0A0F1E',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
