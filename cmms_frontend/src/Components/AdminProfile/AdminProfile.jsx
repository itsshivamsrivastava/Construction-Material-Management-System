import React, { useState, useRef } from 'react';
import './AdminProfileStyle.css';
import { FaUserEdit, FaCamera, FaSave, FaTimes, FaKey } from 'react-icons/fa';

const defaultAvatar = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128';

const AdminProfile = () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [profile, setProfile] = useState({
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    avatar: user.avatar || defaultAvatar,
  });
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const fileInputRef = useRef();

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes (placeholder for API call)
  const handleSave = () => {
    // TODO: Call API to update profile (name, bio, avatar)
    setEditMode(false);
    // Optionally update localStorage
    localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
  };

  // Handle password modal
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to change password
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="admin-profile-container">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            <img
              src={profile.avatar || defaultAvatar}
              alt="Profile Avatar"
              className="profile-avatar"
            />
            {editMode && (
              <button
                className="avatar-edit-btn"
                onClick={() => fileInputRef.current.click()}
                title="Change Avatar"
              >
                <FaCamera />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <div className="profile-info-section">
          <div className="profile-header-row">
            <h2 className="profile-name">
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="profile-input"
                  maxLength={32}
                />
              ) : (
                profile.name
              )}
            </h2>
            <button
              className="profile-edit-btn"
              onClick={() => setEditMode((e) => !e)}
              title={editMode ? 'Cancel Edit' : 'Edit Profile'}
            >
              {editMode ? <FaTimes /> : <FaUserEdit />}
            </button>
            {editMode && (
              <button
                className="profile-save-btn"
                onClick={handleSave}
                title="Save Changes"
              >
                <FaSave />
              </button>
            )}
          </div>
          <div className="profile-row">
            <span className="profile-label">Username:</span>
            <span className="profile-value uneditable">{profile.username}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value uneditable">{profile.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Bio:</span>
            {editMode ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="profile-input profile-bio-input"
                maxLength={120}
                rows={2}
              />
            ) : (
              <span className="profile-value">{profile.bio || <span className="profile-placeholder">No bio set.</span>}</span>
            )}
          </div>
          <div className="profile-actions">
            <button
              className="change-password-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              <FaKey style={{ marginRight: 8 }} /> Change Password
            </button>
          </div>
        </div>
      </div>
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <input
                type="password"
                name="current"
                placeholder="Current Password"
                value={passwords.current}
                onChange={handlePasswordChange}
                required
                className="profile-input"
              />
              <input
                type="password"
                name="new"
                placeholder="New Password"
                value={passwords.new}
                onChange={handlePasswordChange}
                required
                className="profile-input"
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                required
                className="profile-input"
              />
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;