import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import "./Home.css";

const heroImages = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
  "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1600&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80",
  "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1600&q=80",
];

const countries = ["Pakistan"];

const provincesByCountry = {
  Pakistan: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital", "Azad Kashmir"]
};

const citiesByProvince = {
  Punjab: ["Lahore", "Rawalpindi", "Mandi Bahauddin", "Gujrat", "Faisalabad", "Multan", "Sialkot"],
  Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Abbottabad", "Mardan"],
  Balochistan: ["Quetta", "Gwadar"],
  "Islamabad Capital": ["Islamabad"],
  "Azad Kashmir": ["Muzaffarabad", "Mirpur"]
};

const services = [
  { label: "Weddings", bg: "#1a1209" },
  { label: "Corporate", bg: "#0d1a1a" },
  { label: "Parties", bg: "#1a0d0d" },
  { label: "Social Gatherings", bg: "#0d1209" },
  { label: "Gala Dinners", bg: "#12090d" },
  { label: "Festivals", bg: "#090d1a" },
];

const vendors = [
  {
    id: "1",
    name: "Floral Fantasy Decor",
    sub: "Premium Event Styling & Floral Design",
    rating: 4.9,
    tags: ["LAHORE", "DECORATION"],
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    id: "2",
    name: "Moments Captured",
    sub: "Cinematic Photography & Videography",
    rating: 5.0,
    tags: ["ISLAMABAD", "MEDIA"],
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  },
  {
    id: "3",
    name: "Royal Palace Marquee",
    sub: "Exclusive Wedding & Event Venues",
    rating: 4.8,
    tags: ["MANDI BAHAUDDIN", "VENUES"],
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
  },
];

const serviceImages = [
  [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80",
    "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=300&q=80",
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=300&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
  ],
];

export default function Home() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("Pakistan");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [serviceSlide, setServiceSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setServiceSlide(prev => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const availableProvinces = country ? provincesByCountry[country] || [] : [];
  const availableCities = province ? citiesByProvince[province] || [] : [];
  
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (country) queryParams.append("country", country);
    if (province) queryParams.append("province", province);
    if (city) queryParams.append("city", city);
    
    const queryString = queryParams.toString();
    navigate(queryString ? `/vendors?${queryString}` : '/vendors');
  };

  return (
    <div className="ee-main-wrapper">
      {/* HERO SECTION */}
      <section className="ee-hero">
        <video className="ee-hero-video" autoPlay loop muted playsInline>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="ee-hero-overlay" />
        <div className="ee-hero-content">
          <div className="trust-badge">
            <span className="badge-dot"></span>
            Pakistan's #1 Event Platform
            <span className="badge-new">NEW</span>
          </div>
          <h1>Your Dream Event,<br /><em>Just A Click Away</em></h1>
          <p className="ee-hero-subtitle">Discover top vendors, venues & services for your perfect event</p>
          
          <div className="ee-search-bar">
            {/* COUNTRY DROPDOWN */}
            <svg className="ee-field-icon" viewBox="0 0 24 24" fill="none" stroke="#b4945a" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <div className="ee-field-inner">
              <span className="ee-field-label">COUNTRY</span>
              <select
                className="ee-search-select"
                value={country}
                onChange={e => { setCountry(e.target.value); setProvince(""); setCity(""); }}
              >
                <option value="">All Countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="ee-search-divider" />

            {/* PROVINCE DROPDOWN */}
            <svg className="ee-field-icon" viewBox="0 0 24 24" fill="none" stroke="#b4945a" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <div className="ee-field-inner">
              <span className="ee-field-label">PROVINCE</span>
              <select
                className="ee-search-select"
                value={province}
                onChange={e => { setProvince(e.target.value); setCity(""); }}
                disabled={!country}
              >
                <option value="">{country ? "All Provinces" : "Select Country First"}</option>
                {availableProvinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="ee-search-divider" />

            {/* CASCADING CITY DROPDOWN */}
            <svg className="ee-field-icon" viewBox="0 0 24 24" fill="none" stroke="#b4945a" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div className="ee-field-inner">
              <span className="ee-field-label">CITY</span>
              <select
                className="ee-search-select"
                value={city}
                onChange={e => setCity(e.target.value)}
                disabled={!province}
              >
                <option value="">{province ? "Select City" : "Select Province First"}</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button className="ee-search-btn" onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>

          <div className="ee-hero-dots">
            {heroImages.map((_, i) => (
              <button
                key={i}
                className={`ee-hero-dot ${i === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="ee-section">
        <h2 className="ee-section-title">Our Services</h2>
        <div className="ee-section-rule" />
        <div className="ee-services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          width: '100%'
        }}>
          {services.map((s, i) => (
            <div 
              className="ee-service-card" 
              key={s.label} 
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => navigate(`/vendors?category=${encodeURIComponent(s.label)}`)}
            >
              <div className="ee-service-img">
                {serviceImages[i].map((imgUrl, imgIdx) => (
                  <div
                    key={imgIdx}
                    className={`ee-service-img-inner ${imgIdx === serviceSlide % serviceImages[i].length ? "active" : ""}`}
                    style={{ backgroundImage: `url(${imgUrl})` }}
                  />
                ))}
              </div>
              <span className="ee-service-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED VENDORS SECTION */}
      <section className="ee-vendors-section">
        <div className="ee-vendors-header">
          <div>
            <h2>Find the Perfect Vendor</h2>
            <p>Handpicked professionals dedicated to bringing your unique vision to life with precision and grace.</p>
          </div>
          <a onClick={() => navigate('/vendors')} className="ee-view-all" style={{cursor:'pointer'}}>View All Vendors →</a>
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
                <button className="ee-book-btn" onClick={() => navigate(`/vendors/${v.id}`)}> View Details </button>
              </div>
            </div>
          ))}
        </div>
      </section>      
    </div>
  );
}