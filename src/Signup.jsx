import { useState } from 'react';
import './Signup.css';
import API from './api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './Components/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Handlers for Initial Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      return setError('Please fill in all fields.');
    }

    setLoading(true);

    try {
      const response = await API.post('/api/auth/signup', {
        name,
        email,
        password,
        role
      });

      if (response.data.success) {
        setShowOtpModal(true);
      }
      
    } catch (err) {
      console.log("FULL ERROR:", err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      if (loading) setLoading(false);
    }
  };

  // Handler for OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      return setError('Please enter the OTP code.');
    }

    setOtpLoading(true);

    try {
      const response = await API.post('/api/auth/verify-otp', {
        email,
        otp
      });

      const { token, user } = response.data;
      login(user, token);

      if (user.role === 'vendor') {
        navigate('/vendor-register');
      } else {
        navigate('/login');
      }

    } catch (err) {
      console.log("OTP VERIFY ERROR:", err);
      setError(err.response?.data?.message || 'OTP Verification Failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Google Signup/Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await API.post('/api/auth/google', {
        token: credentialResponse.credential
      });

      const { token, user } = response.data;
      login(user, token);

      if (user.role === 'vendor') {
        navigate('/vendor-register');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(err.response?.data?.message || 'Google Auth Failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join EventEase to start managing your events.</p>

        {error && <p className="error-message" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}

        {!showOtpModal ? (
          <>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>NAME</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>PASSWORD</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>I AM A...</label>
                <select
                  className="role-dropdown"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Create Account'}
              </button>
            </form>

            <div className="divider" style={{ margin: '20px 0', textAlign: 'center' }}>
              <span>OR CONTINUE WITH</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Signup Failed')}
                useOneTap
              />
            </div>
          </>
        ) : (
          <form className="signup-form" onSubmit={handleVerifyOTP}>
            <div className="input-group">
              <label>ENTER 6-DIGIT OTP SENT TO YOUR EMAIL</label>
              <input
                type="text"
                placeholder="e.g. 123456"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{ letterSpacing: '8px', fontSize: '20px', textAlign: 'center' }}
              />
            </div>

            <button type="submit" className="signup-btn" disabled={otpLoading}>
              {otpLoading ? 'Verifying...' : 'Verify Email & Complete Signup'}
            </button>
          </form>
        )}

        <p className="footer-text" style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;