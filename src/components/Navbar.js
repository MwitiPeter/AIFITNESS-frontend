import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = memo(() => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallHovered, setIsInstallHovered] = useState(false);

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

  // PWA Install Prompt Logic
  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
  }, [deferredPrompt]);


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
              <ThemeToggle />
              {!isInstalled && deferredPrompt && (
                <button 
                  onClick={() => {
                    handleInstallClick();
                    closeMobileMenu();
                  }} 
                  onMouseEnter={() => setIsInstallHovered(true)}
                  onMouseLeave={() => setIsInstallHovered(false)}
                  style={{
                    ...styles.installBtn,
                    ...(isInstallHovered ? styles.installBtnHover : {})
                  }}
                  title="Install App"
                >
                  📱 Install App
                </button>
              )}
              <span style={styles.userName}>Hi, {user?.name}!</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" style={styles.link} onClick={closeMobileMenu}>Register</Link>
              <ThemeToggle />
              {!isInstalled && deferredPrompt && (
                <button 
                  onClick={() => {
                    handleInstallClick();
                    closeMobileMenu();
                  }} 
                  onMouseEnter={() => setIsInstallHovered(true)}
                  onMouseLeave={() => setIsInstallHovered(false)}
                  style={{
                    ...styles.installBtn,
                    ...(isInstallHovered ? styles.installBtnHover : {})
                  }}
                  title="Install App"
                >
                  📱 Install App
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
});

const styles = {
  navbar: {
    background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
    padding: '1rem 0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #2d2d2d'
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
    backgroundColor: '#2d2d2d',
    border: '1px solid #404040',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
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
    background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
    padding: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
    width: '100%',
    gap: '0.75rem',
    borderRadius: '0 0 16px 16px',
    borderTop: '1px solid #2d2d2d'
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
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    whiteSpace: 'nowrap',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#1a1a00',
    borderRadius: '8px',
    border: '1px solid rgba(255, 215, 0, 0.3)'
  },
  logoutBtn: {
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    border: '1px solid #404040',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    minHeight: '44px',
    minWidth: '80px',
    transition: 'all 0.3s ease',
    fontWeight: '600'
  },
  installBtn: {
    backgroundColor: '#27ae60',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    minHeight: '44px',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(39, 174, 96, 0.3)'
  },
  installBtnHover: {
    backgroundColor: '#229954',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(39, 174, 96, 0.5)'
  }
};

Navbar.displayName = 'Navbar';

export default Navbar;