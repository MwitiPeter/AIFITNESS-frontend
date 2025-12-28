import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { currentTheme } = useTheme();

  // Get dynamic styles based on current theme
  const styles = useMemo(() => {
    const bgPrimary = getCSSVar('--theme-bg-primary', '#f5f7fa');
    const bgSecondary = getCSSVar('--theme-bg-secondary', '#e8edf2');
    const textPrimary = getCSSVar('--theme-text-primary', '#2c3e50');
    const textSecondary = getCSSVar('--theme-text-secondary', '#5a6c7d');
    const accent = getCSSVar('--theme-accent', '#a8c5d9');
    const cardBg = getCSSVar('--theme-card-bg', '#ffffff');
    const border = getCSSVar('--theme-border', '#d1d9e0');
    const shadow = getCSSVar('--theme-shadow', 'rgba(0, 0, 0, 0.1)');
    const buttonPrimary = getCSSVar('--theme-button-primary', accent);
    const buttonPrimaryText = getCSSVar('--theme-button-primary-text', textPrimary);

    return {
      container: {
        minHeight: 'calc(100vh - 70px)',
        background: `linear-gradient(180deg, ${bgPrimary} 0%, ${bgSecondary} 50%, ${bgPrimary} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.3s ease'
      },
      hero: {
        textAlign: 'center',
        color: textPrimary,
        maxWidth: '1000px',
        width: '100%',
        zIndex: 1
      },
      title: {
        fontSize: 'clamp(2rem, 8vw, 4rem)',
        marginBottom: '1rem',
        fontWeight: '800',
        wordWrap: 'break-word',
        color: textPrimary,
        textShadow: `0 4px 20px ${shadow}`,
        letterSpacing: '-0.02em',
        lineHeight: '1.1',
        transition: 'color 0.3s ease'
      },
      subtitle: {
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        marginBottom: 'clamp(2rem, 6vw, 3rem)',
        opacity: 0.9,
        color: textPrimary,
        fontWeight: '400',
        letterSpacing: '0.02em',
        transition: 'color 0.3s ease'
      },
      features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
        gap: 'clamp(1rem, 4vw, 2rem)',
        marginBottom: 'clamp(2rem, 6vw, 3rem)'
      },
      feature: {
        backgroundColor: cardBg,
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        borderRadius: '20px',
        border: `1px solid ${border}`,
        boxShadow: `0 8px 32px ${shadow}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
        color: textPrimary,
        cursor: 'default'
      },
      icon: {
        fontSize: 'clamp(2rem, 6vw, 3rem)',
        display: 'block',
        marginBottom: '1rem'
      },
      featureTitle: {
        fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
        fontWeight: '700',
        marginBottom: '0.75rem',
        color: accent,
        transition: 'color 0.3s ease'
      },
      featureText: {
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        lineHeight: '1.6',
        color: textSecondary,
        margin: 0,
        transition: 'color 0.3s ease'
      },
      cta: {
        display: 'flex',
        gap: 'clamp(0.75rem, 2vw, 1rem)',
        justifyContent: 'center',
        flexWrap: 'wrap'
      },
      primaryBtn: {
        backgroundColor: buttonPrimary,
        color: buttonPrimaryText,
        padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
        fontWeight: '700',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        minHeight: '48px',
        minWidth: '140px',
        textAlign: 'center',
        boxShadow: `0 4px 20px ${shadow}`,
        border: 'none',
        cursor: 'pointer',
        letterSpacing: '0.02em'
      },
      secondaryBtn: {
        backgroundColor: bgSecondary,
        color: textPrimary,
        padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
        fontWeight: '600',
        border: `1px solid ${border}`,
        transition: 'all 0.3s ease',
        display: 'inline-block',
        minHeight: '48px',
        minWidth: '140px',
        textAlign: 'center'
      }
    };
  }, [currentTheme]);

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          BE HEALTHY<br />
          BE STRONGER<br />
          BE YOURSELF
        </h1>
        <p style={styles.subtitle}>
          Get personalized workout plans powered by AI
        </p>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.icon}>🤖</span>
            <h3 style={styles.featureTitle}>AI-Powered Plans</h3>
            <p style={styles.featureText}>Custom workouts generated just for you</p>
          </div>
          
          <div style={styles.feature}>
            <span style={styles.icon}>📊</span>
            <h3 style={styles.featureTitle}>Track Progress</h3>
            <p style={styles.featureText}>Monitor your fitness journey with detailed analytics</p>
          </div>
          
          <div style={styles.feature}>
            <span style={styles.icon}>🎯</span>
            <h3 style={styles.featureTitle}>Reach Goals</h3>
            <p style={styles.featureText}>Achieve your fitness objectives with personalized guidance</p>
          </div>
        </div>

        <div style={styles.cta}>
          {isAuthenticated ? (
            <Link to="/dashboard" style={styles.primaryBtn}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" style={styles.primaryBtn}>
                Join Now
              </Link>
              <Link to="/login" style={styles.secondaryBtn}>
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;