import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './responsive.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import { measurePerformance } from './utils/performance';

// Measure performance
measurePerformance();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // New content available, prompt user to refresh
    if (window.confirm('New version available! Reload to update?')) {
      window.location.reload();
    }
  },
  onSuccess: (registration) => {
    console.log('Service Worker registered successfully');
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
