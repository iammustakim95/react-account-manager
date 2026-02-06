import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  // Load user data into form when component mounts
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!user) return <div className="text-center mt-5">Please log in to view this page.</div>;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">My Account</h3>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-success">{message}</div>}
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email (Read only)</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.email}
                  disabled
                />
              </div>
              <button type="submit" className="btn btn-success me-2">Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> User</p>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;