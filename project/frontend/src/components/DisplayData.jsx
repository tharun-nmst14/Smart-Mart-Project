import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DisplayItemsPage.css'; // Import the updated CSS

const DisplayData = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="display-i-c">
      <h2>Schemes</h2>
      {items.length === 0 ? (
        <p>No schemes available.</p>
      ) : (
        <div className="i-l">
          {items.map((item, index) => (
            <div className="i-b" key={index}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayData;
