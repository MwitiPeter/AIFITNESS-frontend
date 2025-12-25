import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = memo(() => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  }, [logout, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand} onClick={closeMobileMenu}>
          💪 AI Fitness App
        </Link>
        
        {/* Mobile menu button */}
        {isMobile && (
          <button 
            onClick={toggleMobileMenu} 
            style={styles.mobileMenuButton}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
        
        <div 
          style={{
            ...styles.navLinks,
            ...(isMobile && isMobileMenuOpen ? styles.navLinksOpen : {}),
            ...(isMobile && !isMobileMenuOpen ? styles.navLinksClosed : {})
          }}
        >
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link} onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/workout-tracker" style={styles.link} onClick={closeMobileMenu}>Track Workout</Link>
              <Link to="/progress" style={styles.link} onClick={closeMobileMenu}>Progress</Link>
              <span style={styles.userName}>Hi, {user?.name}!</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" style={styles.link} onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'relative'
  },
  brand: {
    color: 'white',
    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
    fontWeight: 'bold',
    textDecoration: 'none',
    whiteSpace: 'nowrap'
  },
  mobileMenuButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    minWidth: '44px',
    minHeight: '44px',
    '@media (min-width: 768px)': {
      display: 'none'
    }
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  navLinksOpen: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#2c3e50',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    gap: '0.75rem'
  },
  navLinksClosed: {
    display: 'none'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    transition: 'color 0.3s',
    padding: '0.5rem',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center'
  },
  userName: {
    color: '#3498db',
    fontWeight: '500',
    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    whiteSpace: 'nowrap'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    minHeight: '44px',
    minWidth: '80px',
    transition: 'background-color 0.3s'
  }
};

Navbar.displayName = 'Navbar';

export default Navbar;