// Performance optimization utilities

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with intersection observer
 * @param {string} imageSrc - Image source URL
 * @param {HTMLElement} imgElement - Image element
 */
export const lazyLoadImage = (imageSrc, imgElement) => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgElement.src = imageSrc;
        imgElement.classList.add('loaded');
        observer.unobserve(imgElement);
      }
    });
  });

  imageObserver.observe(imgElement);
};

/**
 * Preload critical resources
 * @param {Array<string>} urls - Array of URLs to preload
 */
export const preloadResources = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = url.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
};

/**
 * Measure performance metrics
 */
export const measurePerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          request: perfData.responseStart - perfData.requestStart,
          response: perfData.responseEnd - perfData.responseStart,
          dom: perfData.domContentLoadedEventEnd - perfData.responseEnd,
          load: perfData.loadEventEnd - perfData.fetchStart
        };
        console.log('Performance Metrics:', metrics);
        return metrics;
      }, 0);
    });
  }
};




