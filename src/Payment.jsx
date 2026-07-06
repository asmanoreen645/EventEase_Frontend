import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "./Components/BookingContext";
import "./BookingDetails.css";
import "./Payment.css";
import API from './api/axiosConfig';

const PLATFORM_FEE = 600;
const ADVANCE_PERCENT = 0.3;

function Payment() {
  const navigate = useNavigate();
  const {
  vendor,
  bookingDetails,
  selectedPackage,
  totalPrice,
} = useBooking();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!vendor || !bookingDetails || !selectedPackage) {
    return (
      <div className="booking-page">
        <div className="booking-card">
          <p>Firstly select booking and package.</p>
          <button className="btn-next" onClick={() => navigate("/details")}>
            Back to Booking Details
          </button>
        </div>
      </div>
    );
  }

  const advanceAmount = Math.round(totalPrice * ADVANCE_PERCENT);
  const totalDueToday = advanceAmount + PLATFORM_FEE;

  const handlePay = async (e) => {
    e.preventDefault();
    console.log("VENDOR OBJECT:", vendor);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Pehle login karo!");
      navigate("/login");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDetails.eventDate);
    if (selectedDate < today) {
      alert("Booking is not possible on a past date");
      return;
    }

    if (!cardName || !cardNumber || !expiry || !cvc || !billingAddress) {
      alert(" Fill Card details and billing address.");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        userId: userId,
        vendorId: vendor._id,
        eventDate: bookingDetails.eventDate,
        totalAmount: totalPrice,
      };

      const response = await API.post('/api/bookings/book', bookingData);
      console.log("Booking Response:", response.data);

      // Booking successful ho chuki hai - ab isse alag block treat karo.
      // Chahe email fail ho jaye, user ko "booking failed" nahi dikhna chahiye.
      if (response.data.success) {
        // Email + in-app notification ko ALAG try-catch me rakha,
        // taake iski failure booking ki success ko override na kare.
        try {
          const userEmail = localStorage.getItem('userEmail');

          await API.post('/api/notifications/send-email', {
            userId: userId,
            to: userEmail || undefined, // agar email na mile to bhi in-app notification save ho jayegi
            subject: "EventEase - Booking Confirmed!",
            text: `Assalam o Alaikum! Aapki booking ${vendor.name} ke sath confirm ho gayi. Event date: ${bookingDetails.eventDate}. Total amount: PKR ${totalPrice}`,
            title: "Booking Confirmed",
            type: "booking"
          });
        } catch (notifyErr) {
          // Sirf console me log karo - user ko is se koi farq nahi parhna chahiye
          console.error("Notification send failed (booking still confirmed):", notifyErr);
        }

        alert("Booking confirmed!");
        navigate("/");
      }

    } catch (err) {
      // Ab yahan sirf ASLI booking errors aayenge, email ki wajah se nahi
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Booking failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">

        <div className="booking-steps">
          <div className="step">
            <span className="step__circle">1</span>
            <span className="step__label">Booking details</span>
          </div>
          <div className="step__line"></div>
          <div className="step">
            <span className="step__circle">2</span>
            <span className="step__label">Package</span>
          </div>
          <div className="step__line"></div>
          <div className="step step--active">
            <span className="step__circle">3</span>
            <span className="step__label">Payment</span>
          </div>
        </div>

        <div className="checkout-header">
          <h2 className="checkout-title">Secure checkout</h2>
          <span className="checkout-badge">{ADVANCE_PERCENT * 100}% advance</span>
        </div>
        <div className="checkout-divider"></div>

        <div className="summary-box">
          <div>
            <p className="summary-box__name">
              {selectedPackage.packageName} Package - {vendor.name}
            </p>
            <p className="summary-box__date">📅 {bookingDetails.eventDate}</p>
          </div>
          <div className="summary-box__right">
            <p className="summary-box__total">Total: PKR {totalPrice.toLocaleString()}</p>
            <p className="summary-box__advance">Pay now: PKR {advanceAmount.toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handlePay}>
          <div className="form-group form-group--full">
            <label>Cardholder name</label>
            <input
              type="text"
              placeholder="e.g. Ayesha Khan"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="form-group form-group--full">
            <label>Card information</label>
            <div className="card-info-box">
              <span className="card-badge">VISA</span>
              <input
                type="text"
                className="card-number-input"
                placeholder="1234 1234 1234 1234"
                maxLength="19"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <input
                type="text"
                className="card-expiry-input"
                placeholder="MM/YY"
                maxLength="5"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <input
                type="text"
                className="card-cvc-input"
                placeholder="CVC"
                maxLength="4"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group form-group--full">
            <label>Billing address</label>
            <input
              type="text"
              placeholder="e.g. Karachi, Pakistan"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
            />
          </div>

          <div className="breakdown-box">
            <div className="breakdown-row">
              <span>Advance ({ADVANCE_PERCENT * 100}%)</span>
              <span>PKR {advanceAmount.toLocaleString()}</span>
            </div>
            <div className="breakdown-row">
              <span>Platform fee</span>
              <span>PKR {PLATFORM_FEE.toLocaleString()}</span>
            </div>
            <div className="breakdown-divider"></div>
            <div className="breakdown-row breakdown-row--total">
              <span>Total due today</span>
              <span>PKR {totalDueToday.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" className="btn-pay" disabled={loading}>
            {loading ? "Processing..." : `Confirm & Pay PKR ${totalDueToday.toLocaleString()}`}
          </button>

          <p className="secure-note">Secured checkout · 256-bit SSL</p>

          <div className="booking-actions">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Payment;