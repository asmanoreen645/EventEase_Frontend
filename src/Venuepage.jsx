import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Venuepage.css";
import { Heart } from "lucide-react";
import { dummyVenues } from "./Components/VendorsData";
import API from "./api/axiosConfig";

const VendorsType = ["All", "Photographers", "Caterers", "Decorators", "Venues & Marquees"];
const venueTypes = ["All", "Marquee", "Hotel", "Farmhouse", "Hall", "Convention Centre"];

// Pakistani Regional Cascading Data Pipeline
const locationData = {
  Punjab: ["Mandi Bahauddin", "Lahore", "islamabad","Rawalpindi", "Gujrat", "Faisalabad", "Multan", "Sialkot"],
  Sindh: ["Karachi", "Hyderabad", "Sukkur"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Abbottabad"],
  Balochistan: ["Quetta"],
  "Islamabad Capital": ["Islamabad"]
};

export default function Venuepage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [animatedVendors, setAnimatedVendors] = useState(0);
  const [animatedRating, setAnimatedRating] = useState(0);
  const [animatedEvents, setAnimatedEvents] = useState(0);
  const [realVendors, setRealVendors] = useState([]);

  // Task 12: URL Query Parameters Sync
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get("province") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [selectedService, setSelectedService] = useState(searchParams.get("category") || "All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minCapacity, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // URL Query Parameters ko real-time read karna (Home Page integration)
  useEffect(() => {
    const prov = searchParams.get("province");
    const cty = searchParams.get("city");
    const cat = searchParams.get("category");

    if (prov) setSelectedProvince(prov);
    if (cty) setSelectedCity(cty);
    if (cat) setSelectedService(cat);
  }, [searchParams]);

  // Fetch real vendors from backend
  useEffect(() => {
    const fetchRealVendors = async () => {
      try {
        const res = await API.get("/api/vendors/search");
        const backendVendors = res.data.vendors || [];

        const mapped = backendVendors.map((v) => ({
          UserId: v._id,
          _id: v._id,
          name: v.businessName || "Unnamed Vendor",
          image: v.coverImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80",
          type: v.category || "Decorators",
          rating: v.rating || 4.5,
          reviews: v.totalReviews || 12,
          location: v.location?.city || "Mandi Bahauddin",
          description: v.description || "No description provided.",
          eventTypes: ["Wedding"],
          price: v.price || 50000,
          province: v.location?.province || "Punjab",
          city: v.location?.city || "Mandi Bahauddin",
          topPick: false,
          isReal: true,
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
    const targetRating = 4.8;
    const targetEvents = 1000;
    const duration = 800;
    const steps = 20;
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

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity("");
  };

  const allVenues = [...realVendors, ...dummyVenues];

  // Filtering & Sorting Engine
const filteredVenues = allVenues
  .filter((v) => {
    // Search query filter
    if (
      searchQuery.trim() &&
      !v.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
      return false;

    // Service category filter
    if (
      selectedService !== "All" &&
      v.type?.toLowerCase() !== selectedService.toLowerCase()
    )
      return false;

    // Flexible Location Match (City & Province)
    if (selectedCity) {
      const vendorCity = (v.city || v.location || "").toLowerCase();
      const targetCity = selectedCity.toLowerCase();
      if (!vendorCity.includes(targetCity)) return false;
    } else if (selectedProvince) {
      const vendorProvince = (v.province || v.location || "").toLowerCase();
      const targetProvince = selectedProvince.toLowerCase();
      if (!vendorProvince.includes(targetProvince)) return false;
    }

    // Price filter
    if (v.price < minPrice || v.price > maxPrice) return false;

    return true;
  })
  .sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleResetFilters = () => {
    setSelectedType("All");
    setSelectedService("All");
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedCity("");
    setMinPrice(0);
    setMaxPrice(150000);
    setMinCapacity(0);
    setSearchParams({});
  };

  return (
    <div className="vlp-page">
      <div className="vlp-header">
        <div className="vlp-header-inner">
          <div className="vlp-header-content">
            <h1>Find Your Perfect Vendor & Venue</h1>
            <p>{filteredVenues.length} available vendors in Pakistan</p>
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
        <aside className={`vlp-sidebar ${filtersOpen ? "open" : "close"}`}>
          <div className="vlp-filter-header">
            <h3>Filters</h3>
            <button className="vlp-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
              {filtersOpen ? "▲" : "▼"}
            </button>
          </div>

          <div className="vlp-filter-section">
            <input
              type="text"
              className="vlp-search-input"
              placeholder="Search by vendor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="vlp-filter-section">
            <h4>Services Category</h4>
            <div className="vlp-pill-group">
              {VendorsType.map((type) => (
                <button
                  key={type}
                  className={`vlp-pill ${selectedService === type ? "active" : ""}`}
                  onClick={() => setSelectedService(selectedService === type ? "All" : type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="vlp-filter-section">
            <h4>Select Province</h4>
            <select
              className="vlp-select"
              value={selectedProvince}
              onChange={handleProvinceChange}
            >
              <option value="">All Provinces</option>
              {Object.keys(locationData).map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            <h4 style={{ marginTop: '12px' }}>Select City</h4>
            <select
              className="vlp-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedProvince}
            >
              <option value="">{selectedProvince ? "All Cities" : "Select Province First"}</option>
              {selectedProvince && locationData[selectedProvince].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="vlp-filter-section">
            <h4>Max Budget (PKR)</h4>
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="vlp-slider"
            />
            <div className="vlp-price-readout">
              Up to PKR {maxPrice.toLocaleString()}
            </div>
          </div>

          <button className="vlp-reset-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </aside>

        <main className="vlp-results">
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

          <div className="vlp-cards">
            {filteredVenues.length === 0 ? (
              <div className="vlp-no-results">
                <div className="vlp-no-results-icon">🔍</div>
                <h3>No vendors found</h3>
                <p>We couldn't find any matching vendors. Try adjusting your region or budget filters.</p>
                <button
                  className="vlp-reset-btn"
                  style={{ maxWidth: "200px", margin: "16px auto 0" }}
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredVenues.map((venue) => (
                <div key={venue._id || venue.UserId} className="vlp-card">
                  <div className="vlp-card-image">
                    <img src={venue.image} alt={venue.name} />
                    <button
                      className={`vlp-fav-btn ${favorites.includes(venue._id || venue.UserId) ? "active" : ""}`}
                      onClick={() => toggleFavorite(venue._id || venue.UserId)}
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
                        <span className="vlp-reviews">({venue.reviews})</span>
                      </div>
                    </div>
                    <p className="vlp-location">
                      📍 {venue.city}, {venue.province}
                    </p>
                    <p className="vlp-description">{venue.description}</p>
                    <div className="vlp-card-footer">
                      <div className="vlp-price">
                        <span className="vlp-price-label">Starting from</span>
                        <span className="vlp-price-value">PKR {venue.price.toLocaleString()}</span>
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