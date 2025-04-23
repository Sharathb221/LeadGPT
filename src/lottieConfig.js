// lottieConfig.js - Utility functions for working with Lottie animations

/**
 * Configures a Lottie animation with default settings
 * @param {Object} container - DOM element to contain the animation
 * @param {Object} animationData - The Lottie JSON data
 * @param {Object} options - Additional configuration options
 * @returns {Object} - The Lottie animation instance
 */
export const configureLottie = (container, animationData, options = {}) => {
    const defaultOptions = {
      container,
      renderer: 'svg',
      loop: options.loop !== undefined ? options.loop : false,
      autoplay: options.autoplay !== undefined ? options.autoplay : false,
      animationData,
      rendererSettings: {
        preserveAspectRatio: options.preserveAspectRatio || 'xMidYMid slice',
        progressiveLoad: true,
        hideOnTransparent: true
      }
    };
  
    // Import lottie-web dynamically to avoid server-side rendering issues
    return import('lottie-web').then(lottieModule => {
      const lottie = lottieModule.default;
      return lottie.loadAnimation(defaultOptions);
    });
  };
  
  /**
   * Preloads Lottie JSON files
   * @param {Array} paths - Array of file paths to load
   * @returns {Promise<Array>} - Promise resolving to array of loaded JSON data
   */
  export const preloadLottieFiles = async (paths) => {
    try {
      const loadPromises = paths.map(path => 
        fetch(path)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load Lottie file: ${path}`);
            }
            return response.json();
          })
      );
      
      return await Promise.all(loadPromises);
    } catch (error) {
      console.error('Error preloading Lottie files:', error);
      throw error;
    }
  };
  
  /**
   * Slide animation helper for Lottie containers
   * @param {Object} element - DOM element to animate
   * @param {String} direction - 'in-left', 'in-right', 'out-left', 'out-right'
   * @param {Number} duration - Animation duration in ms
   * @returns {Promise} - Promise that resolves when animation completes
   */
  export const slideLottie = (element, direction, duration = 500) => {
    return new Promise(resolve => {
      if (!element) {
        resolve();
        return;
      }
      
      // Reset any existing transitions
      element.style.transition = '';
      
      // Set initial position
      switch (direction) {
        case 'in-left':
          element.style.transform = 'translateX(-100%)';
          break;
        case 'in-right':
          element.style.transform = 'translateX(100%)';
          break;
        case 'out-left':
          element.style.transform = 'translateX(0)';
          break;
        case 'out-right':
          element.style.transform = 'translateX(0)';
          break;
        default:
          element.style.transform = 'translateX(0)';
      }
      
      // Force a reflow to ensure the initial position is applied
      void element.offsetWidth;
      
      // Add the transition and set target position
      element.style.transition = `transform ${duration}ms ease-out`;
      
      switch (direction) {
        case 'in-left':
        case 'in-right':
          element.style.transform = 'translateX(0)';
          break;
        case 'out-left':
          element.style.transform = 'translateX(-100%)';
          break;
        case 'out-right':
          element.style.transform = 'translateX(100%)';
          break;
      }
      
      // Resolve promise when transition ends
      const onTransitionEnd = () => {
        element.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };
      
      element.addEventListener('transitionend', onTransitionEnd);
      
      // Safety timeout in case transitionend doesn't fire
      setTimeout(resolve, duration + 50);
    });
  };