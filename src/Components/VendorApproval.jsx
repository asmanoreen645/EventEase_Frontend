import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

export default function VendorApproval() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingVendors = () => {
    setLoading(true);
    setError(null);
    API.get('/api/admin/pending-vendors')
      .then(res => {
        const fetchedData = res.data.data || res.data.vendors || [];
        setVendors(fetchedData);
      })
      .catch(err => {
        console.error("Pending vendors fetch error:", err);
        setError("Failed to load pending vendors from server.");
        setVendors([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/admin/verify-vendor/${id}`, { status });
      alert(`Vendor application successfully ${status}!`);
      fetchPendingVendors(); // Real list dobara fetch karo taake sahi state dikhe
    } catch (err) {
      console.error("Vendor status update error:", err);
      alert("Failed to update vendor status. Please try again.");
    }
  };

  return (
    <div className="panel" style={{ width: '100%', marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div className="panel-head" style={{ borderBottom: '2px solid #f1f3f9', paddingBottom: '15px', marginBottom: '20px' }}>
        <div className="panel-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
          🔒 Vendor Verification Console <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'normal' }}>(Pending Moderation)</span>
        </div>
      </div>

      {loading ? (
        <p style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Syncing with database pipeline...</p>
      ) : error ? (
        <p style={{ padding: '20px', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>{error}</p>
      ) : vendors.length === 0 ? (
        <p style={{ padding: '20px', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>✓ All pending vendor verification queues cleared!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {vendors.map((v) => (
            <div key={v._id} className="vendor-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{v.name || v.businessName || "Event Ease Partner"}</div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>{v.email}</div>
                <div style={{ marginTop: '5px' }}>
                  <span style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', marginRight: '5px' }}>{v.businessType || v.category || "Vendor Service"}</span>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>📍 {v.city || "Pakistan"}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => updateStatus(v._id, 'approved')}
                  style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => updateStatus(v._id, 'rejected')}
                  style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}