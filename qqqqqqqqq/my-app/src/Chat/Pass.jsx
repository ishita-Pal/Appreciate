import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './pass.css';
import fruitsGif from './../Pic/i.gif';

const Pass = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone'); // Get the phone number from the URL
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/chatlogin/', {
        phone: phone, // Use 'phone' instead of 'username'
        password: password
      });

      // If login is successful, show SweetAlert2 popup and navigate to /chat
      if (response.data.message === 'Login successful') {
        Swal.fire({
          title: "Login Successful!",
          text: "You will be redirected to the chat page.",
          icon: "success",
          width: 550,
          padding: "3em",
          color: "#716add",
          background: "#fff", // Set the background color to white
          backdrop: `
            rgba(0,0,0,0.5) 
            url(${fruitsGif}) 
            left top 
            no-repeat
          `,
          customClass: {
            container: 'swal-container',
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content',
            confirmButton: 'swal-confirm-button'
          }
        }).then(() => {
          navigate('/chat');
        });
      } else {
        // Handle error for incorrect login attempt
        setError('Incorrect password, please try again.');
      }
    } catch (error) {
      setError('An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passContainer">
      <h2>Enter your password</h2>
      <form onSubmit={handlePasswordSubmit}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Pass;
