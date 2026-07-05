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
    description: ""
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

    // Create Multi-part Form Data Instance for Files
    const data = new FormData();
    data.append("name", formData.businessName); 
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", "vendor");
    data.append("city", formData.city);
    data.append("address", formData.address);
    data.append("description", formData.description);

    // Append multiple files if selected
    for (let i = 0; i < files.length; i++) {
      data.append("documents", files[i]);
    }

    try {
      const response = await API.post("/api/auth/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccessMessage("Application submitted! Pending admin approval.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Internal configuration connection error.");
    }
  };

  return (
    <div className="vendor-register-container" style={{ padding: "40px", maxWidth: "60px", margin: "0 auto" }}>
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
          <input type="file" multiple onChange={handleFileChange} required style={{ width: "100%", padding: "10px" }} />
        </div>

        <button type="submit" style={{ backgroundColor: "#6200ea", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "10px" }}>
          Submit Registration
        </button>
      </form>
    </div>
  );
}