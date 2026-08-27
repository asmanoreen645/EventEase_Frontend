import { useState, useEffect } from 'react';
import API from './api/axiosConfig';
import { useAuth } from './Components/AuthContext';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || user.profilePicture || ''
      });
      setPreview(user.profileImage || user.profilePicture || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadProfileImage = async (file) => {
    const data = new FormData();
    data.append('profilePicture', file);

    const userId = user._id || user.id;
    const res = await API.put(
      `/vendors/profile/upload-image/${userId}`,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return res.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let imageUrl = formData.profileImage;

      if (imageFile && user?.role?.toLowerCase() === 'vendor') {
        imageUrl = await uploadProfileImage(imageFile);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage: imageUrl
      };

      // Endpoint updated: /auth/profile
      const res = await API.put('/auth/profile', payload);

      if (res.data.success || res.data.user) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        updateUser(res.data.user || res.data.data || payload);
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
          {user?.role?.toLowerCase() === 'vendor' && (
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