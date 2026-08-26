import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";

export default function VendorProfile() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Dynamic Fetcher: Supports both URL Route Parameter (/vendors/:id) and Auth Profile
  const fetchVendorProfile = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = id ? `/api/vendors/${id}` : "/api/vendors/profile";
      const res = await API.get(endpoint);
      
      const vendorData = res.data?.vendor || res.data?.data || res.data;
      if (vendorData) {
        setProfile({
          businessName: vendorData.businessName || vendorData.name || "",
          businessType: vendorData.businessType || vendorData.category || "",
          phone: vendorData.phone || vendorData.contact || "",
          city: vendorData.location?.city || vendorData.city || "",
          address: vendorData.location?.address || vendorData.address || "",
          description: vendorData.description || "",
          images: Array.isArray(vendorData.images) ? vendorData.images : [],
          videos: Array.isArray(vendorData.videos) ? vendorData.videos : [],
        });
      }
    } catch (err) {
      console.error("Error fetching vendor profile:", err);
      toast.error("Failed to load vendor profile data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVendorProfile();
  }, [fetchVendorProfile]);

  // Cloudinary Media Upload Handler (Only active in workspace mode)
  const handleMediaUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === "image" && profile.images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed.");
      e.target.value = "";
      return;
    }
    if (type === "video" && profile.videos.length + files.length > 3) {
      toast.error("Maximum 3 videos allowed.");
      e.target.value = "";
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

  if (loading) {
    return <div style={{ padding: "40px", color: "#fff", textAlign: "center" }}>Loading Profile...</div>;
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "24px", background: "#1a1209", borderRadius: "8px", color: "#fff", border: "1px solid #b4945a" }}>
      <h2 style={{ color: "#b4945a", marginBottom: "20px" }}>Vendor Profile</h2>
      
      {/* Profile Details */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "24px", color: "#fff" }}>{profile.businessName || "Vendor Business Name"}</h3>
        <p><strong>Category:</strong> {profile.businessType || "N/A"}</p>
        <p><strong>Location:</strong> {profile.address ? `${profile.address}, ${profile.city}` : profile.city || "N/A"}</p>
        <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
        <p><strong>Description:</strong> {profile.description || "No description provided."}</p>
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#333" }} />

      {/* Media Portfolio */}
      <h3 style={{ color: "#b4945a" }}>Media Portfolio</h3>

      {/* Image Gallery & Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Images ({profile.images.length}/5)</h4>
        {!id && (
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading || profile.images.length >= 5}
            onChange={(e) => handleMediaUpload(e, "image")}
            style={{ marginBottom: "10px" }}
          />
        )}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          {profile.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Portfolio ${idx}`}
              style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #444" }}
            />
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Videos ({profile.videos.length}/3)</h4>
        {!id && (
          <input
            type="file"
            accept="video/*"
            multiple
            disabled={uploading || profile.videos.length >= 3}
            onChange={(e) => handleMediaUpload(e, "video")}
            style={{ marginBottom: "10px" }}
          />
        )}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          {profile.videos.map((vidUrl, idx) => (
            <video
              key={idx}
              src={vidUrl}
              controls
              style={{ width: "200px", height: "120px", borderRadius: "8px", border: "1px solid #444" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}