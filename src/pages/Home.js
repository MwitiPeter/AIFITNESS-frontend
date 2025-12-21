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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  hero: {
    textAlign: 'center',
    color: 'white',
    maxWidth: '1000px'
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '3rem',
    opacity: 0.9
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  feature: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  },
  icon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem'
  },
  cta: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    display: 'inline-block'
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: '2px solid white',
    transition: 'transform 0.2s',
    display: 'inline-block'
  }
};

export default Home;