import { useState } from 'react';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock Submission Timeout
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact EventEase</h1>
        <p>Have questions, feedback, or need assistance? We are here to help!</p>
      </div>

      <div className="contact-content">
        {/* Left Side: Contact Information */}
        <div className="contact-info-card">
          <h2>Get in Touch</h2>
          <p className="info-desc">Feel free to reach out to us using any of the details below.</p>

          <div className="info-item">
            <span className="icon">📍</span>
            <div>
              <h4>Location</h4>
              <p>Mandi Bahauddin, Punjab, Pakistan</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">📧</span>
            <div>
              <h4>Email Support</h4>
              <p>support@eventease.com</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">📞</span>
            <div>
              <h4>Phone / WhatsApp</h4>
              <p>+92 300 1234567</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">🕒</span>
            <div>
              <h4>Working Hours</h4>
              <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-form-card">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="e.g. Booking Inquiry, Vendor Support"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;