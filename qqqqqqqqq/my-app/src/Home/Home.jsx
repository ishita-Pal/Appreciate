import React from 'react';
import './home.css'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1>Fruit.Ai</h1>
      <p>“Be Healthy!”</p>
      <div className="button-grid">
        <div className="button" onClick={()=>navigate('/chatlog')}>Chat</div>
        <div className="button">Translate</div>
        <div className="button" onClick={()=>navigate('/faq')}>FAQs</div>
        <div className="button" onClick={()=>navigate('/about')}>About</div>
      </div>
    </div>
  );
};

export default Home;
