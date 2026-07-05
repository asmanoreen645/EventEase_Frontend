import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Services.css";

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
const heroImages = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80",
  "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1600&q=80",
];
const events = [
  { id: 1, label: "Birthdays", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80" },
  { id: 2, label: "Weddings",  img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
  { id: 3, label: "Parties",   img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80" },
  { id: 4, label: "Corporate", img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80" },
];


const categories = [
  { label: "Venues & Halls", Icon: VenueIcon, path: "/vendors" },
  { label: "Marquees", Icon: MarqueeIcon, path: "/vendors" },
  { label: "Photographers", Icon: CameraIcon, path: "/photographer" },
  { label: "Decorators", Icon: DecoratorIcon, path: "/decorators" },
];

// ===== COMPONENT =====
export default function Vendors() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const [search, setSearch] = useState("");

  const visible = [0, 1, 2].map((i) => events[(activeSlide + i) % events.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % events.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="vendors-page"> 
      {/* HERO */}
      <section className="hero-section">
{heroImages.map((img, i) => (
          <div
            key={i}
            className={`hero-bg-slide ${i === heroSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-overlay" />
  <span className="hero-badge">Explore all services</span>
  <h1>Everything For Your Perfect Event</h1>
  <p>Search, compare, and book trusted vendors in minutes</p>
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search photographers, venues, decor..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button className="search-btn">Search</button>
  </div>
</section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <h2>Find Services by Category</h2>
        <div className="categories-grid">
          {categories.map(({ label, Icon, path }) => (
         <div className="category-card" key={label} onClick={() => navigate(path)} style={{cursor: "pointer"}}>
          <div className="category-icon">
         <Icon />
         </div>
         <p>{label}</p>
                 </div>
                 ))}
            </div>
      </section>
    </div>
  );
}