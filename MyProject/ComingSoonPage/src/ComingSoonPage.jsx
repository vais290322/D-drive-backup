import React, { useState, useEffect } from 'react';
import './ComingSoonPage.css';

const ComingSoonPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set the target date (you can customize this)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="coming-soon-container">
      {/* Animated background elements */}
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="square square-1"></div>
        <div className="square square-2"></div>
      </div>

      {/* Main content */}
      <div className="content-wrapper">
        <div className="logo-section">
          <div className="logo-animation">
            <h1 className="brand-name">Maqam Holidays</h1>
          </div>
        </div>

        <div className="main-content">
          <h2 className="title">Something Amazing is Coming</h2>
          <p className="subtitle">
            We're working hard to bring you an incredible experience. Stay tuned!
          </p>

          {/* Countdown Timer */}
          <div className="countdown-timer">
            <div className="timer-section">
              <div className="time-unit">
                <span className="time-number">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="time-label">Days</span>
              </div>
              <span className="colon">:</span>
            </div>
            <div className="timer-section">
              <div className="time-unit">
                <span className="time-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="time-label">Hours</span>
              </div>
              <span className="colon">:</span>
            </div>
            <div className="timer-section">
              <div className="time-unit">
                <span className="time-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="time-label">Minutes</span>
              </div>
              <span className="colon">:</span>
            </div>
            <div className="timer-section">
              <div className="time-unit">
                <span className="time-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="time-label">Seconds</span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="newsletter-section">
            <p className="newsletter-text">Be the first to know when we launch!</p>
            <div className="email-input-group">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="email-input"
              />
              <button className="subscribe-button">Notify Me</button>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="social-links">
            <a href="#" className="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;