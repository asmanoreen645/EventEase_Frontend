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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [, setIsVerified] = useState(true);
  const [, setIsOwner] = useState(false);

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
    rating: 0,
    lat: 31.5204,
    lng: 74.3587
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

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
      const res = await API.get(`/reviews/vendor/${vId}`, { headers: getAuthHeader() })
        .catch(() => API.get(`/reviews/${vId}`, { headers: getAuthHeader() }))
        .catch(() => API.get(`/vendors/${vId}/reviews`, { headers: getAuthHeader() }));
      
      const reviewList = res.data?.data || res.data?.reviews || res.data || [];
      const validReviews = Array.isArray(reviewList) ? reviewList : [];
      setReviews(validReviews);

      if (validReviews.length > 0) {
        const totalRating = validReviews.reduce((acc, rev) => acc + (rev.rating || rev.stars || 0), 0);
        const avgRating = (totalRating / validReviews.length).toFixed(1);
        
        setProfile((prev) => ({
          ...prev,
          rating: Number(avgRating)
        }));
      }
    } catch (err) {
      console.error("Reviews load error:", err);
      setReviews([]);
    }
  }, []);

  const fetchVendorProfile = useCallback(async () => {
    setLoading(true);
    try {
      const activeUserId = localStorage.getItem("userId");
      const endpoint = id && id !== "1" 
        ? `/vendors/${id}` 
        : `/vendors/user/${activeUserId}`;
        
      const res = await API.get(endpoint, { headers: getAuthHeader() });
      const data = res.data?.vendor || res.data?.data || res.data;

      if (data) {
        const resolvedVendorId = data._id || id;
        if (resolvedVendorId) {
          setVendorId(resolvedVendorId);
          fetchVendorReviews(resolvedVendorId);
        }

        if (data.isVerified !== undefined) setIsVerified(data.isVerified);

        if (activeUserId && (data.user === activeUserId || data.userId === activeUserId || data.userId?._id === activeUserId || data._id === activeUserId)) {
          setIsOwner(true);
        } else {
          setIsOwner(true); // Default edit allowed in dashboard view
        }

        const catName = safeExtract(data.category) || safeExtract(data.businessType);
        const cityName = safeExtract(data.location?.city) || safeExtract(data.city);
        
        const coords = data.location?.coordinates;
        const vendorLat = coords ? coords[1] : (data.location?.latitude || data.lat || 31.5204);
        const vendorLng = coords ? coords[0] : (data.location?.longitude || data.lng || 74.3587);

        setProfile({
          businessName: data.businessName || data.name || "",
          category: catName,
          phone: data.phone || data.contact || "",
          email: data.email || data.userId?.email || "contact@eventease.com",
          city: cityName,
          address: data.location?.address || data.address || cityName || "",
          description: data.description || "",
          profileImage: data.profileImage || data.avatar || "https://via.placeholder.com/150",
          images: Array.isArray(data.portfolioImages) ? data.portfolioImages : (Array.isArray(data.images) ? data.images : []),
          videos: Array.isArray(data.portfolioVideos) ? data.portfolioVideos : (Array.isArray(data.videos) ? data.videos : []),
          rating: data.rating || 0,
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        vendorId,
        businessName: profile.businessName,
        phone: profile.phone,
        description: profile.description,
        city: profile.city,
        category: profile.category,
      };

      await API.put("/vendors/profile", profilePayload, {
        headers: getAuthHeader()
      });

      toast.success("Profile details updated!");
      setIsEditing(false);
      fetchVendorProfile();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    setUploadingAvatar(true);
    try {
      await API.put(`/vendors/profile/upload-image/${vendorId || 'me'}`, formData, {
        headers: { 
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data" 
        },
      });
      toast.success("Profile picture updated!");
      fetchVendorProfile();
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload profile picture.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.filter(f => f.type.startsWith('image/'));
    const newVideos = files.filter(f => f.type.startsWith('video/'));

    if (profile.images.length + newImages.length > 5) {
      toast.error(`Limit exceeded: Maximum 5 photos allowed. (Currently have ${profile.images.length})`);
      return;
    }

    if (profile.videos.length + newVideos.length > 3) {
      toast.error(`Limit exceeded: Maximum 3 videos allowed. (Currently have ${profile.videos.length})`);
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append("media", file);
    });

    setUploadingMedia(true);
    try {
      await API.post(`/vendors/${vendorId || 'me'}/portfolio`, formData, {
        headers: { 
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data" 
        },
      });
      toast.success("Portfolio media uploaded successfully!");
      fetchVendorProfile();
    } catch (err) {
      console.error("Portfolio upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload portfolio media.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaUrl, type) => {
    try {
      await API.delete(`/vendors/${vendorId || 'me'}/portfolio`, {
        headers: getAuthHeader(),
        data: { mediaUrl, type }
      });
      toast.success("Media deleted from portfolio.");
      fetchVendorProfile();
    } catch (err) {
      console.error("Delete media error:", err);
      toast.error("Failed to delete media.");
    }
  };

  const handleSaveLocation = async () => {
    try {
      await API.put("/vendors/update-location", {
        vendorId,
        latitude: profile.lat,
        longitude: profile.lng
      }, { headers: getAuthHeader() });
      toast.success("Map location updated successfully!");
    } catch (err) {
      console.error("Location update error:", err);
      toast.error("Failed to update location.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px", color: "#666" }}>Loading Profile...</div>;

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", paddingTop: "40px", paddingBottom: "60px", fontFamily: "sans-serif" }}>
      
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
              <label style={{ position: "absolute", bottom: 0, right: 0, background: "#b4945a", color: "#fff", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }} title="Change Profile Image">
                📷
                <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: "none" }} disabled={uploadingAvatar} />
              </label>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h1 style={{ margin: 0, fontSize: "26px", color: "#111" }}>{profile.businessName || "Vendor Name"}</h1>
                {profile.rating > 0 && (
                  <span style={{ background: "#f1f3f5", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                    ★ {profile.rating} Rating ({reviews.length} Reviews)
                  </span>
                )}
              </div>
              <p style={{ color: "#b4945a", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "600" }}>{safeExtract(profile.category)}</p>
              
              <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "13px", color: "#666", flexWrap: "wrap" }}>
                <span>{profile.phone}</span>
                <span>{profile.email}</span>
                <span>{profile.address}, {profile.city}</span>
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
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{ background: "#333", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
            >
              {isEditing ? "Close Edit" : "Edit Profile"}
            </button>
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

      {/* PORTFOLIO SECTION (MAX 5 PHOTOS & 3 VIDEOS) */}
      <div style={{ maxWidth: "1000px", margin: "30px auto 0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#111" }}>Our Portfolio</h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>Max 5 Photos ({profile.images.length}/5) & Max 3 Videos ({profile.videos.length}/3)</p>
          </div>

          <label style={{ background: "#28a745", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
            {uploadingMedia ? "Uploading Media..." : "+ Upload Portfolio Media"}
            <input 
              type="file" 
              accept="image/*,video/*" 
              multiple 
              onChange={handlePortfolioUpload} 
              style={{ display: "none" }} 
              disabled={uploadingMedia}
            />
          </label>
        </div>

        {/* Photos Grid */}
        <h3 style={{ fontSize: "16px", color: "#333", marginBottom: "10px" }}>Photos ({profile.images.length}/5)</h3>
        {profile.images.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {profile.images.map((imgSrc, index) => (
              <div key={index} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", height: "150px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "#fff" }}>
                <img src={imgSrc} alt="Portfolio Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button 
                  onClick={() => handleDeleteMedia(imgSrc, 'image')}
                  style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(220, 53, 69, 0.85)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontWeight: "bold" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", padding: "20px", textAlign: "center", borderRadius: "8px", border: "1px dashed #ccc", color: "#777", fontSize: "13px", marginBottom: "20px" }}>
            No portfolio images uploaded yet. Click "+ Upload Portfolio Media" above.
          </div>
        )}

        {/* Videos Grid */}
        <h3 style={{ fontSize: "16px", color: "#333", marginBottom: "10px" }}>Videos ({profile.videos.length}/3)</h3>
        {profile.videos.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            {profile.videos.map((vidSrc, index) => (
              <div key={index} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", height: "150px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "#000" }}>
                <video src={vidSrc} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button 
                  onClick={() => handleDeleteMedia(vidSrc, 'video')}
                  style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(220, 53, 69, 0.85)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontWeight: "bold", zIndex: 2 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", padding: "20px", textAlign: "center", borderRadius: "8px", border: "1px dashed #ccc", color: "#777", fontSize: "13px" }}>
            No portfolio videos uploaded yet.
          </div>
        )}

        {profile.description && (
          <div style={{ background: "#fff", marginTop: "20px", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#111" }}>About Services</h3>
            <p style={{ margin: 0, color: "#555", lineHeight: "1.6", fontSize: "13px" }}>{profile.description}</p>
          </div>
        )}
      </div>

      {/* CALENDAR & MAP SECTION */}
      <div style={{ maxWidth: "1000px", margin: "30px auto 0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "stretch" }}>
          
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

      {/* REVIEWS SECTION */}
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