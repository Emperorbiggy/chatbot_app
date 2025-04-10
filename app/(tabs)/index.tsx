import React, { useState } from 'react';
import './Chatbot.css'; // Import custom CSS file

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; fromBot: boolean }[]>([
    { text: 'Hello! How can I help you today?', fromBot: true },
  ]);
  const [input, setInput] = useState<string>('');
  const [awaitingBotReply, setAwaitingBotReply] = useState<boolean>(false);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, fromBot: false }]);
    setInput('');
    
    // Set the bot to be typing before sending the request
    setMessages((prev) => [...prev, { text: "Typing...", fromBot: true }]);
    setAwaitingBotReply(true);
  
    try {
      // Send the message to the backend chatbot
      const response = await fetch("https://chatbotbackend-1wds.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
  
      const responseData = await response.json();
      console.log("Response from bot:", responseData);
  
      // Replace the "Typing..." message with the bot's response
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the "Typing..." message
        { text: responseData.response, fromBot: true }, // Add the bot's response
      ]);
    } catch (err) {
      console.error("Error fetching response:", err);
      
      // Replace the "Typing..." message with an error message
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error fetching response. Please try again.", fromBot: true },
      ]);
    } finally {
      setAwaitingBotReply(false); // Stop waiting for the bot response
    }
  };
  

  return (
    <div className="chatbot-container">
      {/* Chatbot Header */}
      <div className="chatbot-header">
        <h1>Support Bot</h1>
      </div>

      {/* Chatbot Messages */}
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatbot-message ${msg.fromBot ? 'bot-message' : 'user-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Chatbot Input */}
      <div className="chatbot-input-container">
        <input
          className="chatbot-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={awaitingBotReply}
        />
        <button
          className="chatbot-send-btn"
          onClick={handleSend}
          disabled={awaitingBotReply}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
