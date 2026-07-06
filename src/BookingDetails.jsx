import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "./Components/BookingContext";
import "./BookingDetails.css";

function BookingDetails() {
  const navigate = useNavigate();
  const { vendor, setBookingDetails } = useBooking();

  const [form, setForm] = useState({
    bookingName: "",
    eventDate: "",
    eventType: "Walima",
    city: "Lahore",
    guestCount: "",
    contact: "",
    notes: "",
  });

  // Agar koi vendor select nahi hua (direct URL se aaya), to wapas bhej do
  if (!vendor) {
    return (
      <div className="booking-page">
        <div className="booking-card">
          <p>firstly select any vendor.</p>
          <button className="btn-next" onClick={() => navigate("/services")}>
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.bookingName || !form.eventDate || !form.contact) {
      alert("Booking Name, Event Date aur Contact Number zaroori hain.");
      return;
    }

    // Phone number validation
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(form.contact)) {
      alert("Please write correct phone number (e.g. 03001234567)");
      return;
    }

    setBookingDetails(form);
    navigate("/Package");
  };

  return (
    <div className="booking-page">
      <div className="booking-card">

        {/* Step indicator */}
        <div className="booking-steps">
          <div className="step step--active">
            <span className="step__circle">1</span>
            <span className="step__label">Booking details</span>
          </div>
          <div className="step__line"></div>
          <div className="step">
            <span className="step__circle">2</span>
            <span className="step__label">Package</span>
          </div>
          <div className="step__line"></div>
          <div className="step">
            <span className="step__circle">3</span>
            <span className="step__label">Payment</span>
          </div>
        </div>

        <h2 className="booking-title">Booking details</h2>
        <p className="booking-subtitle">
          Booking for <strong>{vendor.name}</strong> ({vendor.category})
        </p>

        <form onSubmit={handleNext}>
          <div className="form-grid">

            <div className="form-group form-group--full">
              <label>Booking Name *</label>
              <input
                type="text"
                name="bookingName"
                placeholder="e.g. Ayesha & Bilal Walima"
                value={form.bookingName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Event Type *</label>
              <select name="eventType" value={form.eventType} onChange={handleChange}>
                <option>Walima</option>
                <option>Mehndi</option>
                <option>Baraat</option>
                <option>Engagement</option>
                <option>Birthday Party</option>
                <option>Corporate Event</option>
              </select>
            </div>

            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                name="eventDate"
                min={new Date().toISOString().split("T")[0]}
                value={form.eventDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City </label>
              <select name="city" value={form.city} onChange={handleChange}>
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option>
                <option>Rawalpindi</option>
                <option>Faisalabad</option>
              </select>
            </div>

            <div className="form-group">
              <label>Guest Count</label>
              <input
                type="number"
                min="1"
                name="guestCount"
                value={form.guestCount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group form-group--full">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contact"
                placeholder="03XX-XXXXXXX"
                value={form.contact}
                onChange={handleChange}
              />
            </div>

            <div className="form-group form-group--full">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                rows="3"
                placeholder="Any special requirements..."
                value={form.notes}
                onChange={handleChange}
              ></textarea>
            </div>

          </div>

          <div className="booking-actions">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="submit" className="btn-next">
              Next
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default BookingDetails;