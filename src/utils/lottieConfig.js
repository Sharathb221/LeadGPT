// lottieConfig.js - Utility functions for working with Lottie animations
import lottie from 'lottie-web';

/**
 * Configures a Lottie animation with default settings
 * @param {Object} container - DOM element to contain the animation
 * @param {Object} animationData - The Lottie JSON data
 * @param {Object} options - Additional configuration options
 * @returns {Object} - The Lottie animation instance
 */
export const configureLottie = (container, animationData, options = {}) => {
  if (!container || !animationData) {
    console.error('Missing required parameters for configureLottie');
    return null;
  }

  try {
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

    return lottie.loadAnimation(defaultOptions);
  } catch (error) {
    console.error('Error configuring Lottie animation:', error);
    return null;
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
        break; // Added default case
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
      default:
        element.style.transform = 'translateX(0)';
        break; // Added default case
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