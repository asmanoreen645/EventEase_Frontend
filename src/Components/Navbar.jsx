import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX } from "react-icons/fi"; // Task 4: Mobile drawer icons
import NotificationBell from "./NotificationBell";
import { useAuth } from "../Components/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState(false); // Task 4: Mobile drawer state
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const avatarLetter = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  return (
    <nav className="ee-nav">
      <div className="ee-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Event<span>Ease</span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="ee-nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-active" : ""}>Home</NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? "nav-active" : ""}>Services</NavLink>
        <NavLink to="/vendors" className={({ isActive }) => isActive ? "nav-active" : ""}>Vendors</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-active" : ""}>About Us</NavLink>
      </div>

      <div className="ee-nav-actions">
        {/* Task 2: Notification Bell for Logged-In Users */}
        {user && <NotificationBell />}

        {user ? (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <div className="ee-user-trigger" onClick={() => setShowDropdown(!showDropdown)}>
              {/* : Avatar / Image */}
              <div className="ee-avatar-circle">
                {user.avatar ? <img src={user.avatar} alt="Avatar" /> : avatarLetter}
              </div>

              {/* : Dynamic Role Badge */}
              <span className={`ee-role-badge badge-${user.role || 'customer'}`}>
                {user.role || 'customer'}
              </span>
            </div>

            {/* User Dropdown */}
            {showDropdown && (
              <div className="ee-dropdown-menu">
                <div className="ee-dropdown-header">
                  <p className="ee-dropdown-name">{user.name || "User"}</p>
                  <p className="ee-dropdown-email">{user.email}</p>
                </div>

                <div className="ee-dropdown-item" onClick={() => { navigate('/profile-settings'); setShowDropdown(false); }}>
               Profile Settings
               </div>

                {/* : Customer Navigation */}
                {user.role === 'customer' && (
                  <div className="ee-dropdown-item" onClick={() => { navigate('/customer-dashboard'); setShowDropdown(false); }}>
                    My dashboard
                  </div>
                )}

                {/* : Conditional Vendor Navigation */}
                {user.role === 'vendor' && (
                  <>
                    <div className="ee-dropdown-item" onClick={() => { navigate('/vendor-profile'); setShowDropdown(false); }}>
                      Vendor Profile
                    </div>
                    {user.isVerified && (
                      <div className="ee-dropdown-item ee-highlight" onClick={() => { navigate('/vendor-dashboard'); setShowDropdown(false); }}>
                        Vendor Dashboard
                      </div>
                    )}
                  </>
                )}

                <div className="ee-dropdown-item ee-logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="ee-auth-btns">
            <button className="ee-btn-ghost" onClick={() => navigate('/login')}>Login</button>
            <button className="ee-btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        )}

        {/* Task 4: Mobile Menu Toggle Button */}
        <button className="ee-mobile-toggle" onClick={() => setMobileDrawer(!mobileDrawer)}>
          {mobileDrawer ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Task 4: Mobile Responsive Navigation Drawer */}
      {mobileDrawer && (
        <div className="ee-mobile-drawer">
          <NavLink to="/" onClick={() => setMobileDrawer(false)}>Home</NavLink>
          <NavLink to="/services" onClick={() => setMobileDrawer(false)}>Services</NavLink>
          <NavLink to="/vendors" onClick={() => setMobileDrawer(false)}>Vendors</NavLink>
          <NavLink to="/about" onClick={() => setMobileDrawer(false)}>About Us</NavLink>
        </div>
      )}
    </nav>
  );
}