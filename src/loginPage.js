import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from './authService';
import { useAuth } from './authContext';
import { configureLottie, preloadLottieFiles, slideLottie } from './lottieConfig';
import Icon from './assets/images/Icon.png';
import LoginBackground from './assets/images/Loginbg.jpg';
import './loginStyles.css';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lottieFiles, setLottieFiles] = useState(null);
  const lottieContainerRef = useRef(null);
  const lottieAnimationRef = useRef(null);
  const animationSequenceRef = useRef(0);
  
  const { setError } = useAuth();
  const navigate = useNavigate();

  
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
        navigate('/');
      }
    } catch (err) {
      setErrorMessage('Failed to sign in with Google. Please try again.');
      setError('Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <img src={LoginBackground} alt="Scenic background" className="background-image" />
      </div>
      
      <div className="login-form-container">
        <div className="login-form">
          <div className="login-header">
            <div className="logo-title-container">
              <img src={Icon} alt="LEAD GPT Logo" className="logo" />
              <h1 className="app-title">LEAD GPT 1.0 <span className="sparkle">✨</span> <span className="beta-tag">(Beta)</span></h1>
            </div>
            <h2 className="welcome-text">Hello there!</h2>
          </div>
          
          <div className="user-avatar-container">
            <div className="user-avatar-circle">
              <div className="lottie-container" id="lottie-container"></div>
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