import { useState } from 'react';
import './Signup.css';
import API from './api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './Components/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

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

  // Task 26: Live Password Strength Gauge Logic
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: '#e0e0e0', width: '0%' };
    
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
      case 2:
        return { score, label: 'Weak', color: '#ff4d4f', width: '33%' };
      case 3:
      case 4:
        return { score, label: 'Medium', color: '#faad14', width: '66%' };
      case 5:
        return { score, label: 'Strong', color: '#52c41a', width: '100%' };
      default:
        return { score: 0, label: 'Too Short', color: '#ff4d4f', width: '15%' };
    }
  };

  const strength = getPasswordStrength(password);

  // Handlers for Initial Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      const msg = 'Please fill in all fields.';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setError(msg);
      toast.error(msg);
      return;
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
        toast.success("OTP sent to your email!");
        setShowOtpModal(true);
      }
      
    } catch (err) {
      console.log("FULL ERROR:", err);
      const errMsg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handler for OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      const msg = 'Please enter the OTP code.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setOtpLoading(true);

    try {
      const response = await API.post('/api/auth/verify-otp', {
        email,
        otp
      });

      const { token, user } = response.data;
      login(user, token);
      toast.success("Account verified successfully!");

      if (user.role === 'vendor') {
        navigate('/vendor-register');
      } else {
        navigate('/login');
      }

    } catch (err) {
      console.log("OTP VERIFY ERROR:", err);
      const errMsg = err.response?.data?.message || 'OTP Verification Failed.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // Google Signup/Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await API.post('/api/auth/google', {
        token: credentialResponse.credential,
         role: role 
      });

      const { token, user } = response.data;
      login(user, token);
      toast.success("Signed in with Google!");

      if (user.role === 'vendor') {
        navigate('/vendor-register');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      const errMsg = err.response?.data?.message || 'Google Auth Failed';
      setError(errMsg);
      toast.error(errMsg);
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
                <div className="password-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', paddingRight: '45px' }}
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      cursor: 'pointer',
                      fontSize: '18px',
                      userSelect: 'none'
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>

                {/*  Live Password Strength Bar */}
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ height: '5px', width: '100%', backgroundColor: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: strength.width, 
                          backgroundColor: strength.color, 
                          transition: 'width 0.3s ease, background-color 0.3s ease' 
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: strength.color, fontWeight: 'bold', marginTop: '4px', display: 'block' }}>
                      Strength: {strength.label}
                    </span>
                  </div>
                )}
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
                onError={() => {
                  setError('Google Signup Failed');
                  toast.error('Google Signup Failed');
                }}
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