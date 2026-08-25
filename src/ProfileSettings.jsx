import { useState, useEffect } from 'react';
import axios from './api/axiosConfig';
import { useAuth } from './Components/AuthContext';
import './ProfileSettings.css';

const ProfileSettings = () => {
  // AuthContext se current logged-in user ka data aur update function
  const { user, updateUser } = useAuth();

  // Form ke input fields ki state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: ''
  });

  const [imageFile, setImageFile] = useState(null);   // nayi select ki hui image file
  const [preview, setPreview] = useState('');          // image preview URL
  const [loading, setLoading] = useState(false);       // save button ki loading state
  const [message, setMessage] = useState({ type: '', text: '' }); // success/error message

  // Page load hote hi form ko current user ki details se bhar do
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || ''
      });
      setPreview(user.profileImage || '');
    }
  }, [user]);

  // Text input change hone par formData update karo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Nayi image select hone par preview dikhao (upload abhi nahi hoti)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Image upload - filhal sirf vendor ke liye backend route available hai
  const uploadProfileImage = async (file) => {
    const data = new FormData();
    data.append('profilePicture', file); // Ayesha ne yehi key name confirm kiya hai

    const res = await axios.put(
      `/api/vendors/profile/upload-image/${user.id}`,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return res.data.imageUrl; // backend response mein yehi field aata hai
  };

  // Form submit hone par backend ko update bhejo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let imageUrl = formData.profileImage;

      // Sirf vendor ke liye image upload chalega (customer ke paas box hi nahi hai)
      if (imageFile && user.role === 'vendor') {
        imageUrl = await uploadProfileImage(imageFile);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage: imageUrl
      };

      // Baaki fields (name/email/phone) is API se save hoti hain - customer aur vendor dono ke liye
      const res = await axios.put('/api/auth/profile/update', payload);

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        updateUser(res.data.data); // Navbar/AuthContext turant refresh ho jayega
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ee-profile-page">
      <div className="ee-profile-card">
        <h2 className="ee-profile-title">Profile Settings</h2>

        {message.text && (
          <div className={`ee-profile-message ${message.type === 'success' ? 'ee-msg-success' : 'ee-msg-error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="ee-profile-form">
          {/* Profile picture upload - sirf vendor ko dikhega */}
          {user?.role === 'vendor' && (
            <div className="ee-profile-avatar-wrap">
              <label className="ee-profile-avatar-label">
                <img
                  src={preview || '/default-avatar.png'}
                  alt="Profile"
                  className="ee-profile-avatar-img"
                />
                <span className="ee-profile-avatar-overlay">Change</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="ee-hidden-input" />
              </label>
            </div>
          )}

          <div className="ee-profile-field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ee-profile-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ee-profile-field">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="ee-profile-save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;