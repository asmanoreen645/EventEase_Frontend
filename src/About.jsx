import './About.css';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="ee-about-container">
      {/* 1. HERO BANNER */}
      <header className="ee-hero-section">
        <div className="ee-hero-overlay">
          <h1>About EventEase</h1>
          <p>Experience Your Event Before It Happens</p>
        </div>
      </header>

      {/* 2. MISSION & VISION SECTION */}
      <section className="ee-content-section">
        <h2 className="ee-section-title">Our Mission & Vision</h2>
        <div className="ee-mission-vision-grid">
          <div className="ee-mv-card">
            <div className="ee-card-icon-wrapper mission-icon"></div>
            <h3>Our Mission</h3>
            <p>
              To seamlessly blend technology and celebration, making dream events an accessible 
              and stress-free reality for everyone through innovative virtual planning.
            </p>
          </div>
          <div className="ee-mv-card">
            <div className="ee-card-icon-wrapper vision-icon"></div>
            <h3>Our Vision</h3>
            <p>
              To become the world's leading platform for virtual event planning, transforming 
              how people experience and book venues from anywhere on the globe.
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY SECTION (Timeline layout) */}
      <section className="ee-content-section">
        <h2 className="ee-section-title">Our Story</h2>
        <div className="ee-timeline">
          <div className="ee-timeline-item">
            <div className="ee-timeline-dot"></div>
            <div className="ee-timeline-content">
              <h4>The Spark of an Idea</h4>
              <p>
                Born from a passion for celebration and a frustration with traditional event planning, 
                EventEase was founded to make magical moments easier to create for everyone.
              </p>
            </div>
          </div>
          <div className="ee-timeline-item">
            <div className="ee-timeline-dot"></div>
            <div className="ee-timeline-content">
              <h4>Building the Dream</h4>
              <p>
                We brought together a team of tech innovators and event experts to build a platform 
                that offers something truly unique: the ability to virtually step inside a venue from home.
              </p>
            </div>
          </div>
          <div className="ee-timeline-item">
            <div className="ee-timeline-dot"></div>
            <div className="ee-timeline-content">
              <h4>Launching the Future</h4>
              <p>
                Today, EventEase is the premier destination for planning birthdays, weddings, and more, 
                empowering users to experience, book, and manage their perfect event with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES SECTION */}
      <section className="ee-content-section ee-services-bg">
        <h2 className="ee-section-title">Our Services</h2>
        <div className="ee-services-grid">
          {/* Service 1 */}
          <div className="ee-service-card">
            <div className="ee-service-icon"></div>
            <h3>Birthday Parties</h3>
            <p>
              From intimate gatherings to grand celebrations, we provide the tools to plan the perfect 
              birthday bash. Discover themes, venues, and vendors with ease.
            </p>
          </div>
          {/* Service 2 */}
          <div className="ee-service-card">
            <div className="ee-service-icon">💜</div>
            <h3>Wedding Events</h3>
            <p>
              Your dream wedding starts here. Virtually tour stunning venues, connect with top-tier 
              planners, and manage every detail for your special day.
            </p>
          </div>
          {/* Service 3 */}
          <div className="ee-service-card">
            <div className="ee-service-icon"></div>
            <h3>Online Venue Visits</h3>
            <p>
              Our signature feature. Explore event spaces with immersive 360° virtual tours, saving 
              you time and helping you find the perfect fit from anywhere.
            </p>
          </div>
          {/* Service 4 */}
          <div className="ee-service-card">
            <div className="ee-service-icon"></div>
            <h3>Vendor Browsing & Booking</h3>
            <p>
              Access our curated marketplace of trusted vendors, from caterers and photographers to 
              florists and entertainers. Book and manage them all in one place.
            </p>
          </div>
        </div>
      </section>
      
      {/* 5. CTA BANNER */}
      <div className="ee-cta-banner">
        <h2>Ready to plan your dream event?</h2>
        <p>Join thousands already planning with EventEase.</p>
        <button className="ee-cta-btn" onClick={() => navigate("/signup")}>
          Sign Up Free
        </button>
      </div>
    </div>
  );
}