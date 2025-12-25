import React, { useState, useEffect, useRef } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const stateRef = useRef({ deferredPrompt, showPrompt, isInstalled });

  // Keep refs in sync with state
  useEffect(() => {
    stateRef.current = { deferredPrompt, showPrompt, isInstalled };
  }, [deferredPrompt, showPrompt, isInstalled]);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Track when user enters the site
    if (!sessionStorage.getItem('site-entry-time')) {
      sessionStorage.setItem('site-entry-time', Date.now().toString());
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
      setShowPrompt(false);
    });

    // Show prompt after 30 seconds
    const initialDelay = setTimeout(() => {
      const currentState = stateRef.current;
      if (!currentState.isInstalled && currentState.deferredPrompt && !currentState.showPrompt) {
        setShowPrompt(true);
      }
    }, 30 * 1000); // 30 seconds

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(initialDelay);
    };
  }, []);

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
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if already installed or if no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div style={styles.container} data-pwa-install-container>
      <button 
        onClick={handleInstallClick} 
        style={{
          ...styles.installButton,
          ...(isHovering ? styles.installButtonHover : {})
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        data-pwa-install-button
      >
        Install App
      </button>
      <button 
        onClick={handleDismiss} 
        style={styles.closeButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)';
        }}
        aria-label="Close"
        data-pwa-close-button
      >
        ✕
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '15px',
    left: '15px',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    animation: 'slideInLeft 0.3s ease-out'
  },
  installButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    minHeight: '36px'
  },
  installButtonHover: {
    backgroundColor: '#229954',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition: 'background-color 0.2s',
    flexShrink: 0
  },
  closeButtonHover: {
    backgroundColor: 'rgba(0,0,0,0.7)'
  }
};

// Add slide-in animation and responsive styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @media (max-width: 768px) {
      [data-pwa-install-container] {
        bottom: 10px !important;
        left: 10px !important;
      }
      [data-pwa-install-button] {
        font-size: 0.75rem !important;
        padding: 0.4rem 0.8rem !important;
        min-height: 32px !important;
      }
      [data-pwa-close-button] {
        width: 20px !important;
        height: 20px !important;
        font-size: 0.7rem !important;
      }
    }
  `;
  if (!document.head.querySelector('style[data-pwa-animation]')) {
    style.setAttribute('data-pwa-animation', 'true');
    document.head.appendChild(style);
  }
}

export default PWAInstallPrompt;



