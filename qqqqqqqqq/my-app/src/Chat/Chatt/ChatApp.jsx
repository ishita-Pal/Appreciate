import React, { useState, useRef, useEffect } from "react";
import axios from 'axios'; // To make API requests
import "./ChatApp.css"; // Import your CSS file
import p1 from "./../../Pic/p1.jpg"
import p2 from "./../../Pic/p2.jpg"

const chatList = [
  { id: 2, name: "Chat Bot", message: "This is a sample message", time: "10:30 AM", pinned: false, unread: 0, avatar: p2 },
  { id: 1, name: "John Doe", message: "This is a sample big message with a longer text paragraph", time: "10:30 AM", pinned: false, unread: 1, avatar: p1 },
  { id: 3, name: "Chat Group", message: "This is a sample message", time: "10:30 AM", pinned: false, unread: 0, avatar: "https://via.placeholder.com/40" },
  { id: 4, name: "Will Jenkins", message: "This is a sample message", time: "10:30 AM", pinned: false, unread: 0, avatar: "https://via.placeholder.com/40" },
];

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatSelected, setChatSelected] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Handle chat click
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setChatSelected(true); // Show chat area when a chat is selected
  };

  // Handle user input and fetch fruit details (Modified API call)
  const handleUserInput = async (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (userInput.trim() === "") return;

    const newMessage = {
      text: userInput,
      time: new Date().toLocaleTimeString(),
      type: 'sent'
    };

    setMessages([...messages, newMessage]);

    const fruitName = userInput.toLowerCase();
    try {
      const response = await axios.get('http://localhost:8000/api/fruits', { params: { name: fruitName } });
      const fruits = response.data;
      console.log(response.data);

      if (fruits.length === 0) {
        alert(`No fruit found for: ${fruitName}`);
      }

      fruits.forEach(fruit => {
        const fruitMessage = {
          type: 'received',
          fruit: {
            ...fruit,
            quantity: 1,
            total: fruit.price ? fruit.price : 0, // Ensure total is initialized
          },
          time: new Date().toLocaleTimeString(),
        };

        setMessages((prevMessages) => [...prevMessages, fruitMessage]);
      });
    } catch (error) {
      console.error("Error fetching fruits:", error);
    }

    setUserInput("");
  };

  // Handle quantity change
  const handleQuantityChange = (index, change) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const message = updatedMessages[index];
      if (message.type === 'received' && message.fruit) {
        const newQuantity = Math.max(1, message.fruit.quantity + change);
        updatedMessages[index] = {
          ...message,
          fruit: {
            ...message.fruit,
            quantity: newQuantity,
            total: (message.fruit.price || 0) * newQuantity, // Ensure total calculation
          },
        };
      }
      return updatedMessages;
    });
  };

  // Scroll to the bottom of the messages container when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-profile">
          <img
            src="https://via.placeholder.com/60"
            alt="User Profile"
            className="profile-pic"
          />
          <h3>Username</h3>
        </div>

        <h2>Chats</h2>

        <ul className="chat-list">
          {chatList.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`chat-item ${selectedChat?.id === chat.id ? "selected" : ""}`}
            >
              <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
              <div className="chat-info">
                <strong>{chat.name}</strong>
                <p>{chat.message}</p>
              </div>
              <div className="chat-meta">
                <small>{chat.time}</small>
                {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className={`chat-area ${chatSelected ? 'chat-selected' : ''}`}>
        {selectedChat ? (
          <div className="chat-content">
            <div className="chat-header">
              <img src={selectedChat.avatar} alt="avatar" className="chat-header-avatar" />
              <div>
                <h4>{selectedChat.name}</h4>
                <span>Online</span>
              </div>
            </div>

            {/* Display static messages */}
            <div className="messages">
              <div className="message received">
                <p>{selectedChat.message}</p>
                <span className="message-time">{selectedChat.time}</span>
              </div>

              <div className="message sent">
                <p>This is a sample big message with a longer text paragraph</p>
                <span className="message-time">10:30 AM</span>
              </div>

              {/* Display dynamically added messages */}
              {messages.map((msg, index) => {
  if (msg.type === 'received' && msg.fruit) {
    return (
      <div key={index} className="fruit-card-container">
        <div className="fruit-card">
          <img
            src={msg.fruit.image}  // Updated to use 'image' instead of 'image_url'
            alt={msg.fruit.name}
            className="fruit-image"
          />
          <div className="fruit-details">
            <h4>{msg.fruit.name}</h4>
            <p>Price: ${msg.fruit.price ? msg.fruit.price.toFixed(2) : "0.00"}</p>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(index, -1)}>-</button>
              <span>Quantity: {msg.fruit.quantity}</span>
              <button onClick={() => handleQuantityChange(index, 1)}>+</button>
              <span className="total">Total: ${msg.fruit.total ? msg.fruit.total.toFixed(2) : "0.00"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div key={index} className={`message ${msg.type}`}>
        <p>{msg.text}</p>
        <span className="message-time">{msg.time}</span>
      </div>
    );
  }
})}


              {/* Scroll to bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter a fruit name..."
                onKeyDown={handleUserInput}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button className="send-button" onClick={handleSend}>Send</button>
            </div>
          </div>
        ) : (
          <p>Select a chat to view the conversation</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
