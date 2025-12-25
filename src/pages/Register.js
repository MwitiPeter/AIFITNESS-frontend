import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Confirm password"
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
          <Link to="/login" style={styles.link}>Login here</Link>
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
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 25%, #2d7a5f 50%, #1a5f4a 75%, #0f4c3a 100%)',
    padding: 'clamp(1rem, 4vw, 2rem)'
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '420px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  title: {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    color: '#1a5f4a',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '700'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    border: '1px solid #ffcdd2',
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
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  input: {
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '44px',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#ffffff'
  },
  submitBtn: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: 'none',
    borderRadius: '10px',
    fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    width: '100%',
    minHeight: '44px',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
    transition: 'all 0.3s ease'
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#555'
  },
  link: {
    color: '#4caf50',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease'
  }
};

export default Register;