import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Venuepage.css";
import { dummyVenues } from "./Components/VendorsData";

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
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minCapacity, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const toggleEventType = (type) => {
    setSelectedEvents((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity(""); // Reset city dropdown when country changes
  };

  const filteredVenues = dummyVenues
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
        <span className="vlp-stat-value">{dummyVenues.length}+</span>
        <span className="vlp-stat-label">vendors</span>
      </div>
      <div className="vlp-stat">
        <span className="vlp-stat-value">
          ★ {(dummyVenues.reduce((sum, v) => sum + (v.rating || 0), 0) / dummyVenues.length).toFixed(1)}
        </span>
        <span className="vlp-stat-label">avg rating</span>
      </div>
      <div className="vlp-stat">
        <span className="vlp-stat-value">1k+</span>
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
          {VendorsType.map((type) => (
          <label key={type} className="vlp-checkbox">
          <input
            type="checkbox"
             checked={selectedEvents.includes(type)}
              onChange={() => toggleEventType(type)}
              />
              <span>{type}</span>
              </label>
               ))}
             </div>
          <div className="vlp-filter-section">
            <h4>Venue Type</h4>
            {venueTypes.map((type) => (
              <label key={type} className="vlp-checkbox">
                <input
                  type="radio"
                  name="venueType"
                  checked={selectedType === type}
                  onChange={() => setSelectedType(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>

          {/* Location Filter Section (Country & City Dropdowns) */}
          <div className="vlp-filter-section">
            <h4>Select Country</h4>
            <select 
              value={selectedCountry} 
              onChange={handleCountryChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginTop: "5px",
                marginBottom: "15px",
                fontSize: "14px"
              }}
            >
              <option value="">All Countries</option>
              {Object.keys(locationData).map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            

            <h4>Select City</h4>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedCountry}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginTop: "5px",
                fontSize: "14px",
                backgroundColor: !selectedCountry ? "#f5f5f5" : "#fff",
                cursor: !selectedCountry ? "not-allowed" : "pointer"
              }}
            >
              <option value="">All Cities</option>
              {selectedCountry && locationData[selectedCountry].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Event Type */}
          <div className="vlp-filter-section">
            <h4>Event Type</h4>
            {eventTypes.map((type) => (
              <label key={type} className="vlp-checkbox">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(type)}
                  onChange={() => toggleEventType(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
          

          {/* Price Range */}
          <div className="vlp-filter-section">
            <h4>Price per Head (PKR)</h4>
            <div className="vlp-price-inputs">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="Min"
              />
              <span>—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="Max"
              />
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
                <span className="material-symbols-outlined">search_off</span>
                <p>No venues match your filters. Try adjusting them!</p>
              </div>
            ) : (
              filteredVenues.map((venue) => (
                <div key={venue.UserId} className="vlp-card">
                  <div className="vlp-card-image">
                    <img src={venue.image} alt={venue.name} />
                    {venue.topPick && (
                      <span className="vlp-top-pick">⭐ Top Pick</span>
                    )}
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
                      <button className="vlp-details-btn" onClick={() => navigate(`/vendors/${venue.UserId}`)} > View Profile </button>
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