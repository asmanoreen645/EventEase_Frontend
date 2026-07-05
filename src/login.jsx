import { useState } from 'react';
import './login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import googleIcon from './google-icon.png';
import API from './api/axiosConfig';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/api/auth/login', { email, password });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role); 
      localStorage.setItem('userEmail', user.email);  

      // 🔧 Agar user kisi specific page (chat/booking) se redirect hoke aya hai,
      // tw usay wapis wahin bhejna hai — role-based default se pehle check karo
      const redirectPath = location.state?.from;

      if (redirectPath) {
     navigate(redirectPath);
     } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
     } else if (user.role === 'vendor') {
      const alreadyRegistered = localStorage.getItem('vendorRegistered') === 'true';
     if (alreadyRegistered) {
     navigate('/vendor-dashboard');
     } else {
     navigate('/vendor-register');
   }
}    else {
  navigate('/');  // customer → home
}

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-box">
            <span className="calendar-icon">📅</span>
          </div>
          <h1>EventEase</h1>
          <p className="subtitle">Plan your perfect moment</p>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button className="google-btn">
          <img src={googleIcon} alt="Google" />
          Sign up with Google
        </button>

        <p className="footer-text">
          Don't have an account? <a href="#signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;