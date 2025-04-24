import React, { useState } from 'react';
import axios from 'axios';
import './AddItemsPage.css'; // Import the CSS file

const DynamicForm = () => {
  const [items, setItems] = useState([{ name: '', description: '' }]);

  // Handle changes to item fields (name, description)
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Add a new item to the form
  const addNewItem = () => {
    setItems([...items, { name: '', description: '' }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/save-items', { items });
      alert('Items saved successfully!');
    } catch (error) {
      console.error('Error saving items:', error);
      alert('Error saving items');
    }
  };

  return (
    <div className="dynamic-form-page">
      <h2>Add Items</h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="form-grou">
            <label>
              Name:
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addNewItem}>
          Add New Item
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>

  );
};

export default DynamicForm;
