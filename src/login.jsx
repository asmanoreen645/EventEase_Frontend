import { useState } from 'react';
import './login.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './Components/AuthContext'; 
import API from './api/axiosConfig';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleAuthSuccess = (user, token) => {
    login(user, token);
    const redirectPath = location.state?.from;

    const vendorOnlyPaths = ['/vendor-register', '/vendor-dashboard'];
    const adminOnlyPaths = ['/admin'];
    const userRole = user?.role?.toLowerCase();

    const isPathAllowedForRole = (path, role) => {
      if (vendorOnlyPaths.includes(path) && role !== 'vendor') return false;
      if (adminOnlyPaths.includes(path) && role !== 'admin') return false;
      return true;
    };

    if (redirectPath && isPathAllowedForRole(redirectPath, userRole)) {
      navigate(redirectPath);
    } else if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'vendor') {
      const alreadyRegistered = localStorage.getItem('vendorRegistered') === 'true';
      if (alreadyRegistered) {
        navigate('/vendor-dashboard');
      } else {
        navigate('/vendor-register');
      }
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Endpoint updated: /auth/login (Not /api/auth/login)
      const response = await API.post('/auth/login', { email, password });
      const { token, user } = response.data;
      handleAuthSuccess(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Endpoint updated: /auth/google
      const response = await API.post('/auth/google', {
        token: credentialResponse.credential
      });

      const { token, user } = response.data;
      handleAuthSuccess(user, token);
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.response?.data?.message || 'Google Login Failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-box">
            <span className="calendar-icon"></span>
          </div>
          <h1>EventEase</h1>
          <p className="subtitle">Plan your perfect moment</p>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
          />
        </div>

        <p className="footer-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;