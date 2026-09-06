import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

function VendorHeader({ vendor, navigate, onBookNow }) {
  return (
    <div className="vendor-header">
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

      <div className="vendor-header__info">
        <div className="vendor-header__name-row">
          <h1 className="vendor-header__name">{vendor.name}</h1>
          <div className="vendor-header__rating">
            <span
              className="material-symbols-outlined star"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>{Number(vendor.rating || 0).toFixed(1)} Rating</span>
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
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 17, color: "#6b7280" }}
            >
              location_on
            </span>
            {vendor.location}
          </div>
        </div>

        <div className="vendor-header__cta">
          <button
            className="btn-chat"
            onClick={() =>
              navigate(`/chat/${vendor._id || vendor.UserId || vendor.id}`)
            }
          >
            Chat with Vendor
          </button>
          <button className="btn-book" onClick={onBookNow}>
            Book Now
          </button>
          <button className="btn-deposit" onClick={onBookNow}>
            Pay Deposit
          </button>
        </div>
      </div>
    </div>
  );
}

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
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_right_alt
          </span>
        </a>
      </div>

      <div className="portfolio-grid">
        {items.map((item) => (
          <div
            key={item.UserId}
            className={`portfolio-item${
              item.featured ? " portfolio-item--featured" : ""
            }`}
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

function isValidObjectId(id) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

function RatingSection({ vendorId, onRatingSuccess }) {
  const [userRating, setUserRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const isDummy =
    !isValidObjectId(vendorId) || String(vendorId).startsWith("vendor");

  // Fetch existing reviews for this vendor when component loads
  useEffect(() => {
    const fetchReviews = async () => {
      if (isDummy) return;
      try {
        const res = await API.get(`/reviews/vendor/${vendorId}`);
        if (res.data.success) {
          setReviewsList(res.data.reviews || []);
          if (res.data.averageRating) {
            setAverageRating(res.data.averageRating);
            if (onRatingSuccess) onRatingSuccess(res.data.averageRating);
          }
        }
      } catch (err) {
        console.error("Fetch reviews error:", err);
      }
    };
    fetchReviews();
  }, [vendorId, isDummy]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const customerId = localStorage.getItem("userId");

    if (!customerId) {
      alert("Please log in first to submit a review!");
      return;
    }

    if (isDummy) {
      setRatingSubmitted(true);
      alert(`Demo Mode: You submitted ${userRating} stars and a review! ⭐`);
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/reviews", {
        bookingId: localStorage.getItem("lastBookingId") || "650712345678901234567890",
        vendorId,
        rating: userRating,
        comment,
      });

      if (res.data.success) {
        setRatingSubmitted(true);
        alert("Review and rating submitted successfully! Thank you! ⭐");
        
        // Refresh reviews list
        const updatedRes = await API.get(`/reviews/vendor/${vendorId}`);
        if (updatedRes.data.success) {
          setReviewsList(updatedRes.data.reviews || []);
          setAverageRating(updatedRes.data.averageRating);
          if (onRatingSuccess) onRatingSuccess(updatedRes.data.averageRating);
        }
      }
    } catch (err) {
      console.error("Review error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#fff",
        borderRadius: "12px",
        marginTop: "20px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h3
        style={{
          marginBottom: "6px",
          color: "#1e293b",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        Vendor Reviews & Ratings {averageRating > 0 && `(${averageRating} ⭐)`}
      </h3>

      {isDummy && (
        <p
          style={{
            marginBottom: "10px",
            color: "#b45309",
            fontSize: "12px",
            fontStyle: "italic",
          }}
        >
          (Demo mode active — test review UI)
        </p>
      )}

      {/* SUBMIT REVIEW FORM */}
      {!ratingSubmitted ? (
        <form onSubmit={handleReviewSubmit} style={{ marginTop: "15px" }}>
          <p style={{ marginBottom: "8px", color: "#6b7280", fontSize: "14px" }}>
            Share your experience with this vendor:
          </p>
          
          {/* Star Selection */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                  color:
                    star <= (hoveredRating || userRating) ? "#f59e0b" : "#d1d5db",
                  transition: "color 0.15s",
                }}
              >
                ★
              </span>
            ))}
          </div>

          {/* Comment Input */}
          <textarea
            rows="3"
            placeholder="Write your review comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "12px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
          <span style={{ fontSize: "24px" }}>✅</span>
          <p style={{ color: "#10b981", fontWeight: 500 }}>
            Your review has been submitted successfully! Thank you.
          </p>
        </div>
      )}

      {/* DISPLAY EXISTING REVIEWS */}
      <div style={{ marginTop: "30px" }}>
        <h4 style={{ fontSize: "16px", marginBottom: "12px", color: "#334155" }}>
          All Customer Reviews ({reviewsList.length})
        </h4>
        {reviewsList.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>No reviews yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviewsList.map((rev) => (
              <div
                key={rev._id}
                style={{
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "14px", color: "#1e293b" }}>
                    {rev.customerId?.name || "Customer"}
                  </strong>
                  <span style={{ color: "#f59e0b", fontSize: "14px" }}>
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
                  {rev.comment || "No comment provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryFromType(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("photo")) return "photographer";
  if (t.includes("decor")) return "decorator";
  return "venue";
}

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setVendor } = useBooking();

  const [vendor, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get("/api/vendors/search");
        const allVendors = res.data.vendors || [];
        const foundReal = allVendors.find((v) => v._id === id);

        if (foundReal) {
          setVendorData({
            _id: foundReal._id,
            name: foundReal.businessName || "Unnamed Vendor",
            phone: foundReal.phone || "Not provided",
            email: foundReal.email || "Not provided",
            location: foundReal.location?.city || "Location not set",
            rating: foundReal.rating || 0,
            avatarLabel: foundReal.businessName?.charAt(0) || "V",
            price: foundReal.price || 0,
            type: foundReal.category || "venue",
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Real vendor fetch error:", err);
      }

      const foundDummy = dummyVenues.find(
        (v) => String(v._id) === String(id) || String(v.UserId) === String(id)
      );

      if (foundDummy) {
        setVendorData({
          ...foundDummy,
          _id: foundDummy._id || foundDummy.UserId || foundDummy.id,
        });
      } else {
        setError("Vendor not found");
      }

      setLoading(false);
    };

    fetchVendor();
  }, [id]);

  if (loading) return <p>Loading vendor...</p>;
  if (error || !vendor) return <p>Vendor not found</p>;

  const handleBookNow = () => {
    setVendor({
      id: vendor._id || vendor.UserId,
      name: vendor.name,
      category: getCategoryFromType(vendor.type),
      price: vendor.price,
    });
    navigate("/details");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <main className="vendor-page">
        <VendorHeader
          vendor={vendor}
          navigate={navigate}
          onBookNow={handleBookNow}
        />
        <PortfolioSection items={portfolioItems} />
        <ServicesSection services={services} />
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <div>
            <VendorCalendar vendor={vendor} />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "300px",
              height: "300px",
              position: "relative",
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                color: "#888",
                fontSize: "14px",
              }}
            >
              VENDOR LOCATION
            </h3>
            <VendorMap />
          </div>
        </div>

        <RatingSection
          vendorId={vendor._id}
          onRatingSuccess={(newRating) => {
            setVendorData((prev) => ({ ...prev, rating: newRating }));
          }}
        />
      </main>
    </>
  );
}