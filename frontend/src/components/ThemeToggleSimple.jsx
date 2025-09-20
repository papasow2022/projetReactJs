// src/components/ThemeToggleSimple.jsx
import React from 'react';

const ThemeToggleSimple = ({ variant = 'button', size = 'md' }) => {
  return (
    <button 
      style={{
        padding: size === 'sm' ? '0.25rem 0.5rem' : '0.5rem 1rem',
        border: '1px solid #dee2e6',
        backgroundColor: 'white',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: size === 'sm' ? '0.8rem' : '0.9rem'
      }}
    >
      🌙 Thème
    </button>
  );
};

export default ThemeToggleSimple;