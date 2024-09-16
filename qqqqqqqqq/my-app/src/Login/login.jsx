import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; 
import './login.css'; 
import { FaFacebook, FaInstagram, FaPinterest } from "react-icons/fa";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://appreciate-12.onrender.com/login/', {
                username,
                password,
            });

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "You have successfully logged in",
                showConfirmButton: false,
                timer: 1500
            });

            // Redirect to the home page after successful login
            setTimeout(() => {
                navigate('/home');  // Use navigate to redirect
            }, 1600);  
        } catch (err) {
            console.error(err.response);  // Print the full error response
            
         
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid credentials. Please try again.",
            });

            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <p>By signing in you are agreeing to our <a href="#">Terms and privacy policy</a></p>
                <form onSubmit={handleLogin} className="login-form">
                    <input 
                        type="text" 
                        placeholder="Email Address" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                   
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <div className="social-login">
                    <p>or connect with</p>
                    <div className="social-icons">
                        <i className="fa fa-facebook"><FaFacebook /></i>
                        <i className="fa fa-instagram"><FaInstagram /></i>
                        <i className="fa fa-pinterest"><FaPinterest /></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
