import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "./Components/BookingContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"; // CHANGE: naya import - Stripe hooks aur CardElement
import "./BookingDetails.css";
import "./Payment.css";
import API from './api/axiosConfig';

const PLATFORM_FEE = 600;
const ADVANCE_PERCENT = 0.3;

// naya object - CardElement ki styling 
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      fontFamily: "inherit",
      "::placeholder": { color: "#999" },
    },
    invalid: { color: "#e5424d" },
  },
};

function Payment() {
  const navigate = useNavigate();
  const stripe = useStripe();       
  const elements = useElements();  
  const {
    vendor,
    bookingDetails,
    selectedPackage,
    totalPrice,
  } = useBooking();

  const [cardName, setCardName] = useState("");
  // cardNumber, expiry, cvc states HATA DIYE - Stripe CardElement khud ye manage karta hai
  const [billingAddress, setBillingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState(""); //  - Stripe ka error message dikhane ke liye

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
    setCardError(""); 
    console.log("selectedPackage check:", selectedPackage); 
    console.log("DEBUG vendor object:", vendor);
  console.log("DEBUG vendor keys:", vendor ? Object.keys(vendor) : "vendor is null/undefined");

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

    // ab sirf cardName aur billingAddress check ho rahe hain (card number/cvc Stripe khud validate karega)
    if (!cardName || !billingAddress) {
      alert("Fill cardholder name and billing address.");
      return;
    }

    //  - Stripe.js abhi load ho raha ho to rukna
    if (!stripe || !elements) {
      alert("Payment system loading, thori dair rukein.");
      return;
    }

    try {
      setLoading(true);

      // ===== STEP 1: Booking create kar0 =====
      const bookingData = {
      vendorId: vendor.id,
      packageDetails: selectedPackage,
      eventDate: bookingDetails.eventDate,
        totalAmount: totalPrice,
};
      const bookingResponse = await API.post('/api/bookings/book', bookingData);
      console.log("Booking Response:", bookingResponse.data);

      if (!bookingResponse.data.success) {
        alert("Booking failed! Please try again.");
        setLoading(false);
        return;
      }

      // booking response se bookingId nikal rahe hain (payment API ko chahiye)
      const bookingId = bookingResponse.data.booking?._id || bookingResponse.data._id;

      // ===== STEP 2 Card details ko Stripe token mein convert karo =====
      const cardElement = elements.getElement(CardElement);
      const { token, error } = await stripe.createToken(cardElement, {
        name: cardName,
        address_line1: billingAddress,
      });

      if (error) {
        // agar card declined/invalid ho - booking already ban chuki hai, lekin payment nahi hui
        console.error("Stripe token error:", error);
        setCardError(error.message);
        alert("Card error: " + error.message);
        setLoading(false);
        return;
      }

      // ===== STEP 3 Backend ko token bhejo, actual charge ho =====
      try {
        const chargeResponse = await API.post('/api/payments/charge', {
          bookingId: bookingId,
          token: token.id,
        });

        console.log("Charge Response:", chargeResponse.data);

        if (!chargeResponse.data.success) {
          alert("Payment failed: " + (chargeResponse.data.message || "Please try again."));
          setLoading(false);
          return;
        }
      } catch (chargeErr) {
        console.error("Charge error:", chargeErr);
        alert(chargeErr.response?.data?.message || "Payment failed! Please try again.");
        setLoading(false);
        return;
      }

      // ===== STEP 4: Notification bhejo (pehle jaisa try-catch, bas ab payment ke baad chalta hai) =====
      try {
        const userEmail = localStorage.getItem('userEmail');
        await API.post('/api/notifications/send-email', {
          userId: userId,
          to: userEmail || undefined,
          subject: "EventEase - Booking Confirmed!",
          text: `Assalam o Alaikum! Aapki booking ${vendor.name} ke sath confirm ho gayi aur payment successful hui. Event date: ${bookingDetails.eventDate}. Total amount: PKR ${totalPrice}`,
          title: "Booking Confirmed",
          type: "booking"
        });
      } catch (notifyErr) {
        console.error("Notification send failed (booking still confirmed):", notifyErr);
      }

      alert("Booking confirmed! Payment successful.");
      navigate("/");

    } catch (err) {
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
              {/* CHANGE: purane 3 inputs (number, expiry, cvc) hata kar ye single CardElement lagaya - PCI-safe */}
              <div style={{ flex: 1, padding: "10px" }}>
                <CardElement options={cardElementOptions} />
              </div>
            </div>
            {/*- Stripe error message yahan dikhega agar card invalid ho */}
            {cardError && (
              <p style={{ color: "#e5424d", fontSize: "13px", marginTop: "4px" }}>{cardError}</p>
            )}
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

          {/* disabled condition mein !stripe add kiya - Stripe load hone tak button disabled rahega */}
          <button type="submit" className="btn-pay" disabled={loading || !stripe}>
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