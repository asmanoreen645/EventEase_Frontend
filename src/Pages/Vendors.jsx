import React, { useState } from "react";
import "./Vendors.css";

// ===== SVG ICONS =====
const VenueIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <rect x="3" y="10" width="18" height="11" rx="1"/>
    <path d="M9 21V12h6v9"/>
    <path d="M3 10l9-7 9 7"/>
  </svg>
);

const MarqueeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
    <path d="M7 9h10"/>
  </svg>
);

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const DecoratorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ===== DATA =====
const events = [
  { id: 1, label: "Birthdays", bg: "linear-gradient(135deg, #e74c3c, #c0392b)", },
  { id: 2, label: "Weddings",  bg: "linear-gradient(135deg, #27ae60, #1e8449)", },
  { id: 3, label: "Parties",   bg: "linear-gradient(135deg, #8e44ad, #6c3483)", },
  { id: 4, label: "Corporate", bg: "linear-gradient(135deg, #2980b9, #1a6090)", },
];

const categories = [
  { label: "Venues & Halls", Icon: VenueIcon },
  { label: "Marquees",       Icon: MarqueeIcon },
  { label: "Photographers",  Icon: CameraIcon },
  { label: "Decorators",     Icon: DecoratorIcon },
];

// ===== COMPONENT =====
export default function Vendors() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [search, setSearch] = useState("");

  const visible = [0, 1, 2].map((i) => events[(activeSlide + i) % events.length]);

  return (
    <div className="vendors-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span className="brand-name">EventEase</span>
        </div>

        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#" className="active">Services</a></li>
          <li><a href="#">Vendors</a></li>
          <li><a href="#">About Us</a></li>
        </ul>

        <div className="nav-auth">
          <button className="btn-signup">Sign Up</button>
          <button className="btn-login">Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Explore Our Services</h1>
          <p>Just a Click Away</p>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">
            <SearchIcon />
          </button>
        </div>
      </section>

      {/* EVENTS */}
      <section className="events-section">
        <h2>Our Events</h2>
        <div className="events-carousel">
          {visible.map((ev) => (
            <div className="event-card" key={ev.id} style={{ background: ev.bg }}>
              <div className="event-emoji">{ev.emoji}</div>
              <span className="event-label">{ev.label}</span>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {events.map((_, i) => (
            <button
              key={i}
              className={"dot" + (activeSlide === i ? " dot-active" : "")}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <h2>Find Services by Category</h2>
        <div className="categories-grid">
          {categories.map(({ label, Icon }) => (
            <div className="category-card" key={label}>
              <div className="category-icon">
                <Icon />
              </div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="footer-social">
          <a href="#">𝕏</a>
          <a href="#">f</a>
        </div>
      </footer>

    </div>
  );
}