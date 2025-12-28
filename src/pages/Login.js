import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileAPI } from '../utils/api';

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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { currentTheme, themeVersion } = useTheme();
  const navigate = useNavigate();

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
    const inputBg = getCSSVar('--theme-input-bg', cardBg);
    const inputBorder = getCSSVar('--theme-input-border', border);
    const buttonPrimary = getCSSVar('--theme-button-primary', accent);
    const buttonPrimaryText = getCSSVar('--theme-button-primary-text', textPrimary);

    return {
      container: {
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(180deg, ${bgPrimary} 0%, ${bgSecondary} 50%, ${bgPrimary} 100%)`,
        padding: 'clamp(1rem, 4vw, 2rem)',
        transition: 'background 0.3s ease'
      },
      formCard: {
        backgroundColor: cardBg,
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        borderRadius: '20px',
        boxShadow: `0 8px 32px ${shadow}`,
        width: '100%',
        maxWidth: '420px',
        boxSizing: 'border-box',
        border: `1px solid ${border}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      },
      title: {
        textAlign: 'center',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        color: textPrimary,
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: '700',
        transition: 'color 0.3s ease'
      },
      error: {
        backgroundColor: '#2d1a1a',
        color: '#ff6b6b',
        padding: '0.75rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
        border: '1px solid #ff6b6b',
        fontSize: '0.9rem'
      },
      form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      },
      formGroup: {
        display: 'flex',
        flexDirection: 'column'
      },
      label: {
        marginBottom: '0.5rem',
        color: textPrimary,
        fontWeight: '600',
        fontSize: '0.95rem',
        display: 'block',
        transition: 'color 0.3s ease'
      },
      input: {
        padding: 'clamp(0.875rem, 2vw, 1rem)',
        border: `1px solid ${inputBorder}`,
        borderRadius: '12px',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '48px',
        transition: 'all 0.3s ease',
        backgroundColor: inputBg,
        color: textPrimary,
        fontFamily: 'inherit'
      },
      submitBtn: {
        backgroundColor: buttonPrimary,
        color: buttonPrimaryText,
        padding: 'clamp(0.875rem, 2vw, 1rem)',
        border: 'none',
        borderRadius: '12px',
        fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '1.5rem',
        width: '100%',
        minHeight: '48px',
        boxShadow: `0 4px 20px ${shadow}`,
        transition: 'all 0.3s ease'
      },
      footer: {
        textAlign: 'center',
        marginTop: '1.5rem',
        color: textSecondary,
        transition: 'color 0.3s ease'
      },
      link: {
        color: accent,
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'color 0.3s ease'
      }
    };
  }, [currentTheme, themeVersion]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      // Check if user has profile
      try {
        const profileCheck = await profileAPI.checkProfile();
        if (profileCheck.data.hasProfile) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } catch (err) {
        // If check fails, go to onboarding to be safe
        navigate('/onboarding');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Welcome Back!</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="your.email@example.com"
              autoComplete="email"
              required
              aria-required="true"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              aria-required="true"
            />
          </div>

          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link} aria-label="Navigate to registration page">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;