import  { useState } from 'react';
import './login.css';
import googleIcon from './google-icon.png'; 

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-box">
             <span className="calendar-icon">📅</span>
          </div>
          <h1>EventEase</h1>
          <p className="subtitle">Plan your perfect moment</p>
        </div>

        {/* Form Section */}
        <form className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <a href="#forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        {/* Social Login */}
        <button className="google-btn">
                  <img src={googleIcon} alt="Google" />
                  Sign up with Google
                </button>

        {/* Footer */}
        <p className="footer-text">
          Don't have an account? <a href="#signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;