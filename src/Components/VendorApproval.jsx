import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

export default function VendorApproval() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    API.get('/api/admin/vendors/pending').then(res => setVendors(res.data.vendors || []));
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/api/admin/vendors/${id}/status`, { status });
    setVendors(prev => prev.filter(v => v._id !== id));
    alert(`Vendor status updated to ${status}`);
  };

  return (
    <div className="panel" style={{ width: '100%', marginTop: '20px' }}>
      <div className="panel-head"><div className="panel-title">Vendor Verification Console</div></div>
      {vendors.length === 0 ? <p style={{ padding: '20px' }}>No pending vendor approval requests.</p> : 
        vendors.map((v) => (
          <div key={v._id} className="vendor-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
            <div><strong>{v.name}</strong> ({v.email})</div>
            <div>
              <button onClick={() => updateStatus(v._id, 'approved')} className="btn-mini btn-approve">✓ Accept</button>
              <button onClick={() => updateStatus(v._id, 'rejected')} className="btn-mini btn-reject">✕ Reject</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}