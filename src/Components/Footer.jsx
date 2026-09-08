import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFaqClick = (e) => {
    e.preventDefault();

    const scrollToFaq = () => {
      const element = document.getElementById("faq-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    
    if (location.pathname === "/services") {
      scrollToFaq();
    } else {
      // first navigate then scroll
      navigate("/services");
      setTimeout(() => {
        scrollToFaq();
      }, 300);
    }
  };

  return (
    <footer className="ee-footer">
      <div className="ee-footer-grid">
        <div>
          <div className="ee-footer-brand">Event<span>Ease</span></div>
          <p className="ee-footer-desc">
            Redefining the art of celebration through a seamless digital experience.
            We bring your dreams to life with meticulous attention to detail.
          </p>
        </div>
        <div className="ee-footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/vendors">Vendors</Link>
          <Link to={`/vendors?category=${encodeURIComponent("Venues & Marquees")}`}>Venues</Link>
        </div>
        <div className="ee-footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
        <div className="ee-footer-col">
          <h4>Support</h4>
          <Link to="/contact">Contact Us</Link>
          
          {/*  Updated FAQ Link with Smooth Scroll */}
          <a href="#faq-section" onClick={handleFaqClick}>
            FAQ
          </a>
          
          {/* <Link to="/community">Community</Link> */}
        </div>
      </div>
      <div className="ee-footer-bottom">
        <p>&copy; {new Date().getFullYear()} EventEase. All rights reserved.</p>
        <div className="ee-footer-icons">
          <div className="ee-footer-icon">🌐</div>
          <div className="ee-footer-icon">↗</div>
          <div className="ee-footer-icon">♥</div>
        </div>
      </div>
    </footer>
  );
}