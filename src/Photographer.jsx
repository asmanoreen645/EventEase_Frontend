import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBooking } from "./Components/BookingContext";
import { dummyVenues } from "./Components/VendorsData";
import VendorCalendar from "./Components/VendorCalendar";
import VendorMap from "./Components/VendorMap";
import API from "./api/axiosConfig";
import "./Photographer.css";


const portfolioItems = [
  {
    UserId: 1,
    featured: true,
    caption: "Grand Banquet Gala",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=80",
    hasPlay: true,
  },
  {
    UserId: 2,
    img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80",
    hasPlay: true,
  },
  {
    UserId: 3,
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
    hasPlay: true,
  },
  {
    UserId: 4,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    hasPlay: true,
  },
  {
    UserId: 5,
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
    hasPlay: true,
  },
];

const services = [
  {
    UserId: 1,
    icon: "photo_camera",
    name: "Digital Photography",
    desc: "High-resolution digital coverage using state-of-the-art Sony & Canon systems for crisp, vibrant results.",
    price: "From Rs. 1,200",
  },
  {
    UserId: 2,
    icon: "videocam",
    name: "4K Cinematography",
    desc: "Story-driven wedding films with professional audio recording and color grading for a true movie experience.",
    price: "From Rs. 2,500",
  },
  {
    UserId: 3,
    icon: "auto_fix_high",
    name: "Event Showcase",
    desc: "Complete coverage of corporate events, launches, and gala nights with rapid 24-hour turnaround for socials.",
    price: "From Rs. 8000",
  },
];

// ─── VENDOR HEADER ─────────────────────────────────────────────────────────────
function VendorHeader({ vendor, navigate, onBookNow }) {
  return (
    <div className="vendor-header">
      {/* Avatar */}
      <div className="vendor-header__avatar">
        <div
          className="vendor-header__avatar-img"
          style={{
            background: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: "50%",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 40, color: "#9ca3af" }}
          >
            photo_camera
          </span>
        </div>
        <div className="vendor-header__avatar-label">{vendor.avatarLabel}</div>
      </div>

      {/* Info */}
      <div className="vendor-header__info">
        <div className="vendor-header__name-row">
          <h1 className="vendor-header__name">{vendor.name}</h1>
          <div className="vendor-header__rating">
            <span className="material-symbols-outlined star" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span>{vendor.rating.toFixed(1)} Rating</span>
          </div>
        </div>

        <div className="vendor-header__contacts">
          <div className="vendor-header__contact-item">
            <div className="contact-icon contact-icon--blue">
              <span className="material-symbols-outlined">call</span>
            </div>
            {vendor.phone}
          </div>
          <div className="vendor-header__contact-item">
            <div className="contact-icon contact-icon--teal">
              <span className="material-symbols-outlined">mail</span>
            </div>
            {vendor.email}
          </div>
          <div className="vendor-header__location">
            <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#6b7280" }}>
              location_on
            </span>
            {vendor.location}
          </div>
        </div>

        <div className="vendor-header__cta">
          <button className="btn-chat" onClick={() => navigate(`/chat/${vendor.Id}`)}> Chat with Vendor </button>
          <button className="btn-book" onClick={onBookNow}>Book Now</button>
          <button className="btn-deposit">Pay Deposit</button>
        </div>
      </div>
    </div>
  );
}

// ─── PORTFOLIO SECTION ─────────────────────────────────────────────────────────
function PortfolioSection({ items }) {
  return (
    <section className="portfolio-section">
      <div className="section-header">
        <div className="section-header__text">
          <h2>Our Portfolio</h2>
          <p>A showcase of cinematic excellence and timeless event memories.</p>
        </div>
        <a href="#" className="section-header__link">
          View All
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_right_alt</span>
        </a>
      </div>

      <div className="portfolio-grid">
        {items.map((item) => (
          <div
            key={item.UserId}
            className={`portfolio-item${item.featured ? " portfolio-item--featured" : ""}`}
          >
            <img
              src={item.img}
              alt={item.caption || `Portfolio item ${item.UserId}`}
              className="portfolio-item__img"
            />

            {item.hasPlay && (
              <div className="portfolio-item__play">
                
                  <span className="material-symbols-outlined">play_arrow</span>
                </div>
            )}

            {item.caption && (
              <div className="portfolio-item__caption">{item.caption}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SERVICES SECTION ──────────────────────────────────────────────────────────
function ServicesSection({ services }) {
  return (
    <section className="services-section">
      <div className="services-grid">
        {services.map((s) => (
          <div key={s.UserId} className="service-card">
            <div className="service-card__icon">
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <h3 className="service-card__name">{s.name}</h3>
            <p className="service-card__desc">{s.desc}</p>
            <span className="service-card__price">{s.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
function RatingSection({ vendorUserId }) {
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRating = async (stars) => {
    const customerId = localStorage.getItem("userId");

    if (!customerId) {
      alert("Pehle login karo rating dene ke liye!");
      return;
    }

    try {
      setLoading(true);
      await API.post("/api/ratings/give-rating", {
        vendorId: vendorUserId.toString(),
        customerId,
        stars,
      });
      setUserRating(stars);
      setRatingSubmitted(true);
      alert("Rating submit ho gayi! Shukriya! ⭐");
    } catch (err) {
      console.error("Rating error:", err);
      alert("Rating submit nahi hui. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: "24px",
      background: "#fff",
      borderRadius: "12px",
      marginTop: "20px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
    }}>
      <h3 style={{ marginBottom: "6px", color: "#1e293b", fontSize: "16px", fontWeight: 600 }}>
        Rate this Vendor
      </h3>
      <p style={{ marginBottom: "14px", color: "#6b7280", fontSize: "13px" }}>
        How was your experience?click on stars!
      </p>

      {ratingSubmitted ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "24px" }}>✅</span>
          <p style={{ color: "#1d9e75", fontWeight: 500 }}>
            Aapne {userRating} star rating di! Shukriya!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => !loading && handleRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              style={{
                fontSize: "36px",
                cursor: loading ? "not-allowed" : "pointer",
                color: star <= (hoveredRating || userRating) ? "#f59e0b" : "#d1d5db",
                transition: "color 0.15s",
              }}
            >
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
function getCategoryFromType(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("photo")) return "photographer";
  if (t.includes("decor")) return "decorator";
  return "venue"; // Marquee, Hotel, Farmhouse, Hall, Convention Centre, Caterers
}
export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setVendor } = useBooking();
  const vendor = dummyVenues.find((v) => v.UserId === Number(id));
  console.log("Vendor found:", vendor);
  

  if (!vendor) return <p>Vendor not found</p>;

  const handleBookNow = () => {
  setVendor({
    id: vendor._id,
    name: vendor.name,
    category: getCategoryFromType(vendor.type),
    price: vendor.price,
  });
  navigate("/details");
};

  return (
    <>
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <main className="vendor-page">
        <VendorHeader vendor={vendor} navigate={navigate} onBookNow={handleBookNow} />
        <PortfolioSection items={portfolioItems} />
        <ServicesSection services={services} />
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
  <div>
    <VendorCalendar vendor={vendor} />
  </div>

  <div style={{ flex: 1, minWidth: "300px" }}>
    <h3 style={{ marginBottom: "10px", color: "#888", fontSize: "14px" }}>
      VENDOR LOCATION
    </h3>
    <VendorMap />
     </div>
   </div>

    <RatingSection vendorUserId={vendor.UserId} /> 
      </main>
    </>
  );
}