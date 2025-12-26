import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { currentTheme, changeTheme, resetToAutoTheme, availableThemes, manualOverride } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        style={styles.button}
        aria-label="Change theme"
        title="Daily Experience Theme"
      >
        <span style={styles.icon}>🎨</span>
        <span style={styles.label}>{themeLabels[currentTheme] || 'Theme'}</span>
        <span style={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>Daily Experience Theme</span>
            {manualOverride && (
              <span style={styles.overrideBadge}>Manual</span>
            )}
          </div>
          
          <div style={styles.themeList}>
            {availableThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeSelect(theme)}
                style={{
                  ...styles.themeOption,
                  ...(currentTheme === theme ? styles.themeOptionActive : {})
                }}
              >
                <span style={styles.themeIcon}>{themeLabels[theme].split(' ')[0]}</span>
                <span style={styles.themeName}>{themeLabels[theme].split(' ')[1]}</span>
                {currentTheme === theme && (
                  <span style={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>

          {manualOverride && (
            <button
              onClick={handleReset}
              style={styles.resetButton}
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
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'hsl(var(--b2))',
    color: 'hsl(var(--bc))',
    border: '1px solid hsl(var(--b3))',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    minHeight: '44px',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    whiteSpace: 'nowrap'
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
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: 'hsl(var(--b1))',
    border: '1px solid hsl(var(--b3))',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    minWidth: '200px',
    zIndex: 1000,
    overflow: 'hidden'
  },
  dropdownHeader: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid hsl(var(--b3))',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropdownTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'hsl(var(--bc))'
  },
  overrideBadge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    backgroundColor: 'hsl(var(--a))',
    color: 'hsl(var(--ac))',
    borderRadius: '4px',
    fontWeight: '600'
  },
  themeList: {
    padding: '0.5rem'
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
    color: 'hsl(var(--bc))',
    fontSize: '0.95rem'
  },
  themeOptionActive: {
    backgroundColor: 'hsl(var(--a) / 0.1)',
    fontWeight: '600'
  },
  themeIcon: {
    fontSize: '1.2rem'
  },
  themeName: {
    flex: 1
  },
  checkmark: {
    color: 'hsl(var(--su))',
    fontWeight: 'bold'
  },
  resetButton: {
    width: '100%',
    padding: '0.75rem 1rem',
    marginTop: '0.5rem',
    backgroundColor: 'hsl(var(--b2))',
    color: 'hsl(var(--bc))',
    border: '1px solid hsl(var(--b3))',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  }
};

export default ThemeToggle;

