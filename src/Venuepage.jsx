import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Venuepage.css";
import { Heart } from "lucide-react";
import { dummyVenues } from "./Components/VendorsData";
import API from "./api/axiosConfig";

const VendorsType = ["Photographers", "Caterers", "Decorators"];
const venueTypes = ["All", "Marquee", "Hotel", "Farmhouse", "Hall", "Convention Centre"];
const eventTypes = ["Wedding", "Corporate", "Birthday", "Family"];

// Location Data object for dependent dropdowns
const locationData = {
  Pakistan: ["Lahore", "Islamabad", "Karachi", "Mandi Bahauddin"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
  UK: ["London", "Manchester", "Birmingham"]
};

export default function Venuepage() {
  const [animatedVendors, setAnimatedVendors] = useState(0);
  const [animatedRating, setAnimatedRating] = useState(0);
  const [animatedEvents, setAnimatedEvents] = useState(0);
  const [realVendors, setRealVendors] = useState([]);

  // Fetch real vendors from backend
  useEffect(() => {
    const fetchRealVendors = async () => {
      try {
        const res = await API.get("/api/vendors/search");
        const backendVendors = res.data.vendors || [];

        // Real vendor data ko card ke expected shape mein map karo
        const mapped = backendVendors.map((v) => ({
          UserId: v._id,          // real ID (dummy cards bhi isi key ko use karte hain)
          _id: v._id,
          name: v.businessName || "Unnamed Vendor",
          image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80", 
          type: v.category || "Decorators",
          rating: v.rating || 0,
          reviews: v.totalReviews || 0,
          location: v.location?.city || "Location not set",
          description: v.description || "No description provided.",
          eventTypes: ["Wedding"],   // backend mein abhi ye field nahi, placeholder
          price: v.price || 0,
          country: "Pakistan",      // backend mein country field nahi, filter ke liye default
          city: v.location?.city || "",
          topPick: false,
          isReal: true,             // taake pehchan sakein ye real vendor hai
        }));

        setRealVendors(mapped);
      } catch (err) {
        console.error("Real vendors fetch error:", err);
      }
    };

    fetchRealVendors();
  }, []);

  useEffect(() => {
    const targetVendors = dummyVenues.length + realVendors.length;
    const targetRating = dummyVenues.reduce((sum, v) => sum + (v.rating || 0), 0) / dummyVenues.length;
    const targetEvents = 1000;
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedVendors(Math.round(targetVendors * progress));
      setAnimatedRating((targetRating * progress).toFixed(1));
      setAnimatedEvents(Math.round(targetEvents * progress));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [realVendors]);

  const [selectedType, setSelectedType] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minCapacity, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const toggleEventType = (type) => {
    setSelectedEvents((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };
const toggleFavorite = (id) => {
  setFavorites((prev) =>
    prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
  );
};
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity(""); // Reset city dropdown when country changes
  };

  // Real + Dummy vendors ek sath
  const allVenues = [...realVendors, ...dummyVenues];

  const filteredVenues = allVenues
    .filter((v) => {
      if (selectedType !== "All" && v.type !== selectedType) return false;
      if (selectedCountry && v.country !== selectedCountry) return false;
      if (selectedCity && v.city !== selectedCity) return false;
      if (selectedEvents.length > 0 && !selectedEvents.some((e) => v.eventTypes.includes(e)))
        return false;
      if (v.price < minPrice || v.price > maxPrice) return false;
      if (minCapacity > 0 && (v.capacity || 0) < minCapacity) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const navigate = useNavigate();

  return (
    <div className="vlp-page">
      {/* Page Header */}
      <div className="vlp-header">
        <div className="vlp-header-inner">
          <div className="vlp-header-content">
            <h1>Find Your Perfect Venue</h1>
            <p>{filteredVenues.length} venues available</p>
          </div>
          <div className="vlp-header-stats">
            <div className="vlp-stat">
              <span className="vlp-stat-value">{animatedVendors}+</span>
              <span className="vlp-stat-label">vendors</span>
            </div>
            <div className="vlp-stat">
              <span className="vlp-stat-value">★ {animatedRating}</span>
              <span className="vlp-stat-label">avg rating</span>
            </div>
            <div className="vlp-stat">
              <span className="vlp-stat-value">{animatedEvents}+</span>
              <span className="vlp-stat-label">events booked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="vlp-body">
        {/* Sidebar Filters */}
        <aside className={`vlp-sidebar ${filtersOpen ? "open" : "close"}`}>

          <div className="vlp-filter-header">
            <h3>Filters</h3>
            <button className="vlp-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
              {filtersOpen ? "▲" : "▼"}
            </button>
          </div>

          {/* Venue Type */}
          <div className="vlp-filter-section">
            <h4>Select Services</h4>
            <div className="vlp-pill-group">
              {VendorsType.map((type) => (
                <button
                  key={type}
                  className={`vlp-pill ${selectedEvents.includes(type) ? "active" : ""}`}
                  onClick={() => toggleEventType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="vlp-filter-section">
  <h4>Venue Type</h4>
  <div className="vlp-pill-group">
    {venueTypes.map((type) => (
      <button
        key={type}
        className={`vlp-pill ${selectedType === type ? "active" : ""}`}
        onClick={() => setSelectedType(type)}
      >
        {type}
      </button>
    ))}
  </div>
</div>
          {/* Location Filter Section (Country & City Dropdowns) */}
        <div className="vlp-filter-section">
  <h4>Select Country</h4>
  <select
    className="vlp-select"
    value={selectedCountry}
    onChange={handleCountryChange}
  >
    <option value="">All Countries</option>
    {Object.keys(locationData).map((country) => (
      <option key={country} value={country}>{country}</option>
    ))}
  </select>

  <h4>Select City</h4>
  <select
    className="vlp-select"
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.target.value)}
    disabled={!selectedCountry}
  >
    <option value="">All Cities</option>
    {selectedCountry && locationData[selectedCountry].map((city) => (
      <option key={city} value={city}>{city}</option>
    ))}
  </select>
</div>

          {/* Price Range */}
          <div className="vlp-filter-section">
  <h4>Price per Head (PKR)</h4>
  <input
    type="range"
    min="0"
    max="20000"
    step="500"
    value={maxPrice}
    onChange={(e) => setMaxPrice(Number(e.target.value))}
    className="vlp-slider"
  />
  <div className="vlp-price-readout">
    PKR {minPrice.toLocaleString()} – {maxPrice.toLocaleString()}
  </div>
</div>

          {/* Capacity */}
          <div className="vlp-filter-section">
            <h4>Min Capacity (guests)</h4>
            <input
              className="vlp-capacity-input"
              type="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
              placeholder="e.g. 200"
            />
          </div>

          {/* Reset */}
          <button
            className="vlp-reset-btn"
            onClick={() => {
              setSelectedType("All");
              setSelectedCountry("");
              setSelectedCity("");
              setSelectedEvents([]);
              setMinPrice(0);
              setMaxPrice(10000);
              setMinCapacity(0);
            }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Results Section */}
        <main className="vlp-results">
          {/* Sort Bar */}
          <div className="vlp-sort-bar">
            <span>{filteredVenues.length} results found</span>
            <div className="vlp-sort-select">
              <label>Sort by: </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Venue Cards */}
          <div className="vlp-cards">
            {filteredVenues.length === 0 ? (
              <div className="vlp-no-results">
  <div className="vlp-no-results-icon">🔍</div>
  <h3>No venues found</h3>
  <p>We couldn't find any venues matching your filters. Try adjusting or resetting them.</p>
  <button
    className="vlp-reset-btn"
    style={{ maxWidth: "200px", margin: "16px auto 0" }}
    onClick={() => {
      setSelectedType("All");
      setSelectedCountry("");
      setSelectedCity("");
      setSelectedEvents([]);
      setMinPrice(0);
      setMaxPrice(10000);
      setMinCapacity(0);
    }}
  >
    Reset Filters
  </button>
</div>
            ) : (
              filteredVenues.map((venue) => (
              <div key={venue._id || venue.UserId} className="vlp-card">
  <div className="vlp-card-image">
    <img src={venue.image} alt={venue.name} />
    {venue.topPick && (
      <span className="vlp-top-pick">⭐ Top Pick</span>
    )}
    <button
      className={`vlp-fav-btn ${favorites.includes(venue._id || venue.UserId) ? "active" : ""}`}
      onClick={() => toggleFavorite(venue._id || venue.UserId)}
      aria-label="Save to favorites"
    >
      <Heart size={14} fill={favorites.includes(venue._id || venue.UserId) ? "currentColor" : "none"} />
    </button>
    <span className="vlp-venue-type-badge">{venue.type}</span>
  </div>
                  <div className="vlp-card-info">
                    <div className="vlp-card-top">
                      <h3>{venue.name}</h3>
                      <div className="vlp-rating">
                        <span className="vlp-star">★</span>
                        <span>{venue.rating}</span>
                        <span className="vlp-reviews">({venue.reviews} reviews)</span>
                      </div>
                    </div>
                    <p className="vlp-location">
                      <span className="material-symbols-outlined">location_on</span>
                      {venue.location}
                    </p>
                    <p className="vlp-description">{venue.description}</p>
                    <div className="vlp-card-tags">
                      {venue.eventTypes.map((t) => (
                        <span key={t} className="vlp-tag">{t}</span>
                      ))}
                    </div>
                    <div className="vlp-card-footer">
                      <div className="vlp-price">
                        <span className="vlp-price-label">Starting from</span>
                        <span className="vlp-price-value">PKR {venue.price.toLocaleString()}/head</span>
                      </div>
                      <button
                        className="vlp-details-btn"
                        onClick={() => navigate(`/vendors/${venue._id || venue.UserId}`)}
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