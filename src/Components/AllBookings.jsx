import { useState } from "react";

// Mock transactional bookings data
const initialBookings = [
  { id: "BK-9021", customer: "Ayesha Rehman", vendor: "Zara Events", type: "Catering", amount: "Rs 45,000", date: "Jul 12, 2026", status: "confirmed" },
  { id: "BK-9022", customer: "Sara Khan", vendor: "MK Photography", type: "Photography", amount: "Rs 80,000", date: "Jul 18, 2026", status: "pending" },
  { id: "BK-9023", customer: "Omar Baig", vendor: "Royal Sounds", type: "Sound System", amount: "Rs 30,000", date: "Jul 25, 2026", status: "cancelled" },
  { id: "BK-9024", customer: "Hina Javed", vendor: "Dream Weddings", type: "Decoration", amount: "Rs 1,20,000", date: "Aug 02, 2026", status: "confirmed" },
  { id: "BK-9025", customer: "Bilal Ahmed", vendor: "Zara Events", type: "Catering", amount: "Rs 65,000", date: "Aug 10, 2026", status: "pending" },
];

export default function AllBookings() {
  const [bookings, setBookings] = useState(initialBookings);

  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map(bk => bk.id === id ? { ...bk, status: newStatus } : bk));
  };

  return (
    <div className="panel" style={{ background: "rgba(19, 31, 56, 0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "24px" }}>
      <div className="panel-head" style={{ marginBottom: "20px", display: "flex", justifyContent: "between", alignItems: "center" }}>
        <div>
          <h3 style={{ color: "#fff", margin: 0, fontSize: "20px" }}>Global Transaction Pipeline</h3>
          <p style={{ color: "#8a99ad", margin: "4px 0 0 0", fontSize: "14px" }}>Monitor and manage user bookings across Pakistan.</p>
        </div>
        <span className="panel-badge pb-blue" style={{ background: "#1e3a8a", color: "#3b82f6", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
          {bookings.length} Total Logs
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", color: "#fff" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", color: "#8a99ad", fontSize: "14px" }}>
              <th style={{ padding: "12px" }}>Booking ID</th>
              <th style={{ padding: "12px" }}>Customer</th>
              <th style={{ padding: "12px" }}>Vendor Service</th>
              <th style={{ padding: "12px" }}>Amount</th>
              <th style={{ padding: "12px" }}>Event Date</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "15px" }} className="bk-row-hover">
                <td style={{ padding: "16px 12px", fontWeight: "bold", color: "#ffd700" }}>{b.id}</td>
                <td style={{ padding: "16px 12px" }}>{b.customer}</td>
                <td style={{ padding: "16px 12px" }}>
                  <div>{b.vendor}</div>
                  <div style={{ fontSize: "12px", color: "#8a99ad" }}>{b.type}</div>
                </td>
                <td style={{ padding: "16px 12px", fontWeight: "600" }}>{b.amount}</td>
                <td style={{ padding: "16px 12px", color: "#cbd5e1" }}>{b.date}</td>
                <td style={{ padding: "16px 12px" }}>
                  <span className={`tag tag-${b.status === "confirmed" ? "ok" : b.status === "pending" ? "pnd" : "can"}`}>
                    {b.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "16px 12px", textAlign: "right" }}>
                  {b.status === "pending" && (
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => handleStatusChange(b.id, "confirmed")} style={{ background: "#10b981", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Approve</button>
                      <button onClick={() => handleStatusChange(b.id, "cancelled")} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Cancel</button>
                    </div>
                  )}
                  {b.status !== "pending" && <span style={{ color: "#64748b", fontSize: "13px" }}>Locked</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}