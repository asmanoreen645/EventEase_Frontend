 
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
      // 1. Try Primary Admin Pending Route
      const res = await API.get('/api/admin/vendors/pending');
      const data = res.data?.data || res.data?.vendors || res.data;
      
      if (Array.isArray(data)) {
        setPendingVendors(data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      console.warn("Primary endpoint failed, attempting fallback to general vendors list:", err);
      
      // 2. Fallback: Fetch all vendors and filter unapproved ones client-side
      try {
        const fallbackRes = await API.get('/api/vendors');
        const rawList = fallbackRes.data?.data || fallbackRes.data?.vendors || fallbackRes.data;
        
        if (Array.isArray(rawList)) {
          const unapproved = rawList.filter(
            (v) => v.isApproved === false || v.status === 'pending' || !v.isApproved
          );
          setPendingVendors(unapproved);
        } else {
          setError("Failed to load pending vendors from server.");
        }
      } catch (fallbackErr) {
        console.error("Fallback failed:", fallbackErr);
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

  const handleApprove = async (id) => {
    try {
      await API.put(`/api/admin/vendors/${id}/approve`, { isApproved: true, status: 'approved' });
      setPendingVendors((prev) => prev.filter((v) => (v._id || v.id) !== id));
      alert("Vendor approved successfully!");
    } catch (err) {
      console.error("Error approving vendor:", err);
      alert("Failed to approve vendor.");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/api/admin/vendors/${id}/reject`, { isApproved: false, status: 'rejected' });
      setPendingVendors((prev) => prev.filter((v) => (v._id || v.id) !== id));
      alert("Vendor request rejected.");
    } catch (err) {
      console.error("Error rejecting vendor:", err);
      alert("Failed to reject vendor.");
    }
  };

  if (loading) {
    return <div style={{ padding: "30px", color: "#4A5568" }}>Loading pending vendor applications...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Vendor Verification Console</h2>
      
      {error && pendingVendors.length === 0 ? (
        <div style={{ padding: "20px", color: "#E53E3E", background: "#FFF5F5", borderRadius: "8px", border: "1px solid #FEB2B2" }}>
          {error}
        </div>
      ) : pendingVendors.length === 0 ? (
        <div style={{ padding: "20px", background: "#F7FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
          No pending vendor approval requests right now.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {pendingVendors.map((vendor) => {
            const id = vendor._id || vendor.id;
            return (
              <div 
                key={id} 
                style={{ 
                  padding: "15px 20px", 
                  background: "#FFFFFF", 
                  border: "1px solid #E2E8F0", 
                  borderRadius: "8px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#2D3748" }}>
                    {vendor.name || vendor.businessName || vendor.username || "New Vendor Request"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
                    Email: {vendor.email || "N/A"} | Category: {vendor.category || "N/A"} | City: {vendor.city || "N/A"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => handleApprove(id)} 
                    style={{ padding: "8px 16px", background: "#38A169", color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(id)} 
                    style={{ padding: "8px 16px", background: "#E53E3E", color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                  >
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