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

  const [profile, setProfile] = useState({
    businessName: "",
    category: "",
    phone: "",
    city: "",
    address: "",
    description: "",
    images: [],
    videos: [],
  });

  // 1. Fetch Dynamic Vendor Data
  const fetchVendorProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Dynamic route if ID present, otherwise Auth Profile
      const endpoint = id && id !== "1" ? `/api/vendors/${id}` : "/api/vendors/profile";
      const res = await API.get(endpoint);
      const data = res.data?.vendor || res.data?.data || res.data;

      if (data) {
        setProfile({
          businessName: data.businessName || data.name || "",
          category: data.category || data.businessType || "",
          phone: data.phone || data.contact || "",
          city: data.location?.city || data.city || "",
          address: data.location?.address || data.address || "",
          description: data.description || "",
          images: Array.isArray(data.images) ? data.images : [],
          videos: Array.isArray(data.videos) ? data.videos : [],
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVendorProfile();
  }, [fetchVendorProfile]);

  // 2. Handle Text Form Changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 3. Save / Update Vendor Data to Backend Database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        businessName: profile.businessName,
        category: profile.category,
        phone: profile.phone,
        city: profile.city,
        address: profile.address,
        description: profile.description,
      };

      const res = await API.put("/api/vendors/profile", payload);
      if (res.data) {
        toast.success("Profile updated successfully in backend!");
        setIsEditing(false);
        fetchVendorProfile();
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // 4. Cloudinary Media Upload Handler
  const handleMediaUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === "image" && profile.images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed.");
      return;
    }
    if (type === "video" && profile.videos.length + files.length > 3) {
      toast.error("Maximum 3 videos allowed.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));

    setUploading(true);
    try {
      const res = await API.post(`/api/vendors/upload-${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        toast.success(`${type === "image" ? "Images" : "Videos"} uploaded!`);
        fetchVendorProfile();
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Media upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#fff" }}>Loading Profile...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "24px", background: "#181410", borderRadius: "10px", color: "#fff", border: "1px solid #b4945a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#b4945a" }}>Vendor Workspace Profile</h2>
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
        /* EDIT FORM MODE */
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
              <label>City / Location:</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
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
            {saving ? "Saving to Database..." : "Save Backend Profile"}
          </button>
        </form>
      ) : (
        /* READ-ONLY / VIEW MODE */
        <div>
          <h3 style={{ fontSize: "22px", color: "#fff" }}>{profile.businessName || "No Business Name Set"}</h3>
          <p><strong>Category:</strong> {profile.category || "N/A"}</p>
          <p><strong>Location:</strong> {profile.address ? `${profile.address}, ${profile.city}` : profile.city || "N/A"}</p>
          <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
          <p><strong>Description:</strong> {profile.description || "No description provided."}</p>
        </div>
      )}

      <hr style={{ margin: "25px 0", borderColor: "#333" }} />

      {/* PORTFOLIO SECTION */}
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
            <img key={idx} src={imgUrl} alt="Portfolio" style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "6px" }} />
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
            <video key={idx} src={vidUrl} controls style={{ width: "180px", height: "110px", borderRadius: "6px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}