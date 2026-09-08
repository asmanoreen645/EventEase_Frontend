import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "./Components/BookingContext";
import "./BookingDetails.css";
import "./PackageSelection.css";

// ─── PACKAGE DATA -  vendor category  data ───────────────────────
const PACKAGE_DATA = {
  photographer: {
    label: "Photographer",
    perHead: false,
    packages: [
      {
        name: "Basic",
        desc: "4 hours coverage",
        price: 35000,
        includes: ["4 hours coverage", "150+ edited photos", "Online gallery delivery"],
      },
      {
        name: "Standard",
        desc: "8 hours coverage + album",
        price: 65000,
        includes: [
          "8 hours coverage",
          "300+ edited photos",
          "Highlight video (3-5 min)",
          "Premium photo album",
          "1 photographer",
          "Online gallery delivery",
        ],
      },
      {
        name: "Premium",
        desc: "Full day + drone + 2 photographers",
        price: 110000,
        includes: [
          "Full day coverage",
          "500+ edited photos",
          "Drone footage included",
          "Premium photo album",
          "2 photographers",
          "Cinematic highlight video",
        ],
      },
    ],
    extras: [
      { name: "Extra hour of coverage", price: 5000 },
      { name: "Drone footage", price: 12000 },
      { name: "Extra photographer", price: 20000 },
      { name: "Same-day edit / highlight reel", price: 8000 },
    ],
  },

  decorator: {
    label: "Decorator",
    perHead: false,
    packages: [
      {
        name: "Basic",
        desc: "Stage decor only",
        price: 40000,
        includes: ["Stage backdrop & seating", "Basic floral arrangements", "Ambient lighting"],
      },
      {
        name: "Standard",
        desc: "Stage + walkway + entrance",
        price: 85000,
        includes: [
          "Stage backdrop & seating",
          "Fresh floral arrangements",
          "Walkway decor",
          "Entrance decor",
          "Ambient lighting setup",
          "Table centerpieces",
        ],
      },
      {
        name: "Premium",
        desc: "Full venue theme transformation",
        price: 180000,
        includes: [
          "Everything in Standard",
          "Full venue theme styling",
          "Ceiling decor",
          "Premium floral arrangements",
          "Custom backdrop design",
        ],
      },
    ],
    extras: [
      { name: "LED wall / screen", price: 25000 },
      { name: "Extra floral arrangements", price: 15000 },
      { name: "Fairy lights / ceiling decor", price: 10000 },
      { name: "Photo booth setup", price: 12000 },
    ],
  },

  venue: {
    label: "Venue & Catering",
    perHead: true,
    packages: [
      {
        name: "Basic",
        desc: "1 main dish + dessert",
        price: 900,
        includes: ["1 main course", "Rice", "Salad", "Soft drinks"],
      },
      {
        name: "Standard",
        desc: "2 mains, rice, salad & metha",
        price: 1200,
        includes: [
          "Chicken karahi",
          "Beef qorma",
          "Pulao rice",
          "Salad & raita",
          "Gulab jamun (metha)",
          "Soft drinks",
        ],
      },
      {
        name: "Deluxe",
        desc: "3 mains, BBQ, rice, salads & 2 desserts",
        price: 1800,
        includes: [
          "3 main courses",
          "Live BBQ counter",
          "Pulao & plain rice",
          "Salads & raita",
          "2 desserts",
          "Soft drinks & welcome drink",
        ],
      },
    ],
    extras: [
      { name: "BBQ live counter", price: 300 },
      { name: "Extra dessert (kheer)", price: 150 },
      { name: "Welcome drinks counter", price: 100 },
    ],
  },
};

// Vendor.category map with above keys
function getCategoryKey(category) {
  if (category === "photographer") return "photographer";
  if (category === "decorator") return "decorator";
  // venue, catering, venuehall - use same sub per head
  return "venue";
}

function PackageSelection() {
  const navigate = useNavigate();
  const { vendor, bookingDetails, setSelectedPackage, setTotalPrice } = useBooking();

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [checkedExtras, setCheckedExtras] = useState([]);

  // follow all steps
  if (!vendor || !bookingDetails) {
    return (
      <div className="booking-page">
        <div className="booking-card">
          <p>Pehle booking details complete karo.</p>
          <button className="btn-next" onClick={() => navigate("/details")}>
            Back to Booking Details
          </button>
        </div>
      </div>
    );
  }

  const categoryKey = getCategoryKey(vendor.category);
  const data = PACKAGE_DATA[categoryKey];
  const guestCount = Number(bookingDetails.guestCount) || 1;
  const selectedPkg = data.packages[selectedIndex];

  const toggleExtra = (extraName) => {
    setCheckedExtras((prev) =>
      prev.includes(extraName)
        ? prev.filter((n) => n !== extraName)
        : [...prev, extraName]
    );
  };

  const extrasTotal = data.extras
    .filter((ex) => checkedExtras.includes(ex.name))
    .reduce((sum, ex) => sum + ex.price, 0);

  // Per-head categories  total = (package + extras) x guests
  // Fixed categorie total = package + extras
  const total = data.perHead
    ? (selectedPkg.price + extrasTotal) * guestCount
    : selectedPkg.price + extrasTotal;

  const handleNext = () => {
    setSelectedPackage({
      packageName: selectedPkg.name,
      basePrice: selectedPkg.price,
      extras: data.extras.filter((ex) => checkedExtras.includes(ex.name)),
      perHead: data.perHead,
      guestCount: guestCount,
    });
    setTotalPrice(total);
    navigate("/payment");
  };

  return (
    <div className="booking-page">
      <div className="booking-card">

        {/* Step indicator */}
        <div className="booking-steps">
          <div className="step">
            <span className="step__circle">1</span>
            <span className="step__label">Booking details</span>
          </div>
          <div className="step__line"></div>
          <div className="step step--active">
            <span className="step__circle">2</span>
            <span className="step__label">Package</span>
          </div>
          <div className="step__line"></div>
          <div className="step">
            <span className="step__circle">3</span>
            <span className="step__label">Payment</span>
          </div>
        </div>

        <h2 className="booking-title">Choose your package</h2>
        <p className="booking-subtitle">
          {vendor.name} · {data.label}
          {data.perHead ? ` · ${guestCount} guests` : ""}
        </p>

        {/* Package cards */}
        <div className="package-grid">
          {data.packages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`package-card ${index === selectedIndex ? "package-card--selected" : ""}`}
              onClick={() => setSelectedIndex(index)}
            >
              {index === 1 && <span className="package-card__badge">Most popular</span>}
              <p className="package-card__name">{pkg.name}</p>
              <p className="package-card__desc">{pkg.desc}</p>
              <p className="package-card__price">
                PKR {pkg.price.toLocaleString()}
                {data.perHead && <span className="package-card__unit"> /head</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Includes list */}
        <div className="info-box">
          <p className="info-box__title">{selectedPkg.name} package includes</p>
          <div className="includes-grid">
            {selectedPkg.includes.map((item) => (
              <div key={item} className="includes-item">
                <span className="includes-check">✓</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div className="info-box">
          <p className="info-box__title">
            Add extras{" "}
            {data.perHead && (
              <span className="info-box__hint">(extra charges per head)</span>
            )}
          </p>
          <div className="extras-list">
            {data.extras.map((ex) => (
              <label key={ex.name} className="extras-item">
                <span>
                  <input
                    type="checkbox"
                    checked={checkedExtras.includes(ex.name)}
                    onChange={() => toggleExtra(ex.name)}
                  />{" "}
                  {ex.name}
                </span>
                <span className="extras-price">
                  + PKR {ex.price.toLocaleString()}
                  {data.perHead ? "/head" : ""}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="total-box">
          <div>
            <p className="total-box__label">
              {data.perHead
                ? `PKR ${selectedPkg.price.toLocaleString()} × ${guestCount} guests`
                : `${selectedPkg.name} package`}
            </p>
            <p className="total-box__sub">+ selected extras</p>
          </div>
          <p className="total-box__amount">PKR {total.toLocaleString()}</p>
        </div>

        <div className="booking-actions">
          <button type="button" className="btn-back" onClick={() => navigate(-1)}>
            Back
          </button>
          <button type="button" className="btn-next" onClick={handleNext}>
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default PackageSelection;