import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './phone.css'; // Assuming you have the CSS in a file named Login.css

const Phone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // React Router's navigation hook

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://appreciate-12.onrender.com/api/check-user', { phone: phoneNumber });

      if (response.data.exists) {
        // Redirect to the password page with the phone number
        navigate(`/password?phone=${phoneNumber}`);
      } else {
        // Redirect to setup-account page if user does not exist
        navigate(`/setup-account?phone=${phoneNumber}`);
      }
      
    } catch (error) {
      setError('An error occurred while checking the phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginn-container">
      <h2>Get started.</h2>
      <form onSubmit={handlePhoneNumberSubmit}>
        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          id="phone"
          placeholder="+91 XXXXXX XXXXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Get Started'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Phone;
