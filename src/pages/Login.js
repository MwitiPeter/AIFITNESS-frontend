import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
    padding: 'clamp(1rem, 4vw, 2rem)'
  },
  formCard: {
    backgroundColor: '#1a1a1a',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
    width: '100%',
    maxWidth: '420px',
    boxSizing: 'border-box',
    border: '1px solid #2d2d2d'
  },
  title: {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    color: '#ffffff',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '700'
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
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'block'
  },
  input: {
    padding: 'clamp(0.875rem, 2vw, 1rem)',
    border: '1px solid #2d2d2d',
    borderRadius: '12px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '48px',
    transition: 'all 0.3s ease',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'inherit'
  },
  submitBtn: {
    backgroundColor: '#FFD700',
    color: '#000000',
    padding: 'clamp(0.875rem, 2vw, 1rem)',
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '1.5rem',
    width: '100%',
    minHeight: '48px',
    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
    transition: 'all 0.3s ease'
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#999'
  },
  link: {
    color: '#FFD700',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease'
  }
};

export default Login;