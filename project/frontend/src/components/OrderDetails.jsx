// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// // import './Orders.css';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/orders');
//         setOrders(response.data);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   return (
//     <div className="orders-container">
//       <h2>My Orders</h2>
//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <div className="orders-grid">
//           {orders.map((order) => (
//             <div className="order-card" key={order._id}>
//               <img src={order.image} alt={order.name} className="order-image" />
//               <h3>{order.name}</h3>
//               <p><strong>Type:</strong> {order.type}</p>
//               <p><strong>Price:</strong> ₹{order.price}</p>
//               <p><strong>Quantity:</strong> {order.quantity}</p>
//               <p><strong>Phone:</strong> {order.phone}</p>
//               <p><strong>Address:</strong> {order.address}</p>
//               <p><strong>Order ID:</strong> {order._id}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for redirection
import './Cart.css'; // Importing CSS for styling

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const userUniqueId = localStorage.getItem('uniqueId'); // Get the user unique ID
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch cart items for the user
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (userUniqueId) { // Check if uniqueId is available
                    const response = await axios.get(`http://localhost:5000/api/cart/${userUniqueId}`);
                    setCartItems(response.data || []);
                } else {
                    alert('You must be logged in to view your cart.');
                    navigate('/login'); // Redirect to login page
                }
            } catch (error) {
                console.error('Error fetching cart items:', error.response?.data || error.message);
            }
        };

        fetchCartItems();
    }, [userUniqueId, navigate]);

    // Handle removing an item from the cart
    const handleRemoveFromCart = async (itemId) => {
        if (!userUniqueId) {
            alert('You must be logged in to remove items from the cart.');
            navigate('/login'); // Redirect to login page
            return; // Exit the function if not logged in
        }

        try {
            await axios.delete(`http://localhost:5000/api/cart/${userUniqueId}/${itemId}`);
            setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId)); // Update cart state by removing the item
            console.log('Item removed from cart');
        } catch (error) {
            console.error('Error removing item from cart:', error.response?.data || error.message);
        }
    };

    return (
        <div className="cart-container">
            <h1>My Orders!</h1>
            <div className="cart-items">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div className="cart-item" key={item._id}>
                            <img
                                src={`http://localhost:5000/images/${item.image}`} // Ensure this path is correct
                                alt={item.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <h2 className="cart-item-name">{item.name}</h2>
                                <p className="cart-item-price">Price: ₹{item.price}</p>
                                <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                                <p className="cart-item-type">Type: {item.type}</p>
                                <p className="cart-item-phone">Contact: {item.phone}</p>
                                <p className="cart-item-address">Address: {item.address}</p>
                                {/* <button
                                    className="remove-button"
                                    onClick={() => handleRemoveFromCart(item._id)}
                                >
                                    Remove
                                </button> */}
                                <button>Initiated for Delivery..</button>
                                {/* Use Link for redirection to Buy2 page */}
                                {/* <Link to={`/buy2/${item._id}`}>
                                    <button className="buy-button">Buy</button>
                                </Link> */}
                              <span><h3>Amount paid</h3></span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items in the cart.</p>
                )}
            </div> <br /><br /><br /><br />
            <button><Link to={`/Home`}>
                          <button >Go to Home</button>
                      </Link></button>
        </div>
        
    );
};

export default Cart;
