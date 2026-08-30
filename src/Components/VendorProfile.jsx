import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";

export default function VendorProfile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  const [profile, setProfile] = useState({
    businessName: "",
    category: "",
    phone: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    profileImage: "",
    images: [],
    videos: [],
  });

  // 1. Fetch Dynamic Vendor Data (GET /api/vendors/:id)
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
        
        if (data.isVerified !== undefined) {
          setIsVerified(data.isVerified);
        }

        const catName = typeof data.category === 'object' 
          ? (data.category?.name || data.category?.title || "") 
          : (data.category || data.businessType || "");

        setProfile({
          businessName: data.businessName || data.name || "",
          category: catName,
          phone: data.phone || data.contact || "",
          city: data.location?.city || data.city || "",
          address: data.location?.address || data.address || "",
          latitude: data.location?.coordinates?.[1] ?? data.location?.latitude ?? data.latitude ?? "",
          longitude: data.location?.coordinates?.[0] ?? data.location?.longitude ?? data.longitude ?? "",
          description: data.description || "",
          profileImage: data.profileImage || data.avatar || "",
          images: Array.isArray(data.portfolioImages) ? data.portfolioImages : (Array.isArray(data.images) ? data.images : []),
          videos: Array.isArray(data.portfolioVideos) ? data.portfolioVideos : (Array.isArray(data.videos) ? data.videos : []),
        });

        if (data.businessName) {
          localStorage.setItem("vendorName", data.businessName);
        }
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      try {
        const fallbackRes = await API.get('/vendors/me');
        const fallbackData = fallbackRes.data?.vendor || fallbackRes.data;
        if (fallbackData) {
          if (fallbackData._id) setVendorId(fallbackData._id);
          if (fallbackData.isVerified !== undefined) {
            setIsVerified(fallbackData.isVerified);
          }

          setProfile({
            businessName: fallbackData.businessName || "",
            category: typeof fallbackData.category === 'object' ? fallbackData.category?.name : fallbackData.category,
            phone: fallbackData.phone || "",
            city: fallbackData.location?.city || fallbackData.city || "",
            address: fallbackData.location?.address || fallbackData.address || "",
            latitude: fallbackData.location?.latitude ?? fallbackData.latitude ?? "",
            longitude: fallbackData.location?.longitude ?? fallbackData.longitude ?? "",
            description: fallbackData.description || "",
            profileImage: fallbackData.profileImage || fallbackData.avatar || "",
            images: fallbackData.portfolioImages || fallbackData.images || [],
            videos: fallbackData.portfolioVideos || fallbackData.videos || [],
          });
        }
      } catch (fallbackErr) {
        console.error("Fallback Profile Error:", fallbackErr);
        toast.error("Failed to load profile data.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendorProfile();
  }, [fetchVendorProfile]);

  // 2. Handle Text Form Changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 3. Auto Fetch Latitude & Longitude based on City name using OpenStreetMap Nominatim API
  const handleCityChange = async (e) => {
    const newCity = e.target.value;
    setProfile((prev) => ({ ...prev, city: newCity }));

    if (newCity.trim().length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newCity)}`
        );
        const geoData = await response.json();

        if (geoData && geoData.length > 0) {
          setProfile((prev) => ({
            ...prev,
            latitude: parseFloat(geoData[0].lat),
            longitude: parseFloat(geoData[0].lon),
          }));
        }
      } catch (err) {
        console.error("City geocoding error:", err);
      }
    }
  };

  // 4. Auto-get current location coordinates from Browser Geolocation API
  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfile((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          toast.success("Location coordinates fetched successfully!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Could not fetch current location. Please type manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  // 5. Save Profile & Update Location Coordinates (PUT /api/vendors/profile & PUT /api/vendors/update-location)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const profilePayload = {
        businessName: profile.businessName,
        phone: profile.phone,
        description: profile.description,
      };

      const latVal = profile.latitude !== "" && profile.latitude !== undefined && profile.latitude !== null
        ? parseFloat(profile.latitude)
        : 0;

      const lngVal = profile.longitude !== "" && profile.longitude !== undefined && profile.longitude !== null
        ? parseFloat(profile.longitude)
        : 0;

      const locationPayload = {
        city: profile.city || "Default",
        address: profile.address || "Default Address",
        latitude: latVal,
        longitude: lngVal,
        coordinates: [lngVal, latVal]
      };

      await Promise.all([
        API.put("/vendors/profile", profilePayload),
        API.put("/vendors/update-location", locationPayload)
      ]);

      toast.success("Profile and Location updated successfully!");
      setIsEditing(false);
      fetchVendorProfile();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile or location.");
    } finally {
      setSaving(false);
    }
  };

  // 6. Single Profile Picture Upload (PUT /api/vendors/profile/upload-image)
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingAvatar(true);
    try {
      const res = await API.put("/vendors/profile/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data) {
        toast.success("Profile picture updated successfully!");
        fetchVendorProfile();
      }
    } catch (err) {
      console.error("Profile image upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload profile picture.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  // 7. Cloudinary Portfolio Media Upload Handler (POST /api/vendors/:vendorId/portfolio)
  const handleMediaUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (!vendorId) {
      toast.error("Vendor profile ID not found. Please refresh.");
      return;
    }

    if (type === "image" && profile.images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed in portfolio.");
      return;
    }
    if (type === "video" && profile.videos.length + files.length > 3) {
      toast.error("Maximum 3 videos allowed in portfolio.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));

    setUploading(true);
    try {
      const res = await API.post(`/vendors/${vendorId}/portfolio`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        toast.success(`${type === "image" ? "Images" : "Videos"} uploaded successfully!`);
        fetchVendorProfile();
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Media upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // 8. Delete Portfolio Media Handler
  const handleDeleteMedia = async (mediaUrl, type) => {
    if (!vendorId) return;

    try {
      const res = await API.delete(`/vendors/${vendorId}/portfolio`, {
        data: { mediaUrl, type }
      });

      if (res.data && res.data.success) {
        toast.success(`${type === "image" ? "Image" : "Video"} deleted successfully!`);
        fetchVendorProfile();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete media.");
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#fff" }}>Loading Profile...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "24px", background: "#181410", borderRadius: "10px", color: "#fff", border: "1px solid #b4945a" }}>
      
      {/* Pending Admin Approval Banner */}
      {!isVerified && !id && (
        <div style={{ 
          background: "rgba(255, 193, 7, 0.15)", 
          border: "1px solid #ffc107", 
          color: "#ffc107", 
          padding: "12px 16px", 
          borderRadius: "6px", 
          marginBottom: "20px", 
          fontSize: "14px"
        }}>
          ⚠️ <strong>Account Pending Approval:</strong> Your profile is currently under review by our admin team. It will be visible on the services listing page once approved.
        </div>
      )}

      {/* Header & Avatar Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ position: "relative" }}>
            <img 
              src={profile.profileImage || "https://via.placeholder.com/80?text=Vendor"} 
              alt="Vendor Avatar" 
              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #b4945a" }} 
            />
            {!id && (
              <label style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#b4945a",
                color: "#000",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold"
              }} title="Upload Profile Picture">
                ✎
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfileImageUpload} 
                  disabled={uploadingAvatar}
                  style={{ display: "none" }} 
                />
              </label>
            )}
          </div>
          <h2 style={{ color: "#b4945a", margin: 0 }}>Vendor Workspace Profile</h2>
        </div>

        {!id && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{ background: "#b4945a", color: "#000", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label>Business Name:</label>
            <input
              type="text"
              name="businessName"
              value={profile.businessName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px" }}
              required
            />
          </div>

          <div>
            <label>Category / Field:</label>
            <input
              type="text"
              name="category"
              value={profile.category}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px" }}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>City / Location (Auto-detects coords):</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleCityChange}
                placeholder="e.g. Lahore"
                style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px" }}
              />
            </div>
          </div>

          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px" }}
            />
          </div>

          {/* Map Coordinates Section */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Coordinates (Latitude & Longitude):</label>
              <button 
                type="button" 
                onClick={handleGetLocation} 
                style={{ background: "#b4945a", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", color: "#000", fontWeight: "bold" }}
              >
                📍 Get Live GPS
              </button>
            </div>
            <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={profile.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 31.5204"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={profile.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 74.3587"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                />
              </div>
            </div>
          </div>

          <div>
            <label>Description:</label>
            <textarea
              name="description"
              rows="4"
              value={profile.description}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px" }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ background: "#28a745", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            {saving ? "Saving to Database..." : "Save Backend Profile & Location"}
          </button>
        </form>
      ) : (
        <div>
          <h3 style={{ fontSize: "22px", color: "#fff" }}>{profile.businessName || "No Business Name Set"}</h3>
          <p><strong>Category:</strong> {profile.category || "N/A"}</p>
          <p><strong>Location:</strong> {profile.address ? `${profile.address}, ${profile.city}` : profile.city || "N/A"}</p>
          {(profile.latitude || profile.longitude) && (
            <p><strong>Coordinates:</strong> Lat: {profile.latitude || "0"}, Long: {profile.longitude || "0"}</p>
          )}
          <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
          <p><strong>Description:</strong> {profile.description || "No description provided."}</p>
        </div>
      )}

      <hr style={{ margin: "25px 0", borderColor: "#333" }} />

      <h3 style={{ color: "#b4945a" }}>Media Portfolio Workspace</h3>

      <div style={{ marginBottom: "20px" }}>
        <h4>Images ({profile.images.length}/5)</h4>
        {!id && (
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading || profile.images.length >= 5}
            onChange={(e) => handleMediaUpload(e, "image")}
          />
        )}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          {profile.images.map((imgUrl, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img src={imgUrl} alt="Portfolio" style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "6px" }} />
              {!id && (
                <button
                  type="button"
                  onClick={() => handleDeleteMedia(imgUrl, "image")}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    lineHeight: "1"
                  }}
                  title="Delete Image"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4>Videos ({profile.videos.length}/3)</h4>
        {!id && (
          <input
            type="file"
            accept="video/*"
            multiple
            disabled={uploading || profile.videos.length >= 3}
            onChange={(e) => handleMediaUpload(e, "video")}
          />
        )}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          {profile.videos.map((vidUrl, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <video src={vidUrl} controls style={{ width: "180px", height: "110px", borderRadius: "6px" }} />
              {!id && (
                <button
                  type="button"
                  onClick={() => handleDeleteMedia(vidUrl, "video")}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    lineHeight: "1"
                  }}
                  title="Delete Video"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}