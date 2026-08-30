import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axiosConfig";
import "../Admindashboard.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Command Center");
  const [counts, setCounts] = useState({ pendingVendors: 0, totalBookings: 0, chats: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await API.get('/api/admin/dashboard');
        if (res.data && res.data.stats) {
          setCounts({
            pendingVendors: res.data.stats.totalVendors || 0,
            totalBookings: res.data.stats.totalBookings || 0,
            chats: 0
          });
        }
      } catch (err) {
        console.error("Admin counts fetch failed:", err);
      }
    };
    fetchCounts();
  }, []);

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
        { label: "Vendor Approval", path: "/admin/vendors", badge: counts.pendingVendors > 0 ? String(counts.pendingVendors) : null, badgeType: "amber" },
        { label: "All Bookings", path: "/admin/bookings", badge: counts.totalBookings > 0 ? String(counts.totalBookings) : null, badgeType: "red" },
        { label: "Payouts", path: "/admin/payouts" },
        { label: "Users", path: "/admin/users" },
      ],
    },
    {
      label: "Monitoring",
      items: [
        { label: "Chat Logs", path: "/admin/chats", badge: counts.chats > 0 ? String(counts.chats) : null, badgeType: "red" },
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

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/vendors")) setPageTitle("Vendor Verification");
    else if (currentPath.includes("/bookings")) setPageTitle("Transactional Bookings");
    else if (currentPath.includes("/payouts")) setPageTitle("Financial Payouts");
    else if (currentPath.includes("/users")) setPageTitle("User Identity Control");
    else if (currentPath.includes("/chats")) setPageTitle("Secure Chat Auditor");
    else if (currentPath.includes("/disputes")) setPageTitle("Dispute Resolution");
    else if (currentPath.includes("/alerts")) setPageTitle("System Automated Alerts");
    else if (currentPath.includes("/analytics")) setPageTitle("Platform Analytics");
    else if (currentPath.includes("/commission")) setPageTitle("Commission Settings");
    else if (currentPath.includes("/settings")) setPageTitle("System Configuration");
    else if (currentPath.includes("/profile")) setPageTitle("Admin Profile");
    else setPageTitle("Command Center");
  }, [location]);

  return (
    <div className="shell">
      <div className="blob blob1" />
      <div className="blob blob2" />

      {/* FIXED SIDEBAR */}
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate("/admin")} style={{ cursor: 'pointer' }}>
          <div className="brand-mark">EE</div>
          <div>
            <div className="brand-name">EventEase</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>

        {navSections.map((section) => (
          <div key={section.label} className="nav-section">
            <div className="nav-label">{section.label}</div>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path === "/admin" && location.pathname === "/admin/dashboard");
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`nav-item${isActive ? " active" : ""}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {item.label}
                  {item.badge && (
                    <span className={`nav-badge${item.badgeType === "amber" ? " amber" : ""}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
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
        <div className="topbar">
          <div>
            <div className="page-title">{pageTitle.split(" ")[0]} <span>{pageTitle.split(" ").slice(1).join(" ")}</span></div>
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

        <div className="admin-content-area" style={{ marginTop: '20px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}