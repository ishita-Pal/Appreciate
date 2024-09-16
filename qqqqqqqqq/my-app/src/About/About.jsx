import React from 'react';
import './about.css';
import img from "./../Pic/figma.png"

const About = () => {
  return (
    <div className="wrapper">
      <div className="logo">
        <img src={img} alt="Logo 1" />
        <img src={img} alt="Logo 1" />
        <img src={img} alt="Logo 1" />
        
      </div>

      <div className="content">
        <h1>Fruit.AI</h1>
        <p>
          Whether you're looking to discover new fruits, understand their
          nutritional values, or find the perfect fruit for your diet, our
          AI-driven chatbot is here to assist. We provide personalized fruit
          recommendations tailored to your health needs, making it easier for
          you to integrate the best fruits into your daily routine.
        </p>
        <button className="about-btn">ABOUT</button>
      </div>
    </div>
  );
};

export default About;
