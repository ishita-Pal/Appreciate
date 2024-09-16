import React, { useState } from 'react';
import axios from 'axios';
import './chatl.css';


function Profile({ phone }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('phone', phone);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      await axios.post('/api/setup-profile', formData);
      alert('Profile setup complete!');
    } catch (error) {
      console.error('Error setting up profile', error);
    }
  };

  return (
    <div className="containerq setup-screen">
    <h2 className="title">Let’s get you setup</h2>
    <div className="upload-containerq upload-containerq-hover">
      <label className="upload-label">
        <input className="upload-input" type="file" onChange={handleImageUpload} />
        <span>Upload a profile image</span>
      </label>
    </div>
    <input
      className="form-input input-background"
      type="text"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      placeholder="First Name"
    />
    <input
      className="form-input input-background"
      type="text"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      placeholder="Last Name"
    />
    <button className="form-button button button-shadow" onClick={handleSubmit}>Complete Setup</button>
  </div>
  
  );
}

export default Profile;
