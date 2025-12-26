import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { profileAPI } from '../utils/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme mapping based on fitness level
const FITNESS_LEVEL_THEMES = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced'
};

// Get theme based on day of week (for daily rotation)
const getThemeForDay = (fitnessLevel, dayOfWeek) => {
  // Map fitness level to base theme
  const baseTheme = FITNESS_LEVEL_THEMES[fitnessLevel] || 'beginner';
  
  // For daily rotation, we can cycle through variations
  // For now, we'll use the base theme, but this can be extended
  return baseTheme;
};

// Get current day identifier (YYYY-MM-DD format)
const getCurrentDayId = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('beginner');
  const [fitnessLevel, setFitnessLevel] = useState(null);
  const [manualOverride, setManualOverride] = useState(null);
  const [lastDayId, setLastDayId] = useState(null);

  // Load saved theme preferences
  useEffect(() => {
    const savedOverride = localStorage.getItem('themeOverride');
    const savedDayId = localStorage.getItem('themeDayId');
    
    if (savedOverride) {
      setManualOverride(savedOverride);
      setCurrentTheme(savedOverride);
    }
    
    if (savedDayId) {
      setLastDayId(savedDayId);
    }
  }, []);

  // Fetch user profile to get fitness level
  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await profileAPI.getMyProfile();
          const level = response.data.data?.fitnessLevel;
          if (level) {
            setFitnessLevel(level);
          }
        } catch (error) {
          console.error('Error fetching profile for theme:', error);
          // Default to beginner if profile fetch fails
          setFitnessLevel('beginner');
        }
      } else {
        // Default theme for unauthenticated users
        setFitnessLevel('beginner');
      }
    };

    fetchProfile();
  }, [isAuthenticated, user]);

  // Determine theme based on fitness level and day
  useEffect(() => {
    if (manualOverride) {
      // Manual override takes precedence - don't auto-rotate
      setCurrentTheme(manualOverride);
      return;
    }

    if (!fitnessLevel) {
      return;
    }

    const todayId = getCurrentDayId();
    
    // Check if it's a new day
    if (lastDayId !== todayId) {
      // New day - auto-rotate theme based on fitness level
      const dayOfWeek = new Date().getDay();
      const newTheme = getThemeForDay(fitnessLevel, dayOfWeek);
      setCurrentTheme(newTheme);
      setLastDayId(todayId);
      localStorage.setItem('themeDayId', todayId);
    } else {
      // Same day - use fitness level theme
      const theme = FITNESS_LEVEL_THEMES[fitnessLevel] || 'beginner';
      setCurrentTheme(theme);
    }
  }, [fitnessLevel, manualOverride, lastDayId]);

  // Apply theme to document
  useEffect(() => {
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      // Also set it on body for better compatibility
      document.body.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme]);

  // Set initial theme on mount
  useEffect(() => {
    // Set a default theme immediately to avoid flash
    if (!document.documentElement.getAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', 'beginner');
      document.body.setAttribute('data-theme', 'beginner');
    }
  }, []);

  // Manual theme change handler
  const changeTheme = useCallback((themeName) => {
    setManualOverride(themeName);
    setCurrentTheme(themeName);
    localStorage.setItem('themeOverride', themeName);
    localStorage.setItem('themeDayId', getCurrentDayId());
    setLastDayId(getCurrentDayId());
  }, []);

  // Reset to auto theme
  const resetToAutoTheme = useCallback(() => {
    setManualOverride(null);
    localStorage.removeItem('themeOverride');
    const todayId = getCurrentDayId();
    if (fitnessLevel) {
      const dayOfWeek = new Date().getDay();
      const theme = getThemeForDay(fitnessLevel, dayOfWeek);
      setCurrentTheme(theme);
      setLastDayId(todayId);
      localStorage.setItem('themeDayId', todayId);
    }
  }, [fitnessLevel]);

  const value = {
    currentTheme,
    fitnessLevel,
    manualOverride,
    changeTheme,
    resetToAutoTheme,
    availableThemes: ['beginner', 'intermediate', 'advanced']
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

