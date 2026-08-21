import "./Footer.css";

export default function Footer() {
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