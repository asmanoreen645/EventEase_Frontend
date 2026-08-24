import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="ee-legal-page">
      <div className="ee-legal-container">
        <h1>Privacy Policy</h1>
        <p className="ee-legal-updated">Last updated: {new Date().getFullYear()}</p>

        <p>
          EventEase ("we", "our", "us") is an event management and vendor
          booking platform connecting customers with photographers, caterers,
          decorators, and venue/marquee vendors across Pakistan. This policy
          explains what information we collect, how we use it, and how it is
          protected when you use our platform as a customer, vendor, or
          admin.
        </p>

        <h2>1. Information We Collect</h2>
        <p>When you register or use EventEase, we may collect:</p>
        <ul>
          <li>Account details — name, email, phone number, and password (stored securely, never in plain text)</li>
          <li>Role information — whether you are registered as a Customer, Vendor, or Admin</li>
          <li>Vendor business details — business name, category (Photographer, Caterer, Decorator, Venue), service description, pricing, and location, submitted during vendor registration</li>
          <li>Vendor verification documents, submitted during onboarding and reviewed by an admin before approval</li>
          <li>Portfolio images and videos, uploaded by vendors and stored via Cloudinary</li>
          <li>Booking details — event date, package selected, and booking status</li>
          <li>Payment information — a 30% advance payment is processed securely through Stripe; EventEase does not store your card details on its own servers</li>
          <li>Chat messages exchanged between customers and vendors through our real-time chat feature</li>
          <li>Ratings and reviews you submit after a completed booking</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To create and manage your account, and to verify vendor registrations before they go live on the platform</li>
          <li>To process bookings, advance payments, and booking status updates (Pending, Confirmed, Completed, Cancelled)</li>
          <li>To send OTPs, booking confirmations, and status notifications by email through NodeMailer</li>
          <li>To enable real-time chat between customers and vendors through Socket.io</li>
          <li>To display vendor portfolios, ratings, and reviews to help customers make informed decisions</li>
          <li>To detect and prevent double-booking on the same date for a vendor</li>
          <li>To allow admins to moderate vendor listings and user accounts (warn or block accounts that violate platform rules)</li>
        </ul>

        <h2>3. How Your Information Is Shared</h2>
        <p>We do not sell your personal information. Limited sharing happens only as needed to run the platform:</p>
        <ul>
          <li>Stripe processes your advance payment; EventEase only receives confirmation of payment status, not your full card details</li>
          <li>Cloudinary stores uploaded portfolio images and videos</li>
          <li>MongoDB Atlas securely stores your account and booking data in the cloud</li>
          <li>A customer and vendor can see each other's relevant booking and contact details only after a booking is initiated, to coordinate the event</li>
        </ul>

        <h2>4. Data Storage and Security</h2>
        <p>
          Your data is stored on MongoDB Atlas, a managed cloud database
          service. Access to admin functions is restricted through
          role-based access control, so only authorized admins can view or
          moderate platform-wide data. Passwords are never stored in
          readable form.
        </p>

        <h2>5. Your Choices</h2>
        <ul>
          <li>You can update your profile information at any time from your account settings</li>
          <li>Vendors can update or remove their service listings and portfolio media</li>
          <li>You may contact us to request access to, correction of, or deletion of your account data</li>
        </ul>

        <h2>6. Cancellations and Refunds</h2>
        <p>
          If a booking is cancelled more than 48 hours before the event
          date, the advance payment is automatically refunded through
          Stripe. Cancellations made within 48 hours of the event are not
          eligible for a refund. See our Terms of Service for full details.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or how your data
          is handled, please reach out through the Contact page or email us
          at the address listed in the footer.
        </p>

        <p className="ee-legal-note">
          Note: EventEase is a final-year academic project (BSIT, Government
          Graduate College Mandi Bahauddin). This policy describes how the
          platform is designed to work and is provided for demonstration
          purposes.
        </p>
      </div>
    </div>
  );
}
