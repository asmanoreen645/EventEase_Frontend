import { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import toast from "react-hot-toast";

export default function AdminVendorApproval() {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await API.get('/vendors/pending', { headers: getAuthHeader() });
      const list = res.data?.data || res.data?.vendors || [];
      setPendingVendors(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching pending vendors:", err);
      toast.error("Failed to load vendor requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (id) => {
    try {
      await API.put(`/vendors/approve/${id}`, {}, { headers: getAuthHeader() });
      toast.success("Vendor Approved! Now visible on website.");
      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error("Approval failed!");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/vendors/reject/${id}`, {}, { headers: getAuthHeader() });
      toast.error("Vendor application rejected.");
      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed!");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "15px" }}>
        <h2 style={{ margin: 0, color: "#222" }}>
          Pending Vendor Verification Requests 
        </h2>
        <span style={{ background: "#dc3545", color: "#fff", borderRadius: "20px", padding: "4px 12px", fontSize: "14px", fontWeight: "bold" }}>
          {pendingVendors.length} New
        </span>
      </div>

      {loading ? (
        <p style={{ marginTop: "30px", color: "#666" }}>Loading vendor verification requests...</p>
      ) : pendingVendors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#888" }}>
          <h3>No Pending Requests</h3>
          <p>All vendor applications have been processed.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
          {pendingVendors.map((vendor) => (
            <div key={vendor._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <div>
                <h3 style={{ margin: "0 0 6px 0", color: "#111" }}>{vendor.businessName || "Vendor Name"}</h3>
                <p style={{ margin: "2px 0", fontSize: "13px", color: "#555" }}>
                  <strong>Category:</strong> {vendor.category || "Unassigned"}
                </p>
                <p style={{ margin: "2px 0", fontSize: "13px", color: "#555" }}>
                  <strong>Email:</strong> {vendor.userId?.email || vendor.email || "N/A"} | <strong>Phone:</strong> {vendor.phone || "N/A"}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => handleApprove(vendor._id)}
                  style={{ background: "#28a745", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Approve & Publish
                </button>
                <button 
                  onClick={() => handleReject(vendor._id)}
                  style={{ background: "#dc3545", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}