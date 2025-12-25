import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

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

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
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
    fontSize: 'clamp(2rem, 8vw, 4rem)',
    marginBottom: '1rem',
    fontWeight: '800',
    wordWrap: 'break-word',
    color: '#ffffff',
    textShadow: '0 4px 20px rgba(0,0,0,0.8)',
    letterSpacing: '-0.02em',
    lineHeight: '1.1'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 3vw, 1.5rem)',
    marginBottom: 'clamp(2rem, 6vw, 3rem)',
    opacity: 0.9,
    color: '#ffffff',
    fontWeight: '400',
    letterSpacing: '0.02em'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
    gap: 'clamp(1rem, 4vw, 2rem)',
    marginBottom: 'clamp(2rem, 6vw, 3rem)'
  },
  feature: {
    backgroundColor: '#1a1a1a',
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '20px',
    border: '1px solid #2d2d2d',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
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
    backgroundColor: '#FFD700',
    color: '#000000',
    padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    minHeight: '44px',
    minWidth: '120px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.02em'
  },
  secondaryBtn: {
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
    fontWeight: '600',
    border: '1px solid #404040',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    minHeight: '44px',
    minWidth: '120px',
    textAlign: 'center'
  }
};

export default Home;