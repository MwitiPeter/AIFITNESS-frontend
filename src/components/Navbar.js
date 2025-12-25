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
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 50%, #0f4c3a 100%)',
    padding: '1rem 0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
    color: '#ffffff',
    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
    fontWeight: '700',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  mobileMenuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
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
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 100%)',
    padding: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    width: '100%',
    gap: '0.75rem',
    borderRadius: '0 0 16px 16px',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  navLinksClosed: {
    display: 'none'
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    transition: 'all 0.3s ease',
    padding: '0.5rem 0.75rem',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    fontWeight: '500'
  },
  userName: {
    color: '#e8f5e9',
    fontWeight: '600',
    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    whiteSpace: 'nowrap',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)'
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    minHeight: '44px',
    minWidth: '80px',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    backdropFilter: 'blur(10px)'
  }
};

Navbar.displayName = 'Navbar';

export default Navbar;