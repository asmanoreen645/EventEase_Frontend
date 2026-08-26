// src/Components/VendorApproval.jsx
import { useState, useEffect } from 'react';
import API from '../api/axiosConfig';

export default function VendorApproval() {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend api endpoint for unapproved vendors
      const res = await API.get('/api/admin/vendors/pending');
      if (res.data && res.data.success) {
        setPendingVendors(res.data.data || []);
      } else {
        setPendingVendors([]);
      }
    } catch (err) {
      console.error("Error fetching pending vendors:", err);
      // Fallback: search general vendors list filtered by approval status
      try {
        const fallbackRes = await API.get('/api/vendors');
        if (fallbackRes.data) {
          const list = Array.isArray(fallbackRes.data) ? fallbackRes.data : fallbackRes.data.data || [];
          const unapproved = list.filter(v => v.isApproved === false || v.status === 'pending');
          setPendingVendors(unapproved);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (fallbackErr) {
        setError("Failed to load pending vendors from server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPendingVendors();
  }, []);

  async function handleApprove(id) {
    try {
      await API.put(`/api/admin/vendors/${id}/approve`, { isApproved: true, status: 'approved' });
      setPendingVendors(prev => prev.filter(v => (v._id || v.id) !== id));
      alert("Vendor approved successfully!");
    } catch (err) {
      console.error("Error approving vendor:", err);
      alert("Failed to approve vendor.");
    }
  }

  const handleReject = async (id) => {
    try {
      await API.put(`/api/admin/vendors/${id}/reject`, { isApproved: false, status: 'rejected' });
      setPendingVendors(prev => prev.filter(v => (v._id || v.id) !== id));
      alert("Vendor request rejected.");
    } catch (err) {
      console.error("Error rejecting vendor:", err);
      alert("Failed to reject vendor.");
    }
  };

  if (loading) return <div style={{ padding: "30px", color: "#333" }}>Loading pending vendor applications...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vendor Verification Console</h2>
      {error && !pendingVendors.length ? (
        <div style={{ padding: "20px", color: "#e53e3e", background: "#fff5f5", borderRadius: "8px", marginTop: "15px" }}>
          {error}
        </div>
      ) : pendingVendors.length === 0 ? (
        <div style={{ padding: "20px", background: "#f7fafc", borderRadius: "8px", marginTop: "15px" }}>
          No pending vendor approval requests right now.
        </div>
      ) : (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {pendingVendors.map((vendor) => {
            const id = vendor._id || vendor.id;
            return (
              <div key={id} style={{ padding: "15px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{vendor.name || vendor.businessName || "New Vendor"}</h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    Email: {vendor.email} | Category: {vendor.category || 'N/A'} | City: {vendor.city || 'N/A'}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleApprove(id)} style={{ padding: "8px 16px", background: "#38a169", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(id)} style={{ padding: "8px 16px", background: "#e53e3e", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}