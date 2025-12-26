import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

// Helper function to get CSS variable with fallback
const getCSSVar = (varName, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(varName).trim();
    return value || fallback;
  } catch {
    return fallback;
  }
};

const ThemeToggle = () => {
  const { currentTheme, changeTheme, resetToAutoTheme, availableThemes, manualOverride } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get dynamic styles based on current theme
  const dynamicStyles = useMemo(() => ({
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: getCSSVar('--b2', '#2d2d2d'),
      color: getCSSVar('--bc', '#ffffff'),
      border: `1px solid ${getCSSVar('--b3', '#404040')}`,
      padding: '0.5rem 0.75rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
      minHeight: '44px',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      backgroundColor: getCSSVar('--b1', '#1a1a1a'),
      border: `1px solid ${getCSSVar('--b3', '#404040')}`,
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      minWidth: '200px',
      zIndex: 1000,
      overflow: 'hidden'
    },
    dropdownTitle: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: getCSSVar('--bc', '#ffffff')
    },
    overrideBadge: {
      fontSize: '0.7rem',
      padding: '0.2rem 0.5rem',
      backgroundColor: getCSSVar('--a', '#FFD700'),
      color: getCSSVar('--ac', '#000000'),
      borderRadius: '4px',
      fontWeight: '600'
    },
    themeOption: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left',
      color: getCSSVar('--bc', '#ffffff'),
      fontSize: '0.95rem'
    },
    themeOptionActive: {
      backgroundColor: `${getCSSVar('--a', '#FFD700')}20`,
      fontWeight: '600'
    },
    checkmark: {
      color: getCSSVar('--su', '#10b981'),
      fontWeight: 'bold'
    },
    resetButton: {
      width: '100%',
      padding: '0.75rem 1rem',
      marginTop: '0.5rem',
      backgroundColor: getCSSVar('--b2', '#2d2d2d'),
      color: getCSSVar('--bc', '#ffffff'),
      border: `1px solid ${getCSSVar('--b3', '#404040')}`,
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    }
  }), [currentTheme]); // Recompute when theme changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const themeLabels = {
    beginner: '🌿 Calm',
    intermediate: '⚡ Energetic',
    advanced: '🔥 Intense'
  };

  const handleThemeSelect = (theme) => {
    changeTheme(theme);
    setIsOpen(false);
  };

  const handleReset = () => {
    resetToAutoTheme();
    setIsOpen(false);
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={dynamicStyles.button}
        aria-label="Change theme"
        title="Daily Experience Theme"
      >
        <span style={styles.icon}>🎨</span>
        <span style={styles.label}>{themeLabels[currentTheme] || 'Theme'}</span>
        <span style={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={dynamicStyles.dropdown}>
          <div style={{...styles.dropdownHeader, borderBottom: `1px solid ${getCSSVar('--b3', '#404040')}`}}>
            <span style={dynamicStyles.dropdownTitle}>Daily Experience Theme</span>
            {manualOverride && (
              <span style={dynamicStyles.overrideBadge}>Manual</span>
            )}
          </div>
          
          <div style={styles.themeList}>
            {availableThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeSelect(theme)}
                style={{
                  ...dynamicStyles.themeOption,
                  ...(currentTheme === theme ? dynamicStyles.themeOptionActive : {})
                }}
              >
                <span style={styles.themeIcon}>{themeLabels[theme].split(' ')[0]}</span>
                <span style={styles.themeName}>{themeLabels[theme].split(' ')[1]}</span>
                {currentTheme === theme && (
                  <span style={dynamicStyles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>

          {manualOverride && (
            <button
              onClick={handleReset}
              style={dynamicStyles.resetButton}
            >
              🔄 Reset to Auto
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block'
  },
  icon: {
    fontSize: '1.1rem'
  },
  label: {
    display: 'inline-block'
  },
  arrow: {
    fontSize: '0.7rem',
    marginLeft: '0.25rem'
  },
  dropdownHeader: {
    padding: '0.75rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  themeList: {
    padding: '0.5rem'
  },
  themeIcon: {
    fontSize: '1.2rem'
  },
  themeName: {
    flex: 1
  }
};

export default ThemeToggle;

