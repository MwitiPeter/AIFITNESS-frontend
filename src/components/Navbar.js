import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = memo(() => {
  const { isAuthenticated, user, logout } = useAuth();
  const { currentTheme } = useTheme();
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

  // Get dynamic styles based on current theme using CSS variables
  const themeStyles = useMemo(() => {
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

    const colors = {
      bgPrimary: getCSSVar('--theme-bg-primary', '#f5f7fa'),
      bgSecondary: getCSSVar('--theme-bg-secondary', '#e8edf2'),
      textPrimary: getCSSVar('--theme-text-primary', '#2c3e50'),
      accent: getCSSVar('--theme-accent', '#a8c5d9'),
      cardBg: getCSSVar('--theme-card-bg', '#ffffff'),
      border: getCSSVar('--theme-border', '#d1d9e0'),
      shadow: getCSSVar('--theme-shadow', 'rgba(0, 0, 0, 0.1)')
    };
    
    return {
      navbar: {
        background: `linear-gradient(180deg, ${colors.bgPrimary} 0%, ${colors.bgSecondary} 50%, ${colors.bgPrimary} 100%)`,
        padding: '1rem 0',
        boxShadow: `0 4px 20px ${colors.shadow}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: `1px solid ${colors.border}`,
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      },
      brand: {
        color: colors.textPrimary,
        fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
        fontWeight: '700',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
      },
      link: {
        color: colors.textPrimary,
        textDecoration: 'none',
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        transition: 'all 0.3s ease',
        padding: '0.5rem 0.75rem',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '8px',
        fontWeight: '500',
        backgroundColor: 'transparent'
      },
      userName: {
        color: colors.accent,
        fontWeight: '600',
        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
        whiteSpace: 'nowrap',
        padding: '0.5rem 0.75rem',
        backgroundColor: colors.cardBg,
        borderRadius: '8px',
        border: `1px solid ${colors.accent}`
      },
      logoutBtn: {
        backgroundColor: colors.cardBg,
        color: colors.textPrimary,
        border: `1px solid ${colors.border}`,
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        minHeight: '44px',
        minWidth: '80px',
        transition: 'all 0.3s ease',
        fontWeight: '600'
      },
      navLinksOpen: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: `linear-gradient(180deg, ${colors.bgPrimary} 0%, ${colors.bgSecondary} 100%)`,
        padding: '1rem',
        boxShadow: `0 8px 32px ${colors.shadow}`,
        width: '100%',
        gap: '0.75rem',
        borderRadius: '0 0 16px 16px',
        borderTop: `1px solid ${colors.border}`,
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      },
      mobileMenuButton: {
        backgroundColor: colors.cardBg,
        border: `1px solid ${colors.border}`,
        color: colors.textPrimary,
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0.5rem',
        minWidth: '44px',
        minHeight: '44px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
      }
    };
  }, [currentTheme]);

  return (
    <nav style={themeStyles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand} onClick={closeMobileMenu}>
          💪 AI Fitness App
        </Link>
        
        {/* Mobile menu button */}
        {isMobile && (
          <button 
            onClick={toggleMobileMenu} 
            style={themeStyles.mobileMenuButton}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
        
        <div 
          style={{
            ...styles.navLinks,
            ...(isMobile && isMobileMenuOpen ? themeStyles.navLinksOpen : {}),
            ...(isMobile && !isMobileMenuOpen ? styles.navLinksClosed : {})
          }}
        >
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={themeStyles.link} onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/workout-tracker" style={themeStyles.link} onClick={closeMobileMenu}>Track Workout</Link>
              <Link to="/progress" style={themeStyles.link} onClick={closeMobileMenu}>Progress</Link>
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
              <span style={themeStyles.userName}>Hi, {user?.name}!</span>
              <button onClick={handleLogout} style={themeStyles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={themeStyles.link} onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" style={themeStyles.link} onClick={closeMobileMenu}>Register</Link>
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
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  navLinksClosed: {
    display: 'none'
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