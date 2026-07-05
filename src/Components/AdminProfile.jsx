import { useState } from "react";

export default function AdminProfile() {
  const [adminData, setAdminData] = useState({
    name: "Super Admin",
    email: "admin@eventease.com",
    role: "Role-Based Access Control (Full Root Access)",
    currentPassword: "",
    newPassword: "",
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Profile security credentials updated successfully!");
  };

  return (
    <div className="panel" style={{ background: "rgba(19, 31, 56, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #ffd700, #ffa500)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold", color: "#0b132b", margin: "0 auto 12px auto" }}>
          SA
        </div>
        <h3 style={{ color: "#fff", margin: 0, fontSize: "22px" }}>Account Settings</h3>
        <p style={{ color: "#8a99ad", fontSize: "14px", margin: "4px 0 0 0" }}>Manage your administrative credentials and security tokens.</p>
      </div>

      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ color: "#8a99ad", display: "block", marginBottom: "8px", fontSize: "14px" }}>Administrative Name</label>
          <input type="text" value={adminData.name} disabled style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#64748b", cursor: "not-allowed" }} />
        </div>

        <div>
          <label style={{ color: "#8a99ad", display: "block", marginBottom: "8px", fontSize: "14px" }}>Security Access Level</label>
          <input type="text" value={adminData.role} disabled style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#ffd700", cursor: "not-allowed", fontWeight: "bold" }} />
        </div>

        <div>
          <label style={{ color: "#8a99ad", display: "block", marginBottom: "8px", fontSize: "14px" }}>Email Address</label>
          <input type="email" value={adminData.email} onChange={(e) => setAdminData({...adminData, email: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(11, 19, 43, 0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff" }} required />
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "10px 0" }} />

        <div>
          <label style={{ color: "#8a99ad", display: "block", marginBottom: "8px", fontSize: "14px" }}>Current Password</label>
          <input type="password" placeholder="••••••••" value={adminData.currentPassword} onChange={(e) => setAdminData({...adminData, currentPassword: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(11, 19, 43, 0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff" }} />
        </div>

        <div>
          <label style={{ color: "#8a99ad", display: "block", marginBottom: "8px", fontSize: "14px" }}>New Secure Password</label>
          <input type="password" placeholder="Enter new password" value={adminData.newPassword} onChange={(e) => setAdminData({...adminData, newPassword: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(11, 19, 43, 0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff" }} />
        </div>

        <button type="submit" style={{ background: "linear-gradient(135deg, #ffd700, #ffa500)", color: "#0b132b", border: "none", padding: "14px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "10px", transition: "all 0.3s ease" }}>
          Save Configuration Changes
        </button>
      </form>
    </div>
  );
}