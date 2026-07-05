import { useState } from 'react';
import './Signup.css';
import API from './api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role 'customer' rahega
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic Form Validation
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

      const { token, user } = response.data;

      // LocalStorage me user data save karna
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);

   if (user.role === 'vendor') {
  navigate('/vendor-register');   // Vendor → seedha registration form
} else {
  navigate('/login');             // Customer → login page
}
      
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("ERROR RESPONSE:", err.response);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join EventEase to start managing your events.</p>

        {error && <p className="error-message" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}

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
              {/* 🔒 Security Fix: Admin option permanently removed from public registration */}
            </select>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;