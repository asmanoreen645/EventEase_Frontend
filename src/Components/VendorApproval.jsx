import { useState, useEffect } from 'react'; 
import API from '../api/axiosConfig';

export default function VendorApproval() {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to render text safely
  const renderSafeString = (val, fallback = "N/A") => {
    if (!val) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return val;
    if (typeof val === 'object') {
      return val.name || val.title || val.businessName || val.email || val.label || JSON.stringify(val);
    }
    return fallback;
  };

  useEffect(() => {
    const fetchPendingVendors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/admin/vendors/pending').catch(() => API.get('/api/admin/vendors/pending'));
        const data = res.data?.data || res.data?.vendors || res.data;
        
        if (Array.isArray(data)) {
          setPendingVendors(data);
        } else {
          throw new Error("Invalid array");
        }
      } catch (err) {
        console.warn("Primary pending endpoint failed, trying general vendors list:", err);
        try {
          const fallbackRes = await API.get('/vendors').catch(() => API.get('/api/vendors'));
          const rawList = fallbackRes.data?.data || fallbackRes.data?.vendors || fallbackRes.data;
          
          if (Array.isArray(rawList)) {
            const unapproved = rawList.filter(
              (v) => v.isApproved === false || v.status === 'pending' || !v.isApproved
            );
            setPendingVendors(unapproved);
          } else {
            setError("Failed to load pending vendors.");
          }
        } catch (fallbackErr) {
          console.error("Fallback failed:", fallbackErr);
          setError("Failed to load pending vendors.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingVendors();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/vendors/${id}/approve`, { isApproved: true, status: 'approved' })
               .catch(() => API.put(`/api/admin/vendors/${id}/approve`, { isApproved: true, status: 'approved' }));
      setPendingVendors((prev) => prev.filter((v) => (v._id || v.id) !== id));
      alert("Vendor approved successfully!");
    } catch (err) {
      console.error("Error approving vendor:", err);
      alert("Failed to approve vendor.");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/admin/vendors/${id}/reject`, { isApproved: false, status: 'rejected' })
               .catch(() => API.put(`/api/admin/vendors/${id}/reject`, { isApproved: false, status: 'rejected' }));
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {pendingVendors.map((vendor) => {
            const id = vendor._id || vendor.id;
            
            // Checking nested fields from MongoDB/Cloudinary
            const email = vendor.email || vendor.user?.email || vendor.userId?.email;
            const phone = vendor.phone || vendor.contactNumber || vendor.user?.phone;
            const city = vendor.city || vendor.location;
            const cnic = vendor.cnic || vendor.cnicNumber;
            const cnicDoc = vendor.cnicUrl || vendor.cnicImage || vendor.cnicDoc;
            const licenseDoc = vendor.licenseUrl || vendor.licenseImage || vendor.licenseDoc || vendor.document;

            return (
              <div 
                key={id} 
                style={{ 
                  padding: "20px", 
                  background: "#FFFFFF", 
                  border: "1px solid #E2E8F0", 
                  borderRadius: "8px", 
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#2D3748" }}>
                      {renderSafeString(vendor.name || vendor.businessName || vendor.username, "New Vendor Request")}
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
                      <strong>Email:</strong> {renderSafeString(email)} | <strong>Phone:</strong> {renderSafeString(phone)} | <strong>Category:</strong> {renderSafeString(vendor.category)} | <strong>City:</strong> {renderSafeString(city)}
                    </p>
                    {cnic && (
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#718096" }}>
                        <strong>CNIC Number:</strong> {renderSafeString(cnic)}
                      </p>
                    )}
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

                {/* Cloudinary Documents Verification Section */}
                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #E2E8F0", display: "flex", gap: "15px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A5568" }}>Submitted Documents:</span>
                  
                  {cnicDoc ? (
                    <a 
                      href={cnicDoc} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ padding: "5px 12px", background: "#EBF8FF", color: "#3182CE", border: "1px solid #90CDF4", borderRadius: "4px", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}
                    >
                      View CNIC Document ↗
                    </a>
                  ) : (
                    <span style={{ fontSize: "13px", color: "#A0AEC0" }}>No CNIC Uploaded</span>
                  )}

                  {licenseDoc ? (
                    <a 
                      href={licenseDoc} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ padding: "5px 12px", background: "#EBF8FF", color: "#3182CE", border: "1px solid #90CDF4", borderRadius: "4px", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}
                    >
                      View License Document ↗
                    </a>
                  ) : (
                    <span style={{ fontSize: "13px", color: "#A0AEC0" }}>No License Uploaded</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}