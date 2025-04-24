import React, { useState } from 'react';
import Lottie from 'lottie-react';
import botAnimation from '../../assets/animations/bot-animation.json';

// BotAvatar component
function BotAvatar({ message, isTyping = false }) {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 overflow-hidden ${animationComplete && !isTyping ? 'bg-indigo-200' : 'bg-white'}`}>
      <Lottie 
        animationData={botAnimation} 
        loop={isTyping}
        autoplay={true}
        lottieRef={(ref) => {
          if (ref && !isTyping) {
            ref.addEventListener('enterFrame', (event) => {
              if (event.currentTime >= 193) {
                ref.pause();
                setAnimationComplete(true); // Update state when animation reaches frame 193
              }
            });
          }
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default BotAvatar;