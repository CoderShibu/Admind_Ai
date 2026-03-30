import React from 'react';

export function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '20px',
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{
        height: '12px',
        width: '60%',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '6px',
        marginBottom: '12px',
      }}/>
      <div style={{
        height: '32px',
        width: '40%',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '6px',
      }}/>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{
      height: '48px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '8px',
      marginBottom: '8px',
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    }}/>
  );
}

export function SkeletonInsightCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '20px',
      height: '140px',
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{
        height: '10px', width: '30%',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '4px', marginBottom: '10px',
      }}/>
      <div style={{
        height: '14px', width: '80%',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '4px', marginBottom: '8px',
      }}/>
      <div style={{
        height: '10px', width: '100%',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '4px', marginBottom: '6px',
      }}/>
      <div style={{
        height: '10px', width: '70%',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '4px',
      }}/>
    </div>
  );
}
