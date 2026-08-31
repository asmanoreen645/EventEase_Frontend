import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api/axiosConfig";
import "./ChatPage.css"; 

// 📦 React Icons 
import { 
  MdStar, 
  MdLocationOn, 
  MdPhone, 
  MdEmail, 
  MdChat, 
  MdEventNote 
} from "react-icons/md";

export default function VendorProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vendor ki details fetch karne ke liye
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        // Correct API call for fetching single vendor profile
        const res = await API.get(`/vendors/${id}`);
        setVendor(res.data.vendor || res.data.data || res.data);
      } catch (err) {
        console.error("Vendor details fetch error:", err);
        setError("Vendor ki details load karne mein masla aaya hai.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  // "Chat with Vendor" button ka function 
  const handleChatWithVendor = async () => {
    try {
      const vendorId = vendor?._id || id;
      
      // ✅ CORRECTED API ENDPOINT 
      await API.post("/chat/conversation", { vendorId });

      // Chat page par redirect karein
      navigate(`/chat/${vendorId}`);
    } catch (err) {
      console.error("Chat conversation start karne mein error:", err);
      // Agar conversation pehle se bani hui hai tab bhi chat page par bhej dein
      navigate(`/chat/${vendor?._id || id}`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        Loading vendor profile...
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "red" }}>
        {error || "Vendor nahi mila."}
      </div>
    );
  }

  return (
    <div className="vendor-profile-page" style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <div className="vendor-header" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <img
          src={vendor.profileImage || vendor.coverImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(vendor.businessName || "Vendor")}
          alt={vendor.businessName}
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <h2>{vendor.businessName || "Unnamed Vendor"}</h2>
          <p style={{ color: "#6b7280", textTransform: "capitalize" }}>{vendor.category || "Service Provider"}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#f59e0b" }}>
            <MdStar size={18} />
            <span>{vendor.rating || "4.8"} Rating</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MdPhone color="#4b5563" /> {vendor.phone || "092 3XXX XXXXX"}
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MdEmail color="#4b5563" /> {vendor.email || "contact@eventease.com"}
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MdLocationOn color="#4b5563" /> {vendor.location?.city || "Mandi Bahauddin"}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
        <button
          onClick={handleChatWithVendor}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          <MdChat size={18} color="#2563eb" /> Chat with Vendor
        </button>

        <button
          onClick={() => navigate(`/book/${vendor._id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#d97706",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          <MdEventNote size={18} color="#fff" /> Book Now
        </button>
      </div>
    </div>
  );
}