import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithGoogle } from './authService';
import { useAuth } from './authContext';
import Lottie from 'lottie-react';
import Icon from './assets/images/Icon.png';
import LoginBackground from './assets/images/Loginbg.jpg';
import './loginStyles.css';

// Import Lottie animations
import animationData1 from './assets/animations/Girl_Avatar.json';
import animationData2 from './assets/animations/Boy_Avatar.json';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentAnimation, setCurrentAnimation] = useState(0);
  
  const lottieRef1 = useRef(null);
  const lottieRef2 = useRef(null);
  const { isAuthenticated, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to home or the page they were trying to access
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Toggle animation - now always enters from right
  const toggleAnimation = () => {
    // Simply toggle the current animation
    setCurrentAnimation(prev => prev === 0 ? 1 : 0);
  };

  // Set up animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      toggleAnimation();
    }, 4000); // Switch every 4 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        setErrorMessage(error);
        setIsLoading(false);
        return;
      }
      
      if (user) {
        // Navigate will happen automatically from the useEffect above
        // when isAuthenticated updates
      }
    } catch (err) {
      setErrorMessage('Failed to sign in with Google. Please try again.');
      setError('Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Background with text */}
      <div className="login-background">
        <img src={LoginBackground} alt="Scenic background" className="background-image" />
        
        {/* Overlay text on background */}
        <div 
          className="background-text-overlay bg-text-light"
          style={{ fontFamily: 'Lora, serif' }}
        >
          Let the light in
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="login-form-container">
        <div className="login-form">
          <div className="login-header">
            <div className="logo-title-container">
              <img src={Icon} alt="LEAD GPT Logo" className="logo" />
              <h1 className="app-title">LEAD GPT 1.0 <span className="sparkle">✨</span> <span className="beta-tag">(Beta)</span></h1>
            </div>
            <h2 
              className="welcome-text"
              style={{ fontFamily: 'Lora, serif' }}
            >
              Hello there!
            </h2>
          </div>
          
          {/* Avatar with Lottie animation */}
          <div className="user-avatar-container">
            <div className="user-avatar-circle">
              <div className="animation-wrapper">
                {/* Always render both animations */}
                <div 
                  className={`animation-item ${currentAnimation === 0 ? 'active' : 'inactive'} ${
                    currentAnimation === 0 ? 'slide-in-right' : 'slide-out-left'
                  }`}
                >
                  <Lottie
                    lottieRef={lottieRef1}
                    animationData={animationData1}
                    loop={true}
                  />
                </div>
                
                <div 
                  className={`animation-item ${currentAnimation === 1 ? 'active' : 'inactive'} ${
                    currentAnimation === 1 ? 'slide-in-right' : 'slide-out-left'
                  }`}
                >
                  <Lottie
                    lottieRef={lottieRef2}
                    animationData={animationData2}
                    loop={true}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="signin-container">
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            
            <button
              type="button"
              className="google-signin-button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <img 
                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" 
                alt="Google logo" 
                className="google-icon" 
              />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
          
          <div className="login-footer">
            © LEAD Group 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;