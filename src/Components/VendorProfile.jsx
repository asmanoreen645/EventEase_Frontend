import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";

export default function VendorProfile() {
  const [profile, setProfile] = useState({
    businessName: "",
    businessType: "",
    phone: "",
    city: "",
    address: "",
    description: "",
    images: [],
    videos: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1. Fetch Dynamic Vendor Profile from Database
  const fetchVendorProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/vendors/profile");
      if (res.data && res.data.success) {
        setProfile(res.data.vendor);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVendorProfile();
  }, []);

  // 2. Cloudinary Media Upload with Limits (Max 5 Images, Max 3 Videos)
  const handleMediaUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === "image") {
      if (profile.images.length + files.length > 5) {
        toast.error("Upload limit reached! Maximum 5 images allowed.");
        e.target.value = "";
        return;
      }
    } else if (type === "video") {
      if (profile.videos.length + files.length > 3) {
        toast.error("Upload limit reached! Maximum 3 videos allowed.");
        e.target.value = "";
        return;
      }
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));

    setUploading(true);
    try {
      const res = await API.post(`/api/vendors/upload-${type}`, formData, {
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

  if (loading) return <div style={{ padding: "20px" }}>Loading Vendor Profile...</div>;

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
      <h2>Vendor Profile Workspace</h2>
      
      {/* Dynamic Profile Info */}
      <div style={{ marginBottom: "20px" }}>
        <h3>{profile.businessName || "Vendor Business Name"}</h3>
        <p><strong>Category:</strong> {profile.businessType || "N/A"}</p>
        <p><strong>Location:</strong> {profile.address ? `${profile.address}, ${profile.city}` : profile.city || "N/A"}</p>
        <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
        <p><strong>Description:</strong> {profile.description || "No description provided."}</p>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* Cloudinary Portfolio Section */}
      <h3>Media Portfolio Workspace</h3>

      {/* Image Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Images ({profile.images.length}/5)</h4>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading || profile.images.length >= 5}
          onChange={(e) => handleMediaUpload(e, "image")}
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          {profile.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Portfolio ${idx}`}
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
            />
          ))}
        </div>
      </div>

      {/* Video Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Videos ({profile.videos.length}/3)</h4>
        <input
          type="file"
          accept="video/*"
          multiple
          disabled={uploading || profile.videos.length >= 3}
          onChange={(e) => handleMediaUpload(e, "video")}
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          {profile.videos.map((vidUrl, idx) => (
            <video
              key={idx}
              src={vidUrl}
              controls
              style={{ width: "180px", height: "100px", borderRadius: "8px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}