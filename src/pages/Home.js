import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to AI Fitness App 💪</h1>
        <p style={styles.subtitle}>
          Get personalized workout plans powered by AI
        </p>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.icon}>🤖</span>
            <h3>AI-Powered Plans</h3>
            <p>Custom workouts generated just for you</p>
          </div>
          
          <div style={styles.feature}>
            <span style={styles.icon}>📊</span>
            <h3>Track Progress</h3>
            <p>Monitor your fitness journey</p>
          </div>
          
          <div style={styles.feature}>
            <span style={styles.icon}>🎯</span>
            <h3>Reach Goals</h3>
            <p>Achieve your fitness objectives</p>
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
                Get Started
              </Link>
              <Link to="/login" style={styles.secondaryBtn}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 25%, #2d7a5f 50%, #1a5f4a 75%, #0f4c3a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 4vw, 2rem)',
    position: 'relative',
    overflow: 'hidden'
  },
  hero: {
    textAlign: 'center',
    color: '#ffffff',
    maxWidth: '1000px',
    width: '100%',
    zIndex: 1
  },
  title: {
    fontSize: 'clamp(1.75rem, 6vw, 3rem)',
    marginBottom: '1rem',
    fontWeight: '700',
    wordWrap: 'break-word',
    color: '#ffffff',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 3vw, 1.5rem)',
    marginBottom: 'clamp(2rem, 6vw, 3rem)',
    opacity: 0.95,
    color: '#e8f5e9',
    fontWeight: '400'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
    gap: 'clamp(1rem, 4vw, 2rem)',
    marginBottom: 'clamp(2rem, 6vw, 3rem)'
  },
  feature: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    color: '#ffffff'
  },
  icon: {
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    display: 'block',
    marginBottom: '1rem'
  },
  cta: {
    display: 'flex',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    backgroundColor: '#4caf50',
    color: '#ffffff',
    padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    minHeight: '44px',
    minWidth: '120px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
    border: 'none',
    cursor: 'pointer'
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    minHeight: '44px',
    minWidth: '120px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)'
  }
};

export default Home;