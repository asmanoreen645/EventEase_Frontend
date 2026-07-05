import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './VendorRegistrationform.css';
import axiosInstance from "./api/axiosConfig";

const VendorRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    city: "",
    address: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.businessName || !formData.city || !formData.address) {
      setError("Please fill all required fields.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please login first to submit vendor form.");
      return;
    }

    // Creating FormData pipeline with exact separate attributes matching relational schema
    const data = new FormData();
    data.append("user", userId);
    data.append("businessName", formData.businessName);
    data.append("description", formData.description);
    data.append("city", formData.city);
    data.append("address", formData.address);
    
    files.forEach((file) => data.append("documents", file));

    try {
      setLoading(true);
      
      // Axios request directed with absolute /api endpoint prefix matching node instance
      await axiosInstance.post("/api/vendors/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setSuccess("Registration submitted successfully! Redirecting...");
      localStorage.setItem('vendorRegistered', 'true');

      // Secured state transition hook to clear storage flags safely after component switches
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Internal Configuration Error. Please verify connection parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-register-container">
      <div className="vendor-register-card">
        <h2>Become a Vendor on EventEase</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Business Name:</label>
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} />

          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />

          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />

          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} />

          <label>Documents (CNIC / Business Proof, max 5)</label>
          <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} />
          {files.length > 0 && (
            <ul className="file-list">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>  
    </div>
  );
};

export default VendorRegister;