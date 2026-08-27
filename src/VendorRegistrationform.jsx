import { useState } from 'react';
import toast from 'react-hot-toast';
import API from './api/axiosConfig';
import { useAuth } from './Components/AuthContext';
import { useNavigate } from 'react-router-dom';
import './VendorRegistrationform.css';

const VendorRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: user?.name || '',
    businessType: 'Decorator', 
    phone: '',
    city: 'Mandi Bahauddin',
    address: '',
    description: '',
  });

  const [documents, setDocuments] = useState({
    cnicFront: null,
    businessLicense: null,
  });

  const [docErrors, setDocErrors] = useState({
    cnicFront: '',
    businessLicense: '',
  });

  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      const typeError = 'Only JPG, PNG, and PDF formats are allowed!';
      setDocErrors((prev) => ({ ...prev, [docType]: typeError }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      toast.error(typeError);
      e.target.value = '';
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      const sizeError = `File size (${fileSizeMB.toFixed(1)}MB) exceeds 5MB!`;
      setDocErrors((prev) => ({ ...prev, [docType]: sizeError }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      toast.error(sizeError);
      e.target.value = '';
      return;
    }

    setDocErrors((prev) => ({ ...prev, [docType]: '' }));
    setDocuments((prev) => ({ ...prev, [docType]: file }));
    toast.success(`${file.name} selected!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.city) {
      toast.error("Please fill in required fields!");
      return;
    }

    setLoading(true);
    try {
      // Real FormData Object for Multipart Upload
      const data = new FormData();
      data.append("userId", user?._id || "64b0f1a2c3d4e5f6a7b8c9d0");
      data.append("businessName", formData.businessName);
      data.append("businessType", formData.businessType);
      data.append("phone", formData.phone);
      data.append("city", formData.city);
      data.append("address", formData.address);
      data.append("description", formData.description);

      // Real Files Append
      if (documents.cnicFront) {
        data.append("files", documents.cnicFront);
      }
      if (documents.businessLicense) {
        data.append("files", documents.businessLicense);
      }

      const res = await API.post('/api/vendors/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success || res.status === 200 || res.status === 201) {
        localStorage.setItem('vendorRegistered', 'true');
        toast.success(res.data.message || "Vendor registered! Pending admin verification.");
        navigate('/vendor-dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-register-container">
      <div className="vendor-register-card">
        <h2>Vendor Registration</h2>
        <p>Complete your business profile and documents to start listing.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>BUSINESS / BRAND NAME *</label>
            <input 
              type="text" 
              name="businessName"
              placeholder="e.g. Royal Decorators"
              value={formData.businessName}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div>
            <label>BUSINESS CATEGORY *</label>
            <select 
              name="businessType" 
              value={formData.businessType} 
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #e2d9cd',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#faf8f5',
                boxSizing: 'border-box'
              }}
            >
              <option value="Decorator">Decorator</option>
              <option value="Photographer">Photographer</option>
              <option value="Catering">Catering / Food</option>
              <option value="Venue">Venue / Hall</option>
              <option value="Musician">DJ & Music</option>
            </select>
          </div>

          <div>
            <label>PHONE NUMBER</label>
            <input 
              type="text" 
              name="phone"
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>CITY *</label>
            <input 
              type="text" 
              name="city"
              placeholder="e.g. Mandi Bahauddin, Lahore"
              value={formData.city}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div>
            <label>ADDRESS</label>
            <input 
              type="text" 
              name="address"
              placeholder="Full shop / office address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>BUSINESS DESCRIPTION</label>
            <textarea 
              name="description"
              placeholder="Tell customers about your services..."
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div>
            <label>CNIC / ID CARD (MAX 5MB - JPG, PNG, PDF)</label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, 'cnicFront')}
            />
            {docErrors.cnicFront && <p className="error-msg">{docErrors.cnicFront}</p>}
          </div>

          <div>
            <label>BUSINESS LICENSE / DOCUMENT (MAX 5MB - JPG, PNG, PDF)</label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, 'businessLicense')}
            />
            {docErrors.businessLicense && <p className="error-msg">{docErrors.businessLicense}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Complete Vendor Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;