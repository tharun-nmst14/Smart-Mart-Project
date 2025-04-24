import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Upload from './components/Upload';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import MyCard from './components/MyCard';
import EditProduct from './components/EditProduct'; 
import Vegetables from './components/Vegetables';
import Hardware from './components/Hardware';
import Fertilizer from './components/Fertilizer';
import Crops from './components/Crops';
import Logout from './components/Logout';
import Buy from './components/Buy';
import Buy2 from './components/Buy2'; // Import Buy component
import Profile from './components/Profile'; // Import Profile component
import './App.css'; 
import DynamicForm from './components/DynamicForm';
import DisplayData from './components/DisplayData';
import Payment from './components/Payment';
import Help from './components/Help'
import OrderDetails from './components/OrderDetails';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy'; // Import the PrivacyPolicy page
import Terms from './components/Terms';
const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
      <Content 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
      />
    </Router>
  );
};

const Content = ({ cartItems, setCartItems }) => {
  const location = useLocation();

  const shouldShowButton = !['/', '/vegetables', '/crops', '/fertilizers', '/hardware', '/login', '/register', '/logout','/orderDetails'].includes(location.pathname);

  return (
    <>


      <Routes>
        <Route path="/" element={<Home cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mycard" element={<MyCard />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/vegetables" element={<Vegetables cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/hardware" element={<Hardware cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/fertilizers" element={<Fertilizer cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/crops" element={<Crops cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/buy/:productId" element={<Buy />} /> {/* Add route for Buy component */}
        <Route path="/buy2/:productId" element={<Buy2 />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
        <Route path="/form" element={<DynamicForm />} />
        <Route path="/data" element={<DisplayData />} />
        <Route path="/buy" element={<Payment />} />
        <Route path="/help" element={<Help />} />
        <Route path="/orders" element={<orderDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Add route */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/OrderDetails" element={<OrderDetails />} />
    


      </Routes>

      {shouldShowButton && (
       <button> <Link to="/" className="home-button">
          Go to Home in
        </Link></button>
      )}
    </>
  );
};

export default App;
