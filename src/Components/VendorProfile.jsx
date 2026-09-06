import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";
import { useBooking } from "./BookingContext"; // <-- 1. BookingContext import kar liya hai
import "./VendorProfile.css";

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setVendor } = useBooking(); // <-- 2. setVendor hook initialize kiya hai

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const [profile, setProfile] = useState({
    businessName: "",
    category: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    description: "",
    profileImage: "",
    images: [],
    videos: [],
    rating: 4.8
  });

  const safeExtract = (val, fallback = "") => {
    if (!val) return fallback;
    if (typeof val === 'object') {
      return val.name || val.title || val.city || fallback;
    }
    return String(val);
  };

  const fetchVendorProfile = useCallback(async () => {
    setLoading(true);
    try {
      const activeUserId = localStorage.getItem("userId");
      const endpoint = id && id !== "1" 
        ? `/vendors/${id}` 
        : `/vendors/user/${activeUserId}`;
        
      const res = await API.get(endpoint);
      const data = res.data?.vendor || res.data?.data || res.data;

      if (data) {
        if (data._id) setVendorId(data._id);
        if (data.isVerified !== undefined) setIsVerified(data.isVerified);

        // Check if current logged-in user is the owner of this profile
        if (activeUserId && (data.user === activeUserId || data.userId === activeUserId || data._id === activeUserId)) {
          setIsOwner(true);
        }

        const catName = safeExtract(data.category) || safeExtract(data.businessType);
        const cityName = safeExtract(data.location?.city) || safeExtract(data.city);

        setProfile({
          businessName: data.businessName || data.name || "",
          category: catName,
          phone: data.phone || data.contact || "092 3XXX XXXXX",
          email: data.email || "contact@eventease.com",
          city: cityName,
          address: data.location?.address || data.address || cityName || "Pakistan",
          description: data.description || "Event decoration and stage setup.",
          profileImage: data.profileImage || data.avatar || "https://via.placeholder.com/150",
          images: Array.isArray(data.portfolioImages) ? data.portfolioImages : (Array.isArray(data.images) ? data.images : []),
          videos: Array.isArray(data.portfolioVideos) ? data.portfolioVideos : (Array.isArray(data.videos) ? data.videos : []),
          rating: data.rating || 4.8
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendorProfile();
  }, [fetchVendorProfile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const profilePayload = {
        businessName: profile.businessName,
        phone: profile.phone,
        description: profile.description,
        category: profile.category,
      };

      await API.put("/vendors/profile", profilePayload);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchVendorProfile();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    setUploadingAvatar(true);
    try {
      await API.put("/vendors/profile/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile picture updated!");
      fetchVendorProfile();
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px", color: "#666" }}>Loading Profile...</div>;

  return (
    /* paddingTop: "80px" ki wajah se ab content navbar ke neeche bilkul theek jagah se start hoga */
    <div style={{ background: "#f8f9fa", minHeight: "100vh", paddingTop: "80px", paddingBottom: "60px", fontFamily: "sans-serif" }}>
      
      {/* Top Banner & Header Card */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5", padding: "30px 20px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <div style={{ position: "relative" }}>
              <img 
                src={profile.profileImage} 
                alt="Vendor Avatar" 
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "3px solid #b4945a" }} 
              />
              {isEditing && (
                <label style={{ position: "absolute", bottom: 0, right: 0, background: "#b4945a", color: "#000", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "12px" }}>
                  ✎
                  <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: "none" }} />
                </label>
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h1 style={{ margin: 0, fontSize: "26px", color: "#111" }}>{profile.businessName || "Vendor Name"}</h1>
                <span style={{ background: "#f1f3f5", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                  ⭐ {profile.rating} Rating
                </span>
              </div>
              <p style={{ color: "#b4945a", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "600" }}>{safeExtract(profile.category)}</p>
              
              <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "13px", color: "#666", flexWrap: "wrap" }}>
                <span>📞 {profile.phone}</span>
                <span>✉️ {profile.email}</span>
                <span>📍 {profile.address}, {profile.city}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button 
              onClick={() => navigate(`/chat/${vendorId || id}`)}
              style={{ background: "#fff", border: "1px solid #b4945a", color: "#b4945a", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
            >
              Chat with Vendor
            </button>
            
            {/* 3. Book Now button updated to save vendor data before navigating */}
            <button 
              onClick={() => {
                setVendor({
                  id: vendorId || id,
                  name: profile.businessName,
                  category: profile.category,
                  image: profile.profileImage
                });
                navigate(`/book/${vendorId || id}`);
              }}
              style={{ background: "#b4945a", border: "none", color: "#000", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
            >
              Book Now
            </button>
            
            {/* Agar yeh vendor ki apni profile hai, toh Edit ka button show hoga */}
            {(isOwner || !id) && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{ background: "#333", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
              >
                {isEditing ? "Close Edit" : "Edit Profile"}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Edit Form (Shows only when Edit is clicked) */}
      {isEditing && (
        <div style={{ maxWidth: "1000px", margin: "20px auto", background: "#fff", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#b4945a", marginTop: 0, fontSize: "18px" }}>Edit Your Profile Details</h3>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: "600" }}>Business Name:</label>
                <input type="text" name="businessName" value={profile.businessName} onChange={handleChange} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: "600" }}>Category:</label>
                <input type="text" name="category" value={profile.category} onChange={handleChange} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }} required />
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: "600" }}>Phone:</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleChange} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: "600" }}>City:</label>
                <input type="text" name="city" value={profile.city} onChange={handleChange} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600" }}>Description:</label>
              <textarea name="description" rows="3" value={profile.description} onChange={handleChange} style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }}></textarea>
            </div>
            <button type="submit" disabled={saving} style={{ background: "#28a745", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {/* Portfolio Section */}
      <div style={{ maxWidth: "1000px", margin: "30px auto 0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "15px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#111" }}>Our Portfolio</h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>A showcase of cinematic excellence and timeless events</p>
          </div>
        </div>

        {profile.images.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            {profile.images.map((imgSrc, index) => (
              <div key={index} style={{ borderRadius: "10px", overflow: "hidden", height: "180px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "#fff" }}>
                <img src={imgSrc} alt="Portfolio" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", padding: "30px", textAlign: "center", borderRadius: "8px", border: "1px dashed #ccc", color: "#777", fontSize: "14px" }}>
            No portfolio images uploaded yet.
          </div>
        )}

        {profile.description && (
          <div style={{ background: "#fff", marginTop: "30px", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#111" }}>About Services</h3>
            <p style={{ margin: 0, color: "#555", lineHeight: "1.6", fontSize: "13px" }}>{profile.description}</p>
          </div>
        )}

      </div>
    </div>
  );
}