import { useNavigate } from "react-router-dom";
import { dummyVenues } from "./Components/VendorsData";
import "./Decorators.css";

export default function Decorators() {
  const navigate = useNavigate();

  const decorators = dummyVenues.filter(
    (v) => v.type.toLowerCase() === "decorators"
  );

  return (
    <div className="vlp-page">
      <div className="vlp-header">
        <div className="vlp-header-content">
          <h1>Find Your Perfect Decorator</h1>
          <p>{decorators.length} decorators available</p>
        </div>
      </div>

      <div className="vlp-body">
        <main className="vlp-results">
          <div className="vlp-cards">
            {decorators.length === 0 ? (
              <div className="vlp-no-results">
                <p>No decorators found!</p>
              </div>
            ) : (
              decorators.map((vendor) => (
                <div key={vendor.UserId} className="vlp-card">
                  <div className="vlp-card-image">
                    <img src={vendor.image} alt={vendor.name} />
                    {vendor.topPick && (
                      <span className="vlp-top-pick">⭐ Top Pick</span>
                    )}
                    <span className="vlp-venue-type-badge">{vendor.type}</span>
                  </div>
                  <div className="vlp-card-info">
                    <div className="vlp-card-top">
                      <h3>{vendor.name}</h3>
                      <div className="vlp-rating">
                        <span className="vlp-star">★</span>
                        <span>{vendor.rating}</span>
                        <span className="vlp-reviews">({vendor.reviews} reviews)</span>
                      </div>
                    </div>
                    <p className="vlp-location"> {vendor.location}</p>
                    <p className="vlp-description">{vendor.description}</p>
                    <div className="vlp-card-tags">
                      {vendor.eventTypes.map((t) => (
                        <span key={t} className="vlp-tag">{t}</span>
                      ))}
                    </div>
                    <div className="vlp-card-footer">
                      <div className="vlp-price">
                        <span className="vlp-price-label">Starting from</span>
                        <span className="vlp-price-value">
                          PKR {vendor.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        className="vlp-details-btn"
                        onClick={() => navigate(`/vendors/${vendor.UserId}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}