import "./Admindashboard.css";

const navSections = [
  {
    label: "Overview",
    items: [
      { icon: "◈", label: "Dashboard", active: true },
      { icon: "◉", label: "Analytics" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: "◎", label: "Vendor Approval", badge: "3", badgeType: "amber" },
      { icon: "▦", label: "All Bookings", badge: "2", badgeType: "red" },
      { icon: "◷", label: "Payouts" },
      { icon: "⊛", label: "Users" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { icon: "◫", label: "Chat Logs", badge: "2", badgeType: "red" },
      { icon: "◬", label: "Disputes" },
      { icon: "◭", label: "Alerts" },
    ],
  },
  {
    label: "Config",
    items: [
      { icon: "⊕", label: "Commission" },
      { icon: "◌", label: "Settings" },
    ],
  },
];

const statCards = [
  { color: "gold", icon: "💰", label: "Total Revenue", value: "Rs 4.2M", trend: "↑ 8.4%", trendLabel: "vs last month", trendUp: true },
  { color: "green", icon: "👥", label: "Registered Users", value: "1,284", trend: "↑ 12", trendLabel: "new this week", trendUp: true },
  { color: "blue", icon: "📦", label: "Total Bookings", value: "342", trend: "↑ 23", trendLabel: "this month", trendUp: true },
  { color: "red", icon: "🏦", label: "Vendor Payouts", value: "Rs 3.8M", trend: "↑ 94%", trendLabel: "disbursed", trendUp: true },
];

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
  { icon: "✓", color: "green", title: "Vendor Cancels", desc: "100% full refund issued to customer automatically", iconClass: "ri-green" },
  { icon: "⏱", color: "blue", title: "Customer > 48 hours", desc: "100% refund if cancelled before 48-hour window", iconClass: "ri-blue" },
  { icon: "✕", color: "red", title: "Customer ≤ 48 hours", desc: "0% refund — within cutoff period, no refund", iconClass: "ri-red" },
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
  const [activeNav, setActiveNav] = ("Dashboard");

  return (
    <div className="shell">
      {/* Decorative blobs */}
      <div className="blob blob1" />
      <div className="blob blob2" />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">EE</div>
          <div>
            <div className="brand-name">EventEase</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>

        {navSections.map((section) => (
          <div key={section.label} className="nav-section">
            <div className="nav-label">{section.label}</div>
            {section.items.map((item) => (
              <div
                key={item.label}
                className={`nav-item${activeNav === item.label ? " active" : ""}`}
                onClick={() => setActiveNav(item.label)}
              >
                <span className="ni-icon">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className={`nav-badge${item.badgeType === "amber" ? " amber" : ""}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="admin-card">
            <div className="admin-av">SA</div>
            <div>
              <div className="admin-name">Super Admin</div>
              <div className="admin-role">RBAC: Full Access</div>
            </div>
            <div className="online-dot" />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="page-title">Command <span>Center</span></div>
            <div className="page-sub">Sunday, April 26, 2026 — Live data</div>
          </div>
          <div className="topbar-right">
            <div className="chip"><span className="chip-dot live" /> Live</div>
            <div className="chip">⚙ Commission: 0%</div>
            <div className="chip">⊕ Export Report</div>
          </div>
        </div>

        {/* RBAC Ribbon */}
        <div className="rbac-ribbon">
          <span className="rbac-icon">🔐</span>
          <span><strong>Role-Based Access Control Active</strong> — This dashboard is accessible only to authorized administrators. All actions are logged.</span>
        </div>

        {/* STAT CARDS */}
        <div className="stats-grid">
          {statCards.map((card, i) => (
            <div key={i} className={`stat-card ${card.color}`} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={`stat-icon ${card.color}`}>{card.icon}</div>
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
                <div className="pay-seg pay-70">70% Post-Event Balance</div>
              </div>
              <div className="pay-footer">
                <span>Booking confirmation</span>
                <span>After event completion</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Chat Logs + Refund Policy + Booking Breakdown */}
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
                    <span className="chat-time">{c.time}</span>
                  </div>
                  <div className="chat-msg">{c.msg}</div>
                </div>
              </div>
            ))}
            <div className="privacy-note">🔒 Privacy protocol: Admin accesses logs only during dispute resolution</div>
          </div>

          {/* Refund Policy */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Refund Policy</div>
              <span className="panel-badge pb-green">Active</span>
            </div>
            {refunds.map((r, i) => (
              <div key={i} className="refund-item">
                <div className={`refund-icon ${r.iconClass}`}>{r.icon}</div>
                <div>
                  <div className={`refund-title rt-${r.color}`}>{r.title}</div>
                  <div className="refund-desc">{r.desc}</div>
                </div>
              </div>
            ))}
            <div className="bars-block">
              <div className="bars-sub-label">This Month Refunds</div>
              {refundBars.map((b, i) => (
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

          {/* Booking Breakdown */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Booking Breakdown</div>
              <span className="panel-badge pb-blue">Live</span>
            </div>
            <div className="donut-wrap">
              <svg className="donut-svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(30,60,114,0.08)" strokeWidth="14" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="14"
                  strokeDasharray="144.5 238.76" strokeDashoffset="0"
                  transform="rotate(-90 50 50)" strokeLinecap="round" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="14"
                  strokeDasharray="66.5 238.76" strokeDashoffset="-144.5"
                  transform="rotate(-90 50 50)" strokeLinecap="round" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="14"
                  strokeDasharray="26.3 238.76" strokeDashoffset="-211"
                  transform="rotate(-90 50 50)" strokeLinecap="round" />
                <text x="50" y="47" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif" fontSize="14" fontWeight="700" fill="#1e3a5f">342</text>
                <text x="50" y="59" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="8" fill="#94a3b8">total</text>
              </svg>
              <div className="donut-legend">
                {[
                  { color: "#10b981", label: "Confirmed", val: "61%" },
                  { color: "#f59e0b", label: "Pending", val: "28%" },
                  { color: "#ef4444", label: "Cancelled", val: "11%" },
                ].map((l, i) => (
                  <div key={i} className="legend-item">
                    <div className="legend-dot" style={{ background: l.color }} />
                    <span className="legend-label">{l.label}</span>
                    <span className="legend-val" style={{ color: l.color }}>{l.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bars-block rev-bars">
              <div className="bars-sub-label">Revenue by Category</div>
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
      </main>
    </div>
  );
};