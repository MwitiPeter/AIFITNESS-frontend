import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Available themes
const THEMES = {
  calm: 'calm',
  energetic: 'energetic',
  intense: 'intense'
};

const DEFAULT_THEME = 'calm';

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const [themeVersion, setThemeVersion] = useState(0); // Increment to force re-renders

  // Load saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    } else {
      // Set default theme if none saved
      setCurrentTheme(DEFAULT_THEME);
      localStorage.setItem('selectedTheme', DEFAULT_THEME);
    }
  }, []);

  // Apply theme to document with smooth transitions
  useEffect(() => {
    if (currentTheme) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Add transition class to enable smooth theme changes
        document.documentElement.classList.add('theme-transition');
        document.body.classList.add('theme-transition');
        
        // Set theme attribute
        document.documentElement.setAttribute('data-theme', currentTheme);
        document.body.setAttribute('data-theme', currentTheme);
        
        // Set CSS custom property for theme
        document.documentElement.style.setProperty('--current-theme', currentTheme);
        
        // Force a reflow to ensure CSS variables are applied
        document.documentElement.offsetHeight;
        
        // Increment theme version to force all components to re-render
        setThemeVersion(prev => prev + 1);
        
        // Trigger theme change event for components that need it
        window.dispatchEvent(new Event('themechange'));
        
        // Remove transition class after transition completes to avoid performance issues
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
          document.body.classList.remove('theme-transition');
        }, 350);
      });
    }
  }, [currentTheme]);

  // Set initial theme on mount to avoid flash
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') || DEFAULT_THEME;
    if (!document.documentElement.getAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Theme change handler with persistence
  const changeTheme = useCallback((themeName) => {
    if (Object.values(THEMES).includes(themeName)) {
      setCurrentTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
    }
  }, []);

  const value = {
    currentTheme,
    changeTheme,
    availableThemes: Object.values(THEMES),
    themes: THEMES,
    themeVersion // Expose this to trigger re-renders
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

