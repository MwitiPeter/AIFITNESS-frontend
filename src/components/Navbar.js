import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          💪 AI Fitness App
        </Link>
        
        <div style={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/workout-tracker" style={styles.link}>Track Workout</Link>
              <Link to="/progress" style={styles.link}>Progress</Link>
              <span style={styles.userName}>Hi, {user?.name}!</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s'
  },
  userName: {
    color: '#3498db',
    fontWeight: '500'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default Navbar;