import { useState, useEffect } from "react";
import API from "./api/axiosConfig";

// Aapka purana static data jo aapne panels mein use kiya tha
const vendors = [
  { initials: "ZE", name: "Zara Events", type: "Catering — docs uploaded", status: "pending", colorClass: "va-a" },
  { initials: "MK", name: "MK Photography", type: "Photography — docs uploaded", status: "pending", colorClass: "va-b" },
  { initials: "RS", name: "Royal Sounds", type: "Sound System — reviewing", status: "pending", colorClass: "va-c" },
  { initials: "DW", name: "Dream Weddings", type: "Decoration — approved", status: "approved", colorClass: "va-d" },
];

const bookings = [
  { name: "Ayesha Rehman", amount: "Rs 45,000", date: "Apr 28", status: "confirmed" },
  { name: "Sara Khan", amount: "Rs 80,000", date: "May 3", status: "pending" },
  { name: "Omar Baig", amount: "Rs 30,000", date: "Apr 25", status: "cancelled" },
  { name: "Hina Javed", amount: "Rs 1,20,000", date: "May 10", status: "confirmed" },
  { name: "Bilal Ahmed", amount: "Rs 65,000", date: "May 15", status: "pending" },
];

const chatLogs = [
  { initials: "AK", colorClass: "va-a", name: "Ayesha K.", vendor: "Zara Events", time: "10:42 AM", msg: "When will you confirm the menu for the wedding event?", flagged: false },
  { initials: "OM", colorClass: "va-d", name: "Omar M.", vendor: "MK Photo", time: "9:15 AM", msg: "Message flagged by automated alert system", flagged: true },
  { initials: "HJ", colorClass: "va-b", name: "Hina J.", vendor: "Royal Sounds", time: "Yesterday", msg: "Please share the full equipment list for the banquet hall", flagged: false },
  { initials: "SR", colorClass: "va-c", name: "Sara R.", vendor: "Zara Events", time: "Yesterday", msg: "Dispute raised — log accessed for conflict review", flagged: true },
];

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/api/admin/summary');
        setStats(response.data.stats);
      } catch (err) {
        console.error("Stats error:", err);
      }
    };
    fetchStats();
  }, []);
  
  const statCards = [
    { color: "gold", label: "Total Users", value: stats ? stats.totalUsers : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
    { color: "green", label: "Total Vendors", value: stats ? stats.totalVendors : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
    { color: "blue", label: "Total Customers", value: stats ? stats.totalCustomers : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
    { color: "red", label: "Verified Vendors", value: stats ? stats.verifiedVendors : "...", trend: "↑ Live", trendLabel: "from database", trendUp: true },
  ];

  return (
    <>
      {/* STAT CARDS (Aapki file se liya gaya core content) */}
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

      {/* ROW 1: Vendor + Bookings */}
      <div className="grid-2">
        {/* Vendor Moderation */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Vendor Moderation</div>
            <span className="panel-badge pb-amber">3 Pending</span>
          </div>
          {vendors.map((v, i) => (
            <div key={i} className="vendor-row">
              <div className={`sdot ${v.status === "pending" ? "pend" : "appr"}`} />
              <div className={`v-av ${v.colorClass}`}>{v.initials}</div>
              <div>
                <div className="v-name">{v.name}</div>
                <div className="v-type">{v.type}</div>
              </div>
              {v.status === "pending" ? (
                <div className="v-actions">
                  <button className="btn-mini btn-approve">✓ Approve</button>
                  <button className="btn-mini btn-reject">✕ Reject</button>
                </div>
              ) : (
                <span className="active-label">● Active</span>
              )}
            </div>
          ))}
          <div className="bars-block">
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

        {/* Booking Pipeline */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Booking Pipeline</div>
            <span className="panel-badge pb-blue">342 Total</span>
          </div>
          <div className="bk-head">
            <span>Customer</span><span>Amount</span><span>Date</span><span>Status</span>
          </div>
          {bookings.map((b, i) => (
            <div key={i} className="bk-row">
              <span className="bk-name">{b.name}</span>
              <span className="bk-amt">{b.amount}</span>
              <span className="bk-date">{b.date}</span>
              <span className={`tag tag-${b.status === "confirmed" ? "ok" : b.status === "pending" ? "pnd" : "can"}`}>
                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </span>
            </div>
          ))}
          <div className="pay-section">
            <div className="pay-flow-label">Payment Flow</div>
            <div className="pay-flow">
              <div className="pay-seg pay-30">30% Advance</div>
              <div className="pay-seg pay-70">7Post-Event Balance</div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Chat Logs + Refunds + Breakdown */}
      <div className="grid-3">
        {/* Chat Logs */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Chat Logs & Alerts</div>
            <span className="panel-badge pb-red">2 Flagged</span>
          </div>
          {chatLogs.map((c, i) => (
            <div key={i} className="chat-item">
              <div className={`chat-av ${c.colorClass}`}>{c.initials}</div>
              <div className="chat-body">
                <div className="chat-meta">
                  <span className="chat-name">{c.name}</span>
                  <span className="chat-to">→ {c.vendor}</span>
                  {c.flagged && <span className="alert-chip">⚠ Bad Word</span>}
                </div>
                <div className="chat-msg">{c.msg}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Refund Policy */}
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

        {/* Booking Breakdown */}
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