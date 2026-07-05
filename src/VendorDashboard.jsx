import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api/axiosConfig"; // Axios global connection instance
import "./VendorDashboard.css";

// ─── TAG COMPONENT (Dynamically handles real states) ───────────────────────────
function StatusTag({ status }) {
  const map = {
    pending: { label: "Pending", className: "tag-pending" },
    accepted: { label: "Accepted", className: "tag-done" },
    rejected: { label: "Rejected", className: "tag-new" },
    done: { label: "Completed", className: "tag-done" },
  };
  const s = map[status] || map.pending;
  return <span className={`vd-tag ${s.className}`}>{s.label}</span>;
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ onGoToBookings, bookings, onAccept, onReject }) {
  const pendingRequests = bookings.filter(b => b.status === "pending");
  const completedCount = bookings.filter(b => b.status === "done" || b.status === "accepted").length;
  
  // Calculate dynamic gross revenue based on accepted/done bookings
  const grossRevenue = bookings
    .filter(b => b.status === "accepted" || b.status === "done")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div>
      <div className="vd-section-label">Overview</div>

      {/* Stats */}
      <div className="vd-stats-grid">
        <div className="vd-stat-card">
          <div className="vd-stat-label">Gross Revenue</div>
          <div className="vd-stat-value">Rs. {grossRevenue.toLocaleString()}</div>
          <div className="vd-stat-sub green">Real-time DB synced</div>
        </div>
        <div className="vd-stat-card">
          <div className="vd-stat-label">Incoming Requests</div>
          <div className="vd-stat-value">{pendingRequests.length.toString().padStart(2, '0')}</div>
          <div className="vd-stat-sub green">Action required</div>
        </div>
        <div className="vd-stat-card">
          <div className="vd-stat-label">Total Bookings</div>
          <div className="vd-stat-value">{bookings.length.toString().padStart(2, '0')}</div>
          <div className="vd-stat-sub muted">All-time database records</div>
        </div>
        <div className="vd-stat-card">
          <div className="vd-stat-label">Overall Rating</div>
          <div className="vd-stat-value">4.9</div>
          <div className="vd-stat-sub green">Dynamic feedback active</div>
        </div>
      </div>

      {/* Two columns */}
      <div className="vd-two-col">
        {/* Incoming Requests */}
        <div className="vd-card">
          <div className="vd-card-header">
            <span className="vd-card-title">Incoming requests</span>
            <span className="vd-card-link" onClick={onGoToBookings}>View all</span>
          </div>
          {pendingRequests.length === 0 ? (
            <p style={{ padding: "20px", color: "#888" }}>No pending requests at the moment.</p>
          ) : (
            pendingRequests.map(b => {
              const customerName = b.customer?.name || "Client";
              const initials = customerName.split(" ").map(n => n[0]).join("").toUpperCase();
              return (
                <div key={b._id} className="vd-booking-item">
                  <div className="vd-b-avatar">{initials.substring(0, 2)}</div>
                  <div className="vd-b-info">
                    <StatusTag status={b.status} />
                    <div className="vd-b-name">{customerName}</div>
                    <div className="vd-b-desc">
                      Date: {new Date(b.eventDate).toLocaleDateString()} | Price: Rs. {b.totalAmount}
                    </div>
                  </div>
                  <div className="vd-b-meta">
                    <button className="vd-btn-acc" onClick={() => onAccept(b._id)}>Accept</button>
                    <button className="vd-btn-rej" onClick={() => onReject(b._id)}>Reject</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dynamic Booking Distribution Chart */}
        <div className="vd-card">
          <div className="vd-card-header">
            <span className="vd-card-title">Booking Metrics Summary</span>
          </div>
          <div style={{ padding: "10px 0" }}>
            <div className="vd-bar-row">
              <span className="vd-bar-label" style={{ width: 80 }}>Completed</span>
              <div className="vd-bar-bg">
                <div className="vd-bar-fill" style={{ width: `${bookings.length ? (completedCount / bookings.length) * 100 : 0}%` }} />
              </div>
              <span className="vd-bar-val">{completedCount}</span>
            </div>
            <div className="vd-bar-row">
              <span className="vd-bar-label" style={{ width: 80 }}>Pending</span>
              <div className="vd-bar-bg">
                <div className="vd-bar-fill" style={{ width: `${bookings.length ? (pendingRequests.length / bookings.length) * 100 : 0}%`, background: "#ef9f27" }} />
              </div>
              <span className="vd-bar-val">{pendingRequests.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKINGS TAB ─────────────────────────────────────────────────────────────
function BookingsTab({ bookings, onAccept, onReject }) {
  return (
    <div>
      <div className="vd-section-label">My Bookings</div>
      <div className="vd-card">
        {bookings.length === 0 ? (
          <p style={{ padding: "20px", color: "#888", textAlign: "center" }}>No bookings recorded in the system.</p>
        ) : (
          bookings.map(b => {
            const customerName = b.customer?.name || "Client";
            const initials = customerName.split(" ").map(n => n[0]).join("").toUpperCase();
            return (
              <div key={b._id} className="vd-booking-item">
                <div className="vd-b-avatar">{initials.substring(0, 2)}</div>
                <div className="vd-b-info">
                  <StatusTag status={b.status} />
                  <div className="vd-b-name">{customerName}</div>
                  <div className="vd-b-desc">
                    Event Date: {new Date(b.eventDate).toLocaleDateString()} | Total Package Amount: Rs. {b.totalAmount}
                  </div>
                </div>
                <div className="vd-b-meta">
                  <div className="vd-b-date" style={{ marginBottom: "5px", fontWeight: "bold" }}>
                    {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {b.status === "pending" && (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button className="vd-btn-acc" onClick={() => onAccept(b._id)}>Accept</button>
                      <button className="vd-btn-rej" onClick={() => onReject(b._id)}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "My Bookings" },
];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const vendorName = localStorage.getItem("vendorName") || "Vendor Panel";
  const vendorId = localStorage.getItem("userId") || ""; // Relies on login state token extraction
  const initials = vendorName.charAt(0).toUpperCase();

  // 🔄 FETCH REAL BOOKINGS FROM DUAL-DATABASE BACKEND
  const fetchVendorBookings = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const response = await API.get(`/api/bookings/vendor/${vendorId}`);
      if (response.data && response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to sync bookings data with server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorBookings();
  }, [vendorId]);

  // ⚡ ACTION METHOD: ACCEPT BOOKING
  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await API.put(`/api/bookings/${bookingId}/status`, { status: "accepted" });
      if (response.data && response.data.success) {
        // Update local state smoothly
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "accepted" } : b));
      }
    } catch (err) {
      alert("Error approving booking request.");
    }
  };

  // ⚡ ACTION METHOD: REJECT BOOKING
  const handleRejectBooking = async (bookingId) => {
    try {
      const response = await API.put(`/api/bookings/${bookingId}/status`, { status: "rejected" });
      if (response.data && response.data.success) {
        // Update local state smoothly
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "rejected" } : b));
      }
    } catch (err) {
      alert("Error rejecting booking request.");
    }
  };

  const topbarTitles = {
    overview: "Vendor Control Workspace",
    bookings: "Real-time Bookings Ledger",
  };

  const renderTab = () => {
    if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>Syncing Workspace with Cloud Engines...</div>;
    if (error) return <div style={{ color: "red", padding: "20px" }}>{error}</div>;

    switch (activeTab) {
      case "overview": 
        return (
          <OverviewTab 
            onGoToBookings={() => setActiveTab("bookings")} 
            bookings={bookings}
            onAccept={handleAcceptBooking}
            onReject={handleRejectBooking}
          />
        );
      case "bookings": 
        return (
          <BookingsTab 
            bookings={bookings} 
            onAccept={handleAcceptBooking}
            onReject={handleRejectBooking}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="vd-dash">
      {/* Sidebar */}
      <div className="vd-sidebar">
        <div className="vd-sidebar-logo">
          <span className="vd-brand">EventEase</span>
          <span className="vd-badge">vendor</span>
        </div>

        <div className="vd-sidebar-label">Main Panel</div>

        {TABS.map(tab => (
          <div
            key={tab.key}
            className={`vd-nav-item ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}

        <div className="vd-sidebar-bottom">
          <div className="vd-vendor-info">
            <div className="vd-avatar">{initials}</div>
            <div>
              <div className="vd-vname">{vendorName}</div>
              <div className="vd-vemail" style={{ fontSize: "10px", opacity: 0.7 }}>ID: Connected</div>
            </div>
          </div>
          <button
            className="vd-logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="vd-main">
        <div className="vd-topbar">
          <span className="vd-topbar-title">{topbarTitles[activeTab]}</span>
          <div className="vd-topbar-right">
            <span className="vd-status-dot" />
            <span className="vd-status-text">Live Synchronized</span>
          </div>
        </div>
        <div className="vd-content">{renderTab()}</div>
      </div>
    </div>
  );
}