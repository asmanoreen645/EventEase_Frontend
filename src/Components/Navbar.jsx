import { useNavigate, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import NotificationBell from "./NotificationBell";
import { useAuth } from "../Components/AuthContext"; // apna actual path check kar lena
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
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

  // Email ka pehla letter avatar k liye (jaise "a" for asma@gmail.com)
  const avatarLetter = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  return (
    <nav className="ee-nav">
      <div className="ee-logo">Event<span>Ease</span></div>
      <div className="ee-nav-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/vendors">Vendors</Link>
        <Link to="/about">About Us</Link>
      </div>
      <div className="ee-nav-actions">
        <NotificationBell />

        {user ? (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#1a1a2e",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {avatarLetter}
            </div>

            {showDropdown && (
  <div
    style={{
      position: "absolute",
      top: "45px",
      right: 0,
      background: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      borderRadius: "8px",
      width: "160px",
      zIndex: 1000,
    }}
  >
    <div style={{ padding: "10px", borderBottom: "1px solid #eee", fontSize: "13px", color: "#888" }}>
      {user.email}
    </div>
    <div
      onClick={() => { navigate('/profile'); setShowDropdown(false); }}
      style={{ padding: "10px", cursor: "pointer" }}
    >
      Profile
    </div>

    {/* NAYA ADDITION */}
    {user.role === 'customer' && (
      <div
        onClick={() => { navigate('/customer-dashboard'); setShowDropdown(false); }}
        style={{ padding: "10px", cursor: "pointer" }}
      >
        My Dashboard
      </div>
    )}

    <div
      onClick={handleLogout}
      style={{ padding: "10px", cursor: "pointer", color: "red" }}
    >
      Logout
    </div>
  </div>
)}
          </div>
        ) : (
          <>
            <button className="ee-btn-ghost" onClick={() => navigate('/login')}>Login</button>
            <button className="ee-btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}