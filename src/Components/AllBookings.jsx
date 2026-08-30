import { useState, useEffect } from "react";
import API from "../api/axiosConfig"; // Apne path ke mutabiq adjust karein

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/api/admin/bookings');
      setBookings(res.data.bookings || res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="panel" style={{ background: "rgba(19, 31, 56, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "24px" }}>
      <div className="panel-head" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ color: "#fff", margin: 0, fontSize: "20px" }}>Global Transaction Pipeline</h3>
          <p style={{ color: "#8a99ad", margin: "4px 0 0 0", fontSize: "14px" }}>Monitor and manage user bookings across Pakistan.</p>
        </div>
        <span className="panel-badge pb-blue" style={{ background: "#1e3a8a", color: "#3b82f6", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
          {bookings.length} Total Logs
        </span>
      </div>

      {loading ? (
        <div style={{ color: "#fff", textAlign: "center", padding: "20px" }}>Loading bookings from server...</div>
      ) : bookings.length === 0 ? (
        <div style={{ color: "#8a99ad", textAlign: "center", padding: "20px" }}>No bookings found in database.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", color: "#fff" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", color: "#8a99ad", fontSize: "14px" }}>
                <th style={{ padding: "12px" }}>Booking ID</th>
                <th style={{ padding: "12px" }}>Customer ID</th>
                <th style={{ padding: "12px" }}>Vendor ID</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "15px" }}>
                  <td style={{ padding: "16px 12px", fontWeight: "bold", color: "#ffd700" }}>{b._id.slice(-6)}</td>
                  <td style={{ padding: "16px 12px" }}>{b.userId || "N/A"}</td>
                  <td style={{ padding: "16px 12px" }}>{b.vendorId || "N/A"}</td>
                  <td style={{ padding: "16px 12px" }}>
                    <span className="tag tag-ok">
                      {b.status ? b.status.toUpperCase() : "PENDING"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 12px", color: "#cbd5e1" }}>
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}