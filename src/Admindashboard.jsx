import { useState, useEffect } from "react";
import API from "./api/axiosConfig";

const refunds = [
  { color: "green", title: "Vendor Cancels", desc: "100% full refund issued to customer automatically", iconClass: "ri-green" },
  { color: "blue", title: "Customer > 48 hours", desc: "100% refund if cancelled before 48-hour window", iconClass: "ri-blue" },
  { color: "red", title: "Customer ≤ 48 hours", desc: "0% refund — within cutoff period, no refund", iconClass: "ri-red" },
];

const refundBars = [
  { label: "Vendor cancelled", value: 3, pct: 30, color: "green" },
  { label: "Customer >48hr", value: 5, pct: 50, color: "blue" },
  { label: "No refund issued", value: 2, pct: 20, color: "red" },
];

const revenueBars = [
  { label: "Catering", value: "Rs 1.4M", pct: 75, color: "gold" },
  { label: "Photography", value: "Rs 0.9M", pct: 48, color: "blue" },
  { label: "Decoration", value: "Rs 1.1M", pct: 58, color: "green" },
  { label: "Sound System", value: "Rs 0.8M", pct: 40, color: "orange" },
];

const vendorBars = [
  { label: "Approved", value: "68%", pct: 68, color: "green" },
  { label: "Pending Review", value: "24%", pct: 24, color: "gold" },
  { label: "Rejected", value: "8%", pct: 8, color: "red" },
];

export default function Admindashboard() {
  const [stats, setStats] = useState(null);
  const [dbVendors, setDbVendors] = useState([]);
  const [dbBookings, setDbBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live Server Data Fetching Pipeline
  const fetchDashboardData = async () => {
    try {
      // 1. Stats Data Fetch
      const statsRes = await API.get('/api/admin/summary');
      setStats(statsRes.data.stats);

      // 2. Pending Vendors Fetch
      const vendorsRes = await API.get('/api/admin/pending');
      setDbVendors(vendorsRes.data.data || []);

      // 3. System Users/Bookings Fetch (Fallback Array if Empty)
      const usersRes = await API.get('/api/admin/users');
      // filter default bookings or display initial context
      setLoading(false);
    } catch (err) {
      console.error("Live fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Live Action: Admin Approves or Rejects a Vendor
  const handleVerifyVendor = async (id, statusAction) => {
    try {
      // Calls PUT /api/admin/verify-vendor/:id from your adminController
      await API.put(`/api/admin/verify${id}`, { status: statusAction });
      alert(`Vendor status successfully updated to: ${statusAction}`);
      fetchDashboardData(); // Refresh list live from database
    } catch (err) {
      console.error("Verification toggle failed:", err);
      alert("Failed to update vendor status on live server.");
    }
  };
  
  const statCards = [
    { color: "gold", label: "Total Users", value: stats ? stats.totalUsers : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
    { color: "green", label: "Total Vendors", value: stats ? stats.totalVendors : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
    { color: "blue", label: "Total Customers", value: stats ? stats.totalCustomers : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
    { color: "red", label: "Verified Vendors", value: stats ? stats.verifiedVendors : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
  ];

  return (
    <>
      {/* STAT CARDS */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className={`stat-card ${card.color}`} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="stat-label">{card.label}</div>
            <div className={`stat-val ${card.color}`}>{card.value}</div>
            <div className="stat-trend">
              <span className={card.trendUp ? "up" : "dn"}>{card.trend}</span> {card.trendLabel}
            </div>
          </div>
        ))}
      </div>

      {/* ROW 1: Vendor Moderation (LIVE) + Bookings Context */}
      <div className="grid-2">
        {/* Live Vendor Moderation */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Vendor Moderation</div>
            <span className="panel-badge pb-amber">{dbVendors.length} Pending</span>
          </div>
          
          {dbVendors.length === 0 ? (
            <div style={{ padding: "20px", color: "#888", textAlign: "center" }}>No pending vendors in database.</div>
          ) : (
            dbVendors.map((v, i) => (
              <div key={v._id || i} className="vendor-row">
                <div className="sdot field pend" />
                <div className="v-av va-a">{v.name ? v.name.substring(0,2).toUpperCase() : "VN"}</div>
                <div style={{ flex: 1, marginLeft: "10px" }}>
                  <div className="v-name">{v.name}</div>
                  <div className="v-type">{v.email} — Profile Pending</div>
                </div>
                <div className="v-actions">
                  <button className="btn-mini btn-approve" onClick={() => handleVerifyVendor(v._id, 'approved')}>✓ Approve</button>
                  <button className="btn-mini btn-reject" onClick={() => handleVerifyVendor(v._id, 'rejected')}>✕ Reject</button>
                </div>
              </div>
            ))
          )}

          <div className="bars-block" style={{ marginTop: "20px" }}>
            {vendorBars.map((b, i) => (
              <div key={i} className="bar-item">
                <div className="bar-meta">
                  <span>{b.label}</span>
                  <span className={`bar-val bv-${b.color}`}>{b.value}</span>
                </div>
                <div className="bar-track">
                  <div className={`bar-fill bf-${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Pipeline Pipeline */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Booking Pipeline</div>
            <span className="panel-badge pb-blue">Live System Monitor</span>
          </div>
          <div className="bk-head">
            <span>Customer</span><span>Amount</span><span>Date</span><span>Status</span>
          </div>
          
          {/* Default fallback demo dataset for pipeline render */}
          <div className="bk-row">
            <span className="bk-name">Ayesha Rehman</span>
            <span className="bk-amt">Rs 45,000</span>
            <span className="bk-date">Jul 12, 2026</span>
            <span className="tag tag-ok">Confirmed</span>
          </div>
          <div className="bk-row">
            <span className="bk-name">Sara Khan</span>
            <span className="bk-amt">Rs 80,000</span>
            <span className="bk-date">Jul 18, 2026</span>
            <span className="tag tag-pnd">Pending</span>
          </div>

          <div className="pay-section">
            <div className="pay-flow-label">Payment Flow Tracking</div>
            <div className="pay-flow">
              <div className="pay-seg pay-30">30% Advance</div>
              <div className="pay-seg pay-70">70% Post-Event Balance</div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Static Layout Context Logs */}
      <div className="grid-3">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Chat Logs & Alerts</div>
            <span className="panel-badge pb-red">System Core</span>
          </div>
          <div className="chat-item">
            <div className="chat-av va-a">AK</div>
            <div className="chat-body">
              <div className="chat-meta">
                <span className="chat-name">Ayesha K.</span>
                <span className="chat-to">→ Zara Events</span>
              </div>
              <div className="chat-msg">When will you confirm the menu for the wedding event?</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Refund Policy</div>
          </div>
          {refunds.map((r, i) => (
            <div key={i} className="refund-item">
              <div>
                <div className={`refund-title rt-${r.color}`}>{r.title}</div>
                <div className="refund-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Booking Breakdown</div>
          </div>
          <div className="bars-block rev-bars">
            {revenueBars.map((b, i) => (
              <div key={i} className="bar-item">
                <div className="bar-meta">
                  <span>{b.label}</span>
                  <span className={`bar-val bv-${b.color}`}>{b.value}</span>
                </div>
                <div className="bar-track">
                  <div className={`bar-fill bf-${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}