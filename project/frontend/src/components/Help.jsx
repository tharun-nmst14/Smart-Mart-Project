import React, { useState } from "react";

const SmartMartChatBox = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! 👋 Welcome to Smart Mart. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  // FAQs Array
  const faqQuestions = [
    "Is this item in stock?",
    "What are the current discounts?",
    "How long does delivery take?",
    "Can I return perishable items?",
    "Do you offer bulk pricing?",
    "Where do you source your vegetables from?",
    "What is the shelf life of this product?",
  ];

  // Handles Sending Message
  const handleSend = () => {
    if (input.trim()) {
      const userMsg = { from: "user", text: input };
      setMessages([...messages, userMsg]);

      setTimeout(() => {
        const response = generateBotResponse(input);
        setMessages((prev) => [...prev, response]);
      }, 600);

      setInput("");
    }
  };

  // Inserts FAQ into input box
  const handleFAQClick = (question) => {
    setInput(question);
  };

  // Generates Bot Response
  const generateBotResponse = (msg) => {
    msg = msg.toLowerCase();
    if (msg.includes("stock")) return { from: "bot", text: "Yes, we have fresh stock available." };
    if (msg.includes("discount")) return { from: "bot", text: "Check out our 'Deals' section for ongoing discounts!" };
    if (msg.includes("delivery")) return { from: "bot", text: "Standard delivery takes 2-3 days." };
    if (msg.includes("return")) return { from: "bot", text: "Perishable items can be returned within 24 hours." };
    if (msg.includes("bulk")) return { from: "bot", text: "Yes, we offer special bulk pricing! Contact support for details." };
    if (msg.includes("source")) return { from: "bot", text: "Our vegetables are sourced directly from local farms." };
    if (msg.includes("shelf life")) return { from: "bot", text: "Most items have a shelf life of 6-12 months." };
    
    return { from: "bot", text:"❗ Sorry, I'm unable to answer that at the moment. Please try asking something else." };
  };

  return (
    <div
      style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 420,
    display: "flex",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    zIndex: 9999,
      }}
    >
      {/* Chat Section */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            backgroundColor: "#27ae60",
            color: "white",
            padding: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "10px 10px 0 0",
          }}
        >
          🛒 Smart Mart Support
        </div>
        <div
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
            fontSize: "14px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.from === "user" ? "right" : "left",
                margin: "6px 0",
                padding: "6px 10px",
                borderRadius: "12px",
                backgroundColor: msg.from === "user" ? "#f1f1f1" : "#ecf0f1",
                display: "inline-block",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #eee" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your query..."
            style={{ flex: 1, padding: "8px", fontSize: "14px", border: "1px solid #ddd", borderRadius: "6px" }}
          />
          <button
            onClick={handleSend}
            style={{
              marginLeft: "8px",
              padding: "8px 12px",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ flex: 1, borderLeft: "1px solid #ddd", padding: "10px" }}>
        <h4 style={{ marginBottom: "10px" }}>❓ FAQs</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {faqQuestions.map((question, index) => (
            <li
              key={index}
              onClick={() => handleFAQClick(question)}
              style={{
                padding: "8px",
                marginBottom: "5px",
                backgroundColor: "#f9f9f9",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e1e1e1")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
            >
              {question}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SmartMartChatBox;
