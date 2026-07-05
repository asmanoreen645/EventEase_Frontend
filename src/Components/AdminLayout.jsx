import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../Admindashboard.css";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: "/admin" },
      { label: "Analytics", path: "/admin/analytics" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Vendor Approval", path: "/admin/vendors", badge: "3", badgeType: "amber" },
      { label: "All Bookings", path: "/admin/bookings", badge: "2", badgeType: "red" },
      { label: "Payouts", path: "/admin/payouts" },
      { label: "Users", path: "/admin/users" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { label: "Chat Logs", path: "/admin/chats", badge: "2", badgeType: "red" },
      { label: "Disputes", path: "/admin/disputes" },
      { label: "Alerts", path: "/admin/alerts" },
    ],
  },
  {
    label: "Config",
    items: [
      { label: "Commission", path: "/admin/commission" },
      { label: "Settings", path: "/admin/settings" },
    ],
  },
];

export default function AdminLayout() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const navigate = useNavigate();

  return (
    <div className="shell">
      <div className="blob blob1" />
      <div className="blob blob2" />

      {/* FIXED SIDEBAR */}
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
              <Link
                key={item.label}
                to={item.path}
                className={`nav-item${activeNav === item.label ? " active" : ""}`}
                onClick={() => setActiveNav(item.label)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {item.label}
                {item.badge && (
                  <span className={`nav-badge${item.badgeType === "amber" ? " amber" : ""}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}

        <div className="sidebar-footer" onClick={() => navigate("/admin/profile")} style={{ cursor: "pointer" }}>
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

      {/* DYNAMIC CONTENT WRAPPER */}
      <main className="main">
        {/* Fixed Topbar */}
        <div className="topbar">
          <div>
            <div className="page-title">Command <span>Center</span></div>
            <div className="page-sub">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — Live data</div>
          </div>
          <div className="topbar-right">
            <div className="chip"><span className="chip-dot live" /> Live</div>
            <div className="chip">⚙ Commission: Dynamic</div>
            <div className="chip" style={{ cursor: 'pointer' }}>⊕ Export Report</div>
          </div>
        </div>

        <div className="rbac-ribbon">
          <span className="rbac-icon">🔐</span>
          <span><strong>Role-Based Access Control Active</strong> — Authorized admins logs enabled.</span>
        </div>

        {/* Dynamic Inner Component Render Area */}
        <Outlet />
      </main>
    </div>
  );
}