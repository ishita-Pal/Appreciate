import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login/login"
import Home from "./Home/Home"
import About from "./About/About"
import Faq from "./Faq/Faq"
import Chat from "./Chat/Chat"
import Setup from './Chat/Setup';
import Pass from "./Chat/Pass";
import ChatApp from "./Chat/Chatt/ChatApp"
import Phone from './Chat/Phone';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/faq" element={<Faq/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/chat" element={<ChatApp/>}/>
        <Route path="/chatlog" element={<Chat/>}/>
        <Route path="/phone" element={<Phone />} />
        <Route path="/setup-account" element={<Setup />} />
        <Route path="/password" element={<Pass />} />
      </Routes>
    </Router>
  );
}

export default App;
