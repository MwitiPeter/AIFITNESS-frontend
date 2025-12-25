import React, { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissedUntil, setDismissedUntil] = useState(null);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the prompt recently (within 24 hours)
    const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed, 10);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      
      if (hoursSinceDismissed < 24) {
        setDismissedUntil(new Date(dismissedTime + 24 * 60 * 60 * 1000));
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay (3 seconds) or show immediately if user has been on site for a while
      const timeOnSite = Date.now() - (parseInt(sessionStorage.getItem('site-entry-time') || Date.now(), 10));
      const delay = timeOnSite > 30000 ? 2000 : 5000; // Show faster if user has been on site > 30 seconds
      
      setTimeout(() => {
        setShowPrompt(true);
      }, delay);
    };

    // Track when user enters the site
    if (!sessionStorage.getItem('site-entry-time')) {
      sessionStorage.setItem('site-entry-time', Date.now().toString());
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.removeItem('pwa-prompt-dismissed');
    });

    // Show prompt periodically (every 2 minutes if conditions are met)
    const interval = setInterval(() => {
      if (!isInstalled && deferredPrompt && !showPrompt) {
        const lastShown = localStorage.getItem('pwa-prompt-last-shown');
        const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
        
        if (!lastShown || parseInt(lastShown, 10) < twoMinutesAgo) {
          setShowPrompt(true);
          localStorage.setItem('pwa-prompt-last-shown', Date.now().toString());
        }
      }
    }, 120000); // Check every 2 minutes

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, [deferredPrompt, isInstalled, showPrompt]);

  const handleInstallClick = async () => {
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
      // Store dismissal time
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    localStorage.setItem('pwa-prompt-last-shown', Date.now().toString());
  };

  // Don't show if already installed or if dismissed recently
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.prompt}>
        <div style={styles.header}>
          <span style={styles.icon}>📱</span>
          <h3 style={styles.title}>Install AI Fitness App</h3>
          <button onClick={handleDismiss} style={styles.closeBtn} aria-label="Close">
            ✕
          </button>
        </div>
        
        <div style={styles.content}>
          <p style={styles.message}>
            Install our app for a faster, more convenient experience! Get quick access to your workouts, 
            track your progress offline, and receive notifications.
          </p>
          
          <div style={styles.benefits}>
            <div style={styles.benefit}>
              <span style={styles.benefitIcon}>⚡</span>
              <span>Faster Loading</span>
            </div>
            <div style={styles.benefit}>
              <span style={styles.benefitIcon}>📴</span>
              <span>Works Offline</span>
            </div>
            <div style={styles.benefit}>
              <span style={styles.benefitIcon}>🔔</span>
              <span>Notifications</span>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={handleDismiss} style={styles.dismissBtn}>
            Maybe Later
          </button>
          <button onClick={handleInstallClick} style={styles.installBtn}>
            Install App
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10000,
    maxWidth: '400px',
    width: 'calc(100% - 2rem)',
    animation: 'slideUp 0.3s ease-out'
  },
  prompt: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    padding: '1.5rem',
    border: '2px solid #3498db'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    position: 'relative'
  },
  icon: {
    fontSize: '2rem',
    marginRight: '0.75rem'
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#2c3e50',
    flex: 1
  },
  closeBtn: {
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  content: {
    marginBottom: '1.5rem'
  },
  message: {
    color: '#555',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  benefits: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  benefit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#555'
  },
  benefitIcon: {
    fontSize: '1.5rem'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem'
  },
  dismissBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.2s'
  },
  installBtn: {
    flex: 2,
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.2s'
  }
};

// Add slide-up animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

export default PWAInstallPrompt;


