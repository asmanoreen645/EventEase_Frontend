import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";
import { useBooking } from "./BookingContext";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "./VendorProfile.css";

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.4/images/marker-shadow.png',
});

function LocationPicker({ setProfile }) {
  useMapEvents({
    click(e) {
      setProfile((prev) => ({
        ...prev,
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }));
    },
  });
  return null;
}

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setVendor } = useBooking();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [, setUploadingAvatar] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [, setIsVerified] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reviews, setReviews] = useState([]);

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
    rating: 4.8,
    lat: 31.5204,
    lng: 74.3587
  });

  const safeExtract = (val, fallback = "") => {
    if (!val) return fallback;
    if (typeof val === 'object') {
      return val.name || val.title || val.city || fallback;
    }
    return String(val);
  };

  const fetchVendorReviews = useCallback(async (vId) => {
    if (!vId) return;
    try {
      const res = await API.get(`/reviews/vendor/${vId}`);
      const reviewList = res.data?.data || res.data?.reviews || [];
      setReviews(reviewList);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  }, []);

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
        const resolvedVendorId = data._id || id;
        if (resolvedVendorId) {
          setVendorId(resolvedVendorId);
          fetchVendorReviews(resolvedVendorId);
        }

        if (data.isVerified !== undefined) setIsVerified(data.isVerified);

        if (activeUserId && (data.user === activeUserId || data.userId === activeUserId || data._id === activeUserId)) {
          setIsOwner(true);
        }

        const catName = safeExtract(data.category) || safeExtract(data.businessType);
        const cityName = safeExtract(data.location?.city) || safeExtract(data.city);
        
        const coords = data.location?.coordinates;
        const vendorLat = coords ? coords[1] : (data.lat || 31.5204);
        const vendorLng = coords ? coords[0] : (data.lng || 74.3587);

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
          rating: data.rating || 4.8,
          lat: vendorLat,
          lng: vendorLng
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, [id, fetchVendorReviews]);

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

  const handleSaveLocation = async () => {
    try {
      await API.put("/vendors/update-location", {
        latitude: profile.lat,
        longitude: profile.lng
      });
      toast.success("Map location updated successfully!");
    } catch (err) {
      console.error("Location update error:", err);
      toast.error("Failed to update location.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px", color: "#666" }}>Loading Profile...</div>;

  return (
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
                   ★ {profile.rating} Rating ({reviews.length} Reviews)
                </span>
              </div>
              <p style={{ color: "#b4945a", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "600" }}>{safeExtract(profile.category)}</p>
              
              <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "13px", color: "#666", flexWrap: "wrap" }}>
                <span> {profile.phone}</span>
                <span> {profile.email}</span>
                <span> {profile.address}, {profile.city}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button 
              onClick={() => navigate(`/chat/${vendorId || id}`)}
              style={{ background: "#fff", border: "1px solid #b4945a", color: "#b4945a", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
            >
              Chat with Vendor
            </button>
            
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

      {/* Edit Form */}
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

      {/* 1. PORTFOLIO & DESCRIPTION SECTION */}
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
          <div style={{ background: "#fff", marginTop: "20px", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#111" }}>About Services</h3>
            <p style={{ margin: 0, color: "#555", lineHeight: "1.6", fontSize: "13px" }}>{profile.description}</p>
          </div>
        )}
      </div>

      {/* 2. BALANCED CALENDAR & MAP SECTION (Same Height & Aligned) */}
      <div style={{ maxWidth: "1000px", margin: "30px auto 0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "stretch" }}>
          
          {/* Left Side: Stretched Calendar Box */}
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#111" }}>Check Availability & Dates</h3>
              <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
                <Calendar 
                  onChange={setSelectedDate} 
                  value={selectedDate} 
                  minDate={new Date()} 
                  style={{ width: "100%", border: "none", borderRadius: "6px" }}
                />
              </div>
            </div>
            
            <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666", textAlign: "center", borderTop: "1px solid #f1f3f5", paddingTop: "12px" }}>
              📅 Selected Date: <b>{selectedDate.toDateString()}</b>
            </p>
          </div>

          {/* Right Side: Matched Height & Wider Map Box */}
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#111" }}>Vendor Location</h3>
                {isEditing && (
                  <span style={{ fontSize: "11px", color: "#b4945a", fontWeight: "600" }}>
                    💡 Click map to pick location
                  </span>
                )}
              </div>
              
              {/* Map height matched to fill the box nicely */}
              <div style={{ height: "265px", borderRadius: "6px", overflow: "hidden", border: "1px solid #eaeaea", zIndex: 1 }}>
                <MapContainer 
                  center={[profile.lat, profile.lng]} 
                  zoom={13} 
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={[profile.lat, profile.lng]}>
                    <Popup>{profile.businessName || "Vendor Location"}</Popup>
                  </Marker>

                  {isEditing && <LocationPicker setProfile={setProfile} />}
                </MapContainer>
              </div>
            </div>

            <div>
              <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666" }}>
                📍 {profile.address}, {profile.city}
              </p>

              {isEditing && (
                <button 
                  onClick={handleSaveLocation}
                  style={{ marginTop: "10px", width: "100%", background: "#b4945a", color: "#000", border: "none", padding: "8px", borderRadius: "4px", fontWeight: "600", cursor: "pointer", fontSize: "12px" }}
                >
                  Save Map Location
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. REVIEWS & RATINGS SECTION */}
      <div style={{ maxWidth: "1000px", margin: "30px auto 0 auto", padding: "0 20px" }}>
        <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#111" }}>Customer Reviews & Ratings</h3>
          
          {reviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviews.map((rev) => (
                <div key={rev._id} style={{ background: "#f8f9fa", padding: "12px 15px", borderRadius: "6px", border: "1px solid #eaeaea" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img 
                        src={rev.customerId?.profileImage || "https://via.placeholder.com/30"} 
                        alt="Customer" 
                        style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} 
                      />
                      <span style={{ fontWeight: "600", fontSize: "13px", color: "#333" }}>
                        {rev.customerId?.name || "Customer"}
                      </span>
                    </div>
                    <span style={{ color: "#f39c12", fontSize: "13px", fontWeight: "bold" }}>
                      {"★".repeat(rev.rating || rev.stars)} {"☆".repeat(5 - (rev.rating || rev.stars))}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
                    {rev.comment || rev.review}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: "#777", fontSize: "13px" }}>No reviews yet for this vendor.</p>
          )}
        </div>
      </div>

    </div>
  );
}