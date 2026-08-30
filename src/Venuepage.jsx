import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Venuepage.css";
import { Heart } from "lucide-react";
import API from "./api/axiosConfig";

const VendorsType = ["All", "Photographers", "Caterers", "Decorators", "Venues & Marquees"];
const venueTypes = ["All", "Marquee", "Hotel", "Farmhouse", "Hall", "Convention Centre"];

const locationData = {
  Pakistan: {
    Punjab: ["Lahore", "Rawalpindi", "Mandi Bahauddin", "Gujrat", "Faisalabad", "Multan", "Sialkot"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
    "Khyber Pakhtunkhwa": ["Peshawar", "Abbottabad", "Mardan"],
    Balochistan: ["Quetta", "Gwadar"],
    "Islamabad Capital": ["Islamabad"],
    "Azad Kashmir": ["Muzaffarabad", "Mirpur"]
  },
  UAE: {
    Dubai: ["Dubai Marina", "Downtown Dubai", "Deira", "Jumeirah"],
    "Abu Dhabi": ["Abu Dhabi City", "Al Ain"],
    Sharjah: ["Sharjah City", "Al Majaz"]
  },
  India: {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Delhi: ["New Delhi", "North Delhi"],
    Punjab: ["Amritsar", "Ludhiana", "Chandigarh"]
  },
  UK: {
    England: ["London", "Manchester", "Birmingham"],
    Scotland: ["Edinburgh", "Glasgow"]
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    "New York": ["New York City", "Buffalo"],
    Texas: ["Houston", "Dallas", "Austin"]
  }
};

export default function Venuepage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [animatedVendors, setAnimatedVendors] = useState(0);
  const [animatedRating, setAnimatedRating] = useState(0);
  const [animatedEvents, setAnimatedEvents] = useState(0);
  const [realVendors, setRealVendors] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "Pakistan");
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get("province") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const selectedService = searchParams.get("category") || "All";

  const setSelectedService = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val === "All") params.delete("category");
    else params.set("category", val);
    setSearchParams(params);
  };

  const [, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const cntry = searchParams.get("country");
    const prov = searchParams.get("province");
    const cty = searchParams.get("city");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cntry) setSelectedCountry(cntry);
    if (prov) setSelectedProvince(prov);
    if (cty) setSelectedCity(cty);
  }, [searchParams]);

  // Pure Backend API Dynamic Fetch
  useEffect(() => {
    const fetchRealVendors = async () => {
      try {
        const countryParam = searchParams.get("country") || selectedCountry || "";
        const provParam = searchParams.get("province") || selectedProvince || "";
        const cityParam = searchParams.get("city") || selectedCity || "";

        const queryParams = new URLSearchParams();
        if (countryParam) queryParams.append("country", countryParam);
        if (provParam) queryParams.append("state", provParam);
        if (cityParam) queryParams.append("city", cityParam);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/vendors/search?${queryString}` : "/vendors/search";

        const res = await API.get(endpoint);
        const backendVendors = res.data.vendors || res.data.data || [];

        const mapped = backendVendors.map((v) => ({
          _id: v._id,
          name: v.businessName || v.name || "Vendor",
          image: v.coverImage || v.images?.[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80",
          type: v.category || v.businessType || "Decorators",
          rating: v.rating || 4.8,
          reviews: v.totalReviews || 10,
          location: v.location?.city || v.city || "Mandi Bahauddin",
          description: v.description || "No description provided.",
          price: v.price || 50000,
          country: v.location?.country || v.country || "Pakistan",
          province: v.location?.state || v.location?.province || v.province || "Punjab",
          city: v.location?.city || v.city || "Mandi Bahauddin",
        }));

        setRealVendors(mapped);
      } catch (err) {
        console.error("Real vendors fetch error:", err);
      }
    };

    fetchRealVendors();
  }, [searchParams, selectedCountry, selectedProvince, selectedCity]);

  useEffect(() => {
    const targetVendors = realVendors.length;
    const targetRating = 4.8;
    const targetEvents = 100;
    const duration = 600;
    const steps = 15;
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

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedProvince("");
    setSelectedCity("");
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity("");
  };

  const filteredVenues = realVendors
    .filter((v) => {
      if (
        searchQuery.trim() &&
        !v.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
        return false;

      if (selectedService === "Venues & Marquees") {
        const isVenueType = venueTypes
          .slice(1)
          .some((t) => t.toLowerCase() === v.type?.toLowerCase());
        if (!isVenueType) return false;
      } else if (
        selectedService !== "All" &&
        v.type?.toLowerCase() !== selectedService.toLowerCase()
      ) {
        return false;
      }

      if (selectedCountry) {
        const vendorCountry = (v.country || "Pakistan").toLowerCase();
        if (vendorCountry !== selectedCountry.toLowerCase()) return false;
      }

      if (selectedCity) {
        const vendorCity = (v.city || v.location || "").toLowerCase();
        const targetCity = selectedCity.toLowerCase();
        if (!vendorCity.includes(targetCity)) return false;
      } else if (selectedProvince) {
        const vendorProvince = (v.province || v.location || "").toLowerCase();
        const targetProvince = selectedProvince.toLowerCase();
        if (!vendorProvince.includes(targetProvince)) return false;
      }

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
    setSelectedCountry("");
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
            <p>{filteredVenues.length} dynamic vendors available</p>
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

            <h4 style={{ marginTop: '12px' }}>Select State/Province</h4>
            <select
              className="vlp-select"
              value={selectedProvince}
              onChange={handleProvinceChange}
              disabled={!selectedCountry}
            >
              <option value="">{selectedCountry ? "All States/Provinces" : "Select Country First"}</option>
              {selectedCountry && locationData[selectedCountry] && Object.keys(locationData[selectedCountry]).map((province) => (
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
              <option value="">{selectedProvince ? "All Cities" : "Select State/Province First"}</option>
              {selectedCountry && selectedProvince && locationData[selectedCountry]?.[selectedProvince]?.map((city) => (
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
                <h3>No dynamic vendors found</h3>
                <p>Register new vendors via signup form to populate real database entries.</p>
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
                <div key={venue._id} className="vlp-card">
                  <div className="vlp-card-image">
                    <img src={venue.image} alt={venue.name} />
                    <button
                      className={`vlp-fav-btn ${favorites.includes(venue._id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(venue._id)}
                    >
                      <Heart size={14} fill={favorites.includes(venue._id) ? "currentColor" : "none"} />
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
                        onClick={() => navigate(`/vendors/${venue._id}`)}
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