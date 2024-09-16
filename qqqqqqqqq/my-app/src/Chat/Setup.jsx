import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './setup.css';
import axios from 'axios';

function Setup() {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('password', password);
    if (image) {
      formData.append('profile_image', image);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/setup-account', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('Account setup successful');
      
      // Navigate to chat page
      navigate('/chat');
    } catch (error) {
      console.error(error);
      alert('Error setting up account');
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-header">
        <span className="icon">&#128247;</span> {/* Camera Icon */}
        <div className="text">Let's get you setup.</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="profile-section">
          <div className="profile-image">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Profile" className="profile-picture" />
            ) : (
              <div className="image-placeholder">
                <span>&#43;</span>
                <div>Upload a profile image</div>
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="file-input"
            accept="image/*" 
            onChange={handleImageChange} 
            className="file-input"
          />
          <label className="browse-label" htmlFor="file-input">
            Browse
          </label>
        </div>

        <div className="input-section">
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Phone Number" 
            className="input-field"
            required
          />
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="First Name" 
            className="input-field"
            required
          />
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="Last Name" 
            className="input-field"
            required
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="complete-setup-btn">Complete Setup</button>
      </form>
    </div>
  );
}

export default Setup;
