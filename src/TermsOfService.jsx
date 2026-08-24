import "./PrivacyPolicy.css";

export default function TermsOfService() {
  return (
    <div className="ee-legal-page">
      <div className="ee-legal-container">
        <h1>Terms of Service</h1>
        <p className="ee-legal-updated">Last updated: {new Date().getFullYear()}</p>

        <p>
          These Terms of Service govern your use of EventEase, an event
          management and vendor booking platform. By creating an account as
          a Customer or Vendor, you agree to the terms below.
        </p>

        <h2>1. Accounts and Roles</h2>
        <ul>
          <li>EventEase supports three types of users: Customers, Vendors, and Admins</li>
          <li>Customers can browse vendors and venues, chat with vendors, and make bookings</li>
          <li>Vendors can create a business profile, list their services (Photography, Catering, Decoration, or Venues & Marquees), and manage bookings from their dashboard</li>
          <li>Vendor accounts are reviewed and approved by an admin before the listing becomes publicly visible</li>
          <li>You are responsible for keeping your login credentials confidential</li>
        </ul>

        <h2>2. Vendor Listings</h2>
        <ul>
          <li>Vendors must provide accurate business information, pricing, and portfolio media when registering</li>
          <li>Submitting false, misleading, or fraudulent business details may result in account suspension</li>
          <li>Admins reserve the right to warn or block any account that violates these terms</li>
        </ul>

        <h2>3. Bookings</h2>
        <ul>
          <li>A booking is created by selecting a vendor, an event date, and a service package</li>
          <li>The platform prevents double-booking — a vendor cannot be booked twice for the same date</li>
          <li>A booking moves to Confirmed only after the advance payment is successfully processed</li>
          <li>Booking status is tracked through the following stages: Pending, Confirmed, Completed, and Cancelled</li>
        </ul>

        <h2>4. Payments</h2>
        <ul>
          <li>A 30% advance payment is required at the time of booking, processed securely through Stripe</li>
          <li>The remaining balance is settled directly between the customer and vendor as agreed for the event</li>
          <li>EventEase does not store your card details — all payment processing is handled by Stripe</li>
        </ul>

        <h2>5. Cancellations and Refunds</h2>
        <ul>
          <li>Cancellations made more than 48 hours before the event date are eligible for a full refund of the advance payment</li>
          <li>Cancellations made within 48 hours of the event date are not eligible for a refund</li>
          <li>Refunds, when applicable, are processed automatically through Stripe</li>
        </ul>

        <h2>6. Reviews and Ratings</h2>
        <ul>
          <li>Customers may rate and review a vendor only after a booking's status is marked Completed</li>
          <li>Reviews must reflect a genuine experience with the vendor's service</li>
          <li>Fake, abusive, or misleading reviews may be removed and the responsible account may be warned or blocked</li>
        </ul>

        <h2>7. Communication</h2>
        <p>
          The in-platform chat is provided to help customers and vendors
          coordinate event details. Please keep communication respectful and
          related to your booking.
        </p>

        <h2>8. Account Suspension</h2>
        <p>
          EventEase admins may warn or block any account found to be
          violating these terms, submitting fraudulent information, or
          misusing the platform. Actions taken by an admin are logged for
          accountability.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          EventEase acts as a platform connecting customers and vendors. We
          are not directly responsible for the quality of services delivered
          by a vendor, but we provide moderation, ratings, and a review
          system to help maintain platform quality.
        </p>

        <h2>10. Changes to These Terms</h2>
        <p>
          We may update these Terms of Service as the platform evolves. Continued
          use of EventEase after changes are posted means you accept the
          updated terms.
        </p>

        <p className="ee-legal-note">
          Note: EventEase is a final-year academic project (BSIT, Government
          Graduate College Mandi Bahauddin). These terms describe how the
          platform is designed to operate and are provided for demonstration
          purposes.
        </p>
      </div>
    </div>
  );
}
