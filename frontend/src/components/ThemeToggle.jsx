// src/components/ThemeToggle.jsx
import React, { useState } from 'react';
import { useTheme, useThemeColors } from '../contexts/ThemeContext';
import { 
  BiSun, 
  BiMoon, 
  BiDesktop, 
  BiCheck 
} from 'react-icons/bi';

const ThemeToggle = ({ variant = 'dropdown', size = 'md' }) => {
  const { theme, isSystemTheme, toggleTheme, setSystemTheme, setLightTheme, setDarkTheme } = useTheme();
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const iconSizes = {
    sm: '16px',
    md: '20px',
    lg: '24px'
  };

  const getThemeIcon = (themeName) => {
    switch (themeName) {
      case 'light': return <BiSun size={iconSizes[size]} />;
      case 'dark': return <BiMoon size={iconSizes[size]} />;
      case 'system': return <BiDesktop size={iconSizes[size]} />;
      default: return <BiSun size={iconSizes[size]} />;
    }
  };

  const getThemeLabel = (themeName) => {
    switch (themeName) {
      case 'light': return 'Clair';
      case 'dark': return 'Sombre';
      case 'system': return 'Système';
      default: return 'Clair';
    }
  };

  if (variant === 'button') {
    return (
      <button
        className={`btn btn-outline-secondary ${sizeClasses[size]} d-flex align-items-center gap-2`}
        onClick={toggleTheme}
        style={{
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = colors.hover;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        {getThemeIcon(theme)}
        <span className="d-none d-md-inline">{getThemeLabel(theme)}</span>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="dropdown" style={{ position: 'relative' }}>
        <button
          className={`btn btn-outline-secondary ${sizeClasses[size]} d-flex align-items-center gap-2`}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.hover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          {getThemeIcon(theme)}
          <span className="d-none d-md-inline">{getThemeLabel(theme)}</span>
          <span style={{ fontSize: '12px' }}>▼</span>
        </button>

        {isOpen && (
          <>
            {/* Overlay pour fermer le dropdown */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999
              }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu dropdown */}
            <div
              className="dropdown-menu show"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 1000,
                minWidth: '160px',
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                boxShadow: `0 4px 12px ${colors.shadow}`,
                padding: '8px 0'
              }}
            >
              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => {
                  setLightTheme();
                  setIsOpen(false);
                }}
                style={{
                  color: colors.text,
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  width: '100%',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <BiSun size={iconSizes[size]} />
                <span>Clair</span>
                {theme === 'light' && !isSystemTheme && (
                  <BiCheck className="ms-auto" style={{ color: colors.primary }} />
                )}
              </button>

              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => {
                  setDarkTheme();
                  setIsOpen(false);
                }}
                style={{
                  color: colors.text,
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  width: '100%',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <BiMoon size={iconSizes[size]} />
                <span>Sombre</span>
                {theme === 'dark' && !isSystemTheme && (
                  <BiCheck className="ms-auto" style={{ color: colors.primary }} />
                )}
              </button>

              <div style={{ borderTop: `1px solid ${colors.border}`, margin: '4px 0' }} />

              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => {
                  setSystemTheme();
                  setIsOpen(false);
                }}
                style={{
                  color: colors.text,
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  width: '100%',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <BiDesktop size={iconSizes[size]} />
                <span>Système</span>
                {isSystemTheme && (
                  <BiCheck className="ms-auto" style={{ color: colors.primary }} />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <div className="form-check form-switch d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="themeSwitch"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          style={{
            backgroundColor: theme === 'dark' ? colors.primary : colors.border,
            borderColor: colors.border
          }}
        />
        <label 
          className="form-check-label d-flex align-items-center gap-2" 
          htmlFor="themeSwitch"
          style={{ color: colors.text, cursor: 'pointer' }}
        >
          {getThemeIcon(theme)}
          <span className="d-none d-md-inline">{getThemeLabel(theme)}</span>
        </label>
      </div>
    );
  }

  return null;
};

export default ThemeToggle;
 
 
 
 
 
 
 
 
 