import { useState } from 'react';
import './signup.css';
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join EventEase to start managing your events.</p>

        <form className="signup-form">
          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <input type="email" placeholder="example@email.com" />
          </div>

          <div className="input-group">
            <label>PASSWORD</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
              />
              <span 
                className="eye-icon" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>I AM A...</label>
            <select className="role-dropdown">
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <button type="submit" className="signup-btn">Create Account</button>
        </form>

        <p className="footer-text">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;