import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { currentTheme, changeTheme, availableThemes } = useTheme();

  // Theme configuration
  const themeConfig = useMemo(() => ({
    calm: {
      label: 'Calm',
      emoji: '🌿',
      description: 'Soft, muted colors',
      ariaLabel: 'Switch to Calm theme - soft, muted colors with a relaxing feel'
    },
    energetic: {
      label: 'Energetic',
      emoji: '⚡',
      description: 'Bright, lively colors',
      ariaLabel: 'Switch to Energetic theme - bright, lively colors with a playful feel'
    },
    intense: {
      label: 'Intense',
      emoji: '🔥',
      description: 'Dark, bold colors',
      ariaLabel: 'Switch to Intense theme - dark, saturated colors with a bold, high-impact feel'
    }
  }), []);

  // Helper function to get CSS variable
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

  // Get dynamic styles based on current theme
  const styles = useMemo(() => {
    return {
      container: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      },
      button: (theme, isActive) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        padding: '0.5rem 0.75rem',
        minWidth: '70px',
        minHeight: '60px',
        borderRadius: '12px',
        border: `2px solid ${isActive ? getCSSVar('--theme-accent', '#a8c5d9') : getCSSVar('--theme-border', '#d1d9e0')}`,
        backgroundColor: isActive 
          ? getCSSVar('--theme-accent-light', '#d4e4f0')
          : getCSSVar('--theme-button-secondary', '#e8edf2'),
        color: isActive 
          ? getCSSVar('--theme-text-primary', '#2c3e50')
          : getCSSVar('--theme-text-secondary', '#5a6c7d'),
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: isActive ? '600' : '500',
        fontSize: '0.85rem',
        position: 'relative',
        boxShadow: isActive 
          ? `0 4px 12px ${getCSSVar('--theme-shadow', 'rgba(44, 62, 80, 0.15)')}`
          : 'none'
      }),
      emoji: {
        fontSize: '1.5rem',
        lineHeight: '1'
      },
      label: {
        fontSize: '0.75rem',
        lineHeight: '1.2',
        textAlign: 'center'
      },
      activeIndicator: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: getCSSVar('--theme-accent', '#a8c5d9'),
        boxShadow: `0 0 4px ${getCSSVar('--theme-accent', '#a8c5d9')}`
      }
    };
  }, [currentTheme]);

  const handleThemeChange = (theme) => {
    changeTheme(theme);
    // Announce theme change for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = `Theme changed to ${themeConfig[theme].label}`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return (
    <div style={styles.container} role="group" aria-label="Theme selection">
      {availableThemes.map((theme) => {
        const config = themeConfig[theme];
        const isActive = currentTheme === theme;
        
        return (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            style={styles.button(theme, isActive)}
            aria-label={config.ariaLabel}
            aria-pressed={isActive}
            title={`${config.label} - ${config.description}`}
            onMouseEnter={(e) => {
              if (!isActive) {
                const shadow = getCSSVar('--theme-shadow', 'rgba(0, 0, 0, 0.1)');
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${shadow}`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isActive && <span style={styles.activeIndicator} aria-hidden="true" />}
            <span style={styles.emoji} aria-hidden="true">{config.emoji}</span>
            <span style={styles.label}>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
