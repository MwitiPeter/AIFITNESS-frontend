import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

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

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  const { currentTheme, themeVersion } = useTheme();

  const styles = useMemo(() => {
    const bgPrimary = getCSSVar('--theme-bg-primary', '#f5f7fa');
    const textPrimary = getCSSVar('--theme-text-primary', '#2c3e50');
    const textSecondary = getCSSVar('--theme-text-secondary', '#5a6c7d');
    const accent = getCSSVar('--theme-accent', '#a8c5d9');

    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? 'calc(100vh - 70px)' : '200px',
        backgroundColor: fullScreen ? bgPrimary : 'transparent',
        padding: fullScreen ? '2rem' : '1rem',
        transition: 'background-color 0.3s ease'
      },
      spinnerContainer: {
        position: 'relative',
        width: '60px',
        height: '60px',
        marginBottom: '1.5rem'
      },
      spinner: {
        border: `4px solid ${getCSSVar('--theme-border', '#d1d9e0')}`,
        borderTop: `4px solid ${accent}`,
        borderRadius: '50%',
        width: '100%',
        height: '100%',
        animation: 'spin 1s linear infinite',
        transition: 'border-color 0.3s ease'
      },
      message: {
        marginTop: '0.5rem',
        color: textSecondary,
        fontSize: '1rem',
        fontWeight: '500',
        textAlign: 'center',
        transition: 'color 0.3s ease'
      },
      dots: {
        display: 'inline-block',
        animation: 'pulse 1.5s ease-in-out infinite'
      }
    };
  }, [currentTheme, themeVersion, fullScreen]);

  // Add CSS animations if not already added
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'loading-animations';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner} aria-label="Loading" role="status"></div>
      </div>
      <p style={styles.message}>
        {message}
        <span style={styles.dots}>...</span>
      </p>
    </div>
  );
};

export default Loading;
