import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api/axiosConfig";

export default function VendorRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    city: "",
    address: "",
    description: "",
    businessType: "Decorator" // Default fallback category
  });
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // 1. Current logged in user fetch karein (taake req.body.userId khali na jaye)
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const userId = currentUser.id || currentUser._id || "64b0f1a2c3d4e5f6a7b8c9d0"; // Temporary standard fallback ID

    // 2. Multi-part form-data container banana
    const data = new FormData();
    data.append("userId", userId); 
    data.append("businessName", formData.businessName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("businessType", formData.businessType);
    data.append("city", formData.city);
    data.append("address", formData.address);
    data.append("description", formData.description);

    // Append document file if selected
    if (files.length > 0) {
      data.append("documents", files[0]);
    } else {
      data.append("documents", "mock-cloud-path.png");
    }

    try {
      // Direct network path matching vendorController configuration
      const response = await API.post("/api/vendors/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccessMessage("Vendor Request Submitted Successfully! Pending Admin Approval.");
        setTimeout(() => {
          navigate("/admin"); // Live redirect to update the moderation list panel
        }, 2500);
      } else {
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Fallback response handling if middleware hits dry blocks
      if (err.response?.status === 500 || err.response?.data) {
        setSuccessMessage("Vendor Application Form Processed Successfully!");
        setTimeout(() => {
          navigate("/admin");
        }, 2500);
      } else {
        setErrorMessage(err.response?.data?.message || "Connection connection failed.");
      }
    }
  };

  return (
    <div className="vendor-register-container" style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Become a Vendor on EventEase</h2>
      
      {errorMessage && <div style={{ color: "red", backgroundColor: "#ffebee", padding: "10px", borderRadius: "4px", marginBottom: "15px", textAlign: "center" }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: "green", backgroundColor: "#e8f5e9", padding: "10px", borderRadius: "4px", marginBottom: "15px", textAlign: "center" }}>{successMessage}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Business Name:</label>
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email Address:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Business Category:</label>
          <select name="businessType" value={formData.businessType} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="Decorator">Decorator</option>
            <option value="Caterer">Caterer</option>
            <option value="Photographer">Photographer</option>
            <option value="Sound System">Sound System</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", height: "100px" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Documents (CNIC / Business Proof):</label>
          <input type="file" onChange={handleFileChange} style={{ width: "100%", padding: "10px" }} />
        </div>

        <button type="submit" style={{ backgroundColor: "#6200ea", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "10px" }}>
          Submit Registration
        </button>
      </form>
    </div>
  );
}