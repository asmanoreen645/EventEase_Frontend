import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api/axiosConfig";[cite: 9]

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
    data.append("name", formData.businessName); // Mapping businessName to backend structure
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
        setSuccessMessage("Application submitted! Pending admin approval context.");
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
     // Aapka existing JSX code yahan form UI layout ke sath aayega
     // Bas input tags mein name="" attribute default backend state se match hona chahiye
     <div>Form UI Container Context</div>
  );
}