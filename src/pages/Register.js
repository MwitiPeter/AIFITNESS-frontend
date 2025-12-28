import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { currentTheme } = useTheme();
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
      hint: {
        display: 'block',
        marginTop: '0.5rem',
        fontSize: '0.85rem',
        color: textSecondary,
        fontStyle: 'italic',
        transition: 'color 0.3s ease'
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
  }, [currentTheme]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    setLoading(false);

    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Create Account</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="John Doe"
              autoComplete="name"
              required
              aria-required="true"
            />
          </div>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
              aria-required="true"
              minLength={6}
            />
            <small style={styles.hint}>Minimum 6 characters</small>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              aria-required="true"
            />
          </div>

          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link} aria-label="Navigate to login page">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;