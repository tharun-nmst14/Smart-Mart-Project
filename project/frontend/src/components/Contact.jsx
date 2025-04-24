// src/pages/Contact.jsx
import React from 'react';
import './Contact.css'; // Optional styling

const Contact = () => {
  const whatsappNumber = '9182804051';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const whatsappCustomerSupport = "https://wa.me/9182804051?text=Hi%2C%20I%20need%20customer%20support%20regarding%20my%20order.";
  const whatsappTechSupport = "https://wa.me/7993169489?text=Hi%2C%20I%20need%20technical%20support%20with%20the%20website.";

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>For any inquiries, feedback, or support, please reach out to us:</p>
      <ul>
        <li>Email: support@smart.com</li>
        <li>Phone: +91-82804051</li>
        <li>Address: RGUKT Smart Campus, Telangana</li>
      </ul>

      <a href={whatsappCustomerSupport} target="_blank" rel="noopener noreferrer">
        <button className="whatsapp-button">Customer Support</button>
      </a> <h1>  </h1>
      <a href={whatsappTechSupport} target="_blank" rel="noopener noreferrer">
        <button className="whatsapp-button">Tech Support</button>
      </a>
    </div>
  );
};

export default Contact;
