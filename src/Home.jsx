import { useState } from "react";
import "./Home.css"; // CSS import karein

const countries = ["Pakistan", "United Kingdom", "United States", "UAE", "Saudi Arabia", "India", "Canada", "Australia"];
const citiesByCountry = {
  Pakistan: ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Multan"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina"],
  India: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
};

const services = [
  { label: "Weddings", emoji: "💍", bg: "#1a1209" },
  { label: "Corporate", emoji: "🤝", bg: "#0d1a1a" },
  { label: "Parties", emoji: "🎉", bg: "#1a0d0d" },
  { label: "Social Gatherings", emoji: "🥂", bg: "#0d1209" },
  { label: "Gala Dinners", emoji: "🕯️", bg: "#12090d" },
  { label: "Festivals", emoji: "🎆", bg: "#090d1a" },
];

const vendors = [
  {
    name: "Floral Fantasy Decor",
    sub: "Premium Event Styling & Floral Design",
    rating: 4.9,
    tags: ["LONDON", "DECORATION"],
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    name: "Moments Captured",
    sub: "Cinematic Photography & Videography",
    rating: 5.0,
    tags: ["REMOTE", "MEDIA"],
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  },
  {
    name: "Grand Marque Venues",
    sub: "Exclusive Outdoor Venue Solutions",
    rating: 4.8,
    tags: ["COUNTRYWIDE", "VENUES"],
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
  },
];

const serviceImages = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&q=80",
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=300&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80",
];

export default function Home() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const cities = country ? citiesByCountry[country] || [] : [];

  return (
    <div className="ee-main-wrapper">
      {/* NAV */}
      <nav className="ee-nav">
        <div className="ee-logo">Event<span>Ease</span></div>
        <div className="ee-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">Services</a>
          <a href="#">Vendors</a>
          <a href="#">About Us</a>
        </div>
        <div className="ee-nav-actions">
          <button className="ee-btn-ghost">Login</button>
          <button className="ee-btn-primary">Sign Up</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="ee-hero">
        <div className="ee-hero-bg" />
        <div className="ee-hero-overlay" />
        <div className="ee-hero-content">
          <h1>Your Dream Event,<br /><em>Just A Click Away</em></h1>

          {/* SEARCH BAR */}
          <div className="ee-search-bar">
            <select
              className="ee-search-select"
              value={country}
              onChange={e => { setCountry(e.target.value); setCity(""); }}
            >
              <option value="" disabled hidden>🌍  Select Country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="ee-search-divider" />

            <select
              className="ee-search-select"
              value={city}
              onChange={e => setCity(e.target.value)}
              disabled={!country}
            >
              <option value="" disabled hidden>🏙️  {country ? "Select City" : "Select Country First"}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button className="ee-search-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="ee-section">
        <h2 className="ee-section-title">Our Services</h2>
        <div className="ee-section-rule" />
        <div className="ee-services-grid">
          {services.map((s, i) => (
            <div className="ee-service-card" key={s.label}>
              <div className="ee-service-img">
                <div
                  className="ee-service-img-inner"
                  style={{ backgroundImage: `url(${serviceImages[i]})` }}
                />
                <div className="ee-service-emoji">{s.emoji}</div>
              </div>
              <span className="ee-service-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* VENDORS */}
      <section className="ee-vendors-section">
        <div className="ee-vendors-header">
          <div>
            <h2>Find the Perfect Vendor</h2>
            <p>Handpicked professionals dedicated to bringing your unique vision to life with precision and grace.</p>
          </div>
          <a href="#" className="ee-view-all">View All Vendors →</a>
        </div>
        <div className="ee-vendors-grid">
          {vendors.map(v => (
            <div className="ee-vendor-card" key={v.name}>
              <div className="ee-vendor-img-wrap">
                <img className="ee-vendor-img" src={v.img} alt={v.name} />
                <div className="ee-vendor-rating">★ {v.rating}</div>
              </div>
              <div className="ee-vendor-body">
                <div className="ee-vendor-name">{v.name}</div>
                <div className="ee-vendor-sub">{v.sub}</div>
                <div className="ee-tags">
                  {v.tags.map(t => <span className="ee-tag" key={t}>{t}</span>)}
                </div>
                <button className="ee-book-btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ee-footer">
        <div className="ee-footer-grid">
          <div>
            <div className="ee-footer-brand">Event<span>Ease</span></div>
            <p className="ee-footer-desc">Redefining the art of celebration through a seamless digital experience. We bring your dreams to life with meticulous attention to detail.</p>
          </div>
          <div className="ee-footer-col">
            <h4>Explore</h4>
            <a href="#">Vendors</a>
            <a href="#">Venues</a>
            <a href="#">Portfolio</a>
          </div>
          <div className="ee-footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="ee-footer-col">
            <h4>Support</h4>
            <a href="#">Contact</a>
            <a href="#">FAQ</a>
            <a href="#">Community</a>
          </div>
        </div>
        <div className="ee-footer-bottom">
          <p>© 2024 EVENTEASE. CURATING EXCELLENCE IN EVERY DETAIL</p>
          <div className="ee-footer-icons">
            <div className="ee-footer-icon">🌐</div>
            <div className="ee-footer-icon">↗</div>
            <div className="ee-footer-icon">♥</div>
          </div>
        </div>
      </footer>
    </div>
  );
}