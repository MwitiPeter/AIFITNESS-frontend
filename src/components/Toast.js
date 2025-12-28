import React, { useEffect, useState, useMemo } from 'react';
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

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { currentTheme, themeVersion } = useTheme();

  const styles = useMemo(() => {
    const cardBg = getCSSVar('--theme-card-bg', '#ffffff');
    const textPrimary = getCSSVar('--theme-text-primary', '#2c3e50');
    const border = getCSSVar('--theme-border', '#d1d9e0');
    const shadow = getCSSVar('--theme-shadow', 'rgba(0, 0, 0, 0.1)');
    const accent = getCSSVar('--theme-accent', '#a8c5d9');

    const typeColors = {
      success: { bg: '#10b981', icon: '✅' },
      error: { bg: '#ef4444', icon: '❌' },
      info: { bg: accent, icon: 'ℹ️' },
      warning: { bg: '#f59e0b', icon: '⚠️' }
    };

    const colors = typeColors[type] || typeColors.success;

    return {
      container: {
        position: 'relative',
        maxWidth: '400px',
        minWidth: '300px',
        backgroundColor: cardBg,
        color: textPrimary,
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        boxShadow: `0 8px 32px ${shadow}`,
        border: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        pointerEvents: isVisible ? 'auto' : 'none'
      },
      icon: {
        fontSize: '1.5rem',
        flexShrink: 0
      },
      message: {
        flex: 1,
        fontSize: '0.95rem',
        fontWeight: '500',
        lineHeight: '1.5',
        margin: 0
      },
      closeButton: {
        background: 'none',
        border: 'none',
        color: textPrimary,
        fontSize: '1.25rem',
        cursor: 'pointer',
        padding: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
        opacity: 0.7
      },
      indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '4px',
        backgroundColor: colors.bg,
        borderRadius: '0 0 12px 12px',
        width: '100%',
        animation: 'shrink linear forwards',
        animationDuration: `${duration}ms`
      }
    };
  }, [currentTheme, themeVersion, type, isVisible, duration]);

  useEffect(() => {
    // Add animation if not exists
    if (typeof document !== 'undefined') {
      const styleId = 'toast-animations';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `;
        document.head.appendChild(style);
      }
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  return (
    <div style={styles.container} role="alert" aria-live="polite">
      <span style={styles.icon}>{typeIcons[type] || typeIcons.success}</span>
      <p style={styles.message}>{message}</p>
      <button
        style={styles.closeButton}
        onClick={handleClose}
        aria-label="Close notification"
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        ×
      </button>
      <div style={styles.indicator}></div>
    </div>
  );
};

// Toast Manager Component
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Global function to show toast
    window.showToast = (message, type = 'success', duration = 3000) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 10000, pointerEvents: 'none' }}>
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ 
            marginBottom: index < toasts.length - 1 ? '0.75rem' : '0',
            pointerEvents: 'auto'
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;

