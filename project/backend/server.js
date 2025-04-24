const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const Item = require('./models/Item');

const User = require('./models/User'); 
const Product = require('./models/Product'); 
const Cart = require('./models/Cart'); // Import Cart model
const DataModel = require('./models/DataModel');

const app = express();
const PORT = process.env.PORT || 5000;

// const router = express.Router();
// const Order = require('./models/Order'); // Adjust this path if needed

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
};

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key', // Use a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
  },
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agriconnect')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('MongoDB connection error:', error));


 

    app.post('/api/register', upload.single('image'), async (req, res) => {
        const { username, password, uniqueId } = req.body;
    
        // Get only the filename from the uploaded image
        const image = req.file ? req.file.filename : null;
    
        if (!username || !password || !uniqueId || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
    
            const newUser = new User({ username, password, uniqueId, image });
            await newUser.save();
    
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password }); // Using plain text for demonstration
        if (user) {
            req.session.uniqueId = user.uniqueId; // Store uniqueId in session
            res.status(200).json({ message: 'Login successful', uniqueId: user.uniqueId });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Product upload route
app.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, type, price, kg, quantity, phone, address, uniqueId } = req.body;
    const image = req.file ? req.file.filename : '';

    if (!name || !type || !price || !kg || !quantity || !phone || !address || !image || !uniqueId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newProduct = new Product({ name, type, price, kg, quantity, phone, address, image, uniqueId });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).json({ error: 'Failed to upload product' });
    }
});

// Get products by user ID
app.get('/api/products/user/:userId', (req, res) => {
    const userId = req.params.userId;
    Product.find({ uniqueId: userId })
      .then(products => {
        if (!products || products.length === 0) {
          return res.status(404).json({ message: 'No products found for this user' });
        }
        res.status(200).json(products);
      })
      .catch(err => res.status(500).json({ error: 'Failed to fetch products' }));
});

// Get all products
app.get('/api/product', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Error fetching products', details: error.message });
    }
});

// Update product by ID
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    const productId = req.params.id;
    const { name, type, price, kg, quantity, phone, address } = req.body;
    const image = req.file ? req.file.filename : undefined; 

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, type, price, kg, quantity, phone, address, image },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product', details: error.message });
    }
});

// Get products by type
app.get('/api/products/type/:type', async (req, res) => {
    const { type } = req.params;

    try {
        const products = await Product.find({ type });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by type:', error.message);
        res.status(500).json({ message: 'Error fetching products by type', details: error.message });
    }
});



// Add item to cart
app.post('/api/cart', async (req, res) => {
    const { uniqueId, name, type, price, quantity, phone, address, image } = req.body;

    try {
        // Check for existing item in the cart
        const existingItem = await Cart.findOne({
            uniqueId: uniqueId,
            name: name,
            type: type,
        });

        if (existingItem) {
            // If the item exists, respond with a URL to redirect to the cart page
            return res.status(200).json({ 
                message: 'Item already in cart.', 
                redirectTo: `/cart/${uniqueId}` // Assuming this is the route for the cart page
            });
        }

        // If not a duplicate, create a new cart item
        const newCartItem = new Cart({
            uniqueId,
            name,
            type,
            price,
            quantity,
            phone,
            address,
            image,
        });

        const savedItem = await newCartItem.save();
        return res.status(201).json(savedItem); // Return the newly created cart item
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});





// Get cart items by user ID
app.get('/api/cart/:userId', async (req, res) => {
    try {
        const cartItems = await Cart.find({ uniqueId: req.params.userId });
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Failed to fetch cart items' });
    }
});


// Update cart item quantity
app.put('/api/cart/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body; // Expecting quantity to update

    try {
        const updatedItem = await Cart.findByIdAndUpdate(
            id,
            { quantity },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Error updating cart item' });
    }
});

// DELETE /api/cart/:userUniqueId/:itemId
app.delete('/api/cart/:userUniqueId/:itemId', async (req, res) => {
    try {
        const { userUniqueId, itemId } = req.params;
        const deletedItem = await Cart.findOneAndDelete({ _id: itemId, uniqueId: userUniqueId });
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error.message);
        res.status(500).json({ message: 'Server error removing item from cart' });
    }
});


app.get('/api/products/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error('Error fetching the product:', error);
  
      // Check if the error is a casting error (invalid product ID)
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }
  
      res.status(500).json({ success: false, message: 'Error fetching the product' });
    }
  });
  
// Get specific product from cart by productId
app.get('/api/product/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const cartProduct = await Cart.findById(productId); // Assuming Cart has the product stored with _id
        if (cartProduct) {
            res.status(200).json({ success: true, data: cartProduct }); // Consistent response structure
        } else {
            res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cart product', error });
    }
});

// Route to get products of the same type and name (excluding the selected one)
app.get('/api/products/type/:type/:name', async (req, res) => {
    const { type, name } = req.params;

    try {
        const sameTypeProducts = await Product.find({
            type: type,
            name: name,
        });

        res.status(200).json({ success: true, data: sameTypeProducts });
    } catch (error) {
        console.error('Error fetching products of the same type:', error);
        res.status(500).json({ success: false, message: 'Error fetching similar products' });
    }
});
  
app.get('/api/user/:uniqueId', async (req, res) => {
    const { uniqueId } = req.params;
    console.log('Fetching user with uniqueId:', uniqueId); // Debug log

    try {
        const user = await User.findOne({ uniqueId }, 'username uniqueId image');
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User data fetched:', user); // Debug log
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.post('/api/save-items', async (req, res) => {
    try {
      const items = req.body.items;
      await Item.insertMany(items);
      res.status(201).json({ message: 'Items saved successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving items', error });
    }
  });
  
  // Get all items from the database
  app.get('/api/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Error fetching items', error });
    }
  });
  

// Example using Express.js
app.get('/api/user-details/:userId', async (req, res) => {
    const { userId } = req.params; // Get userId from URL params

    try {
        const user = await User.findOne({ uniqueId: userId }); // Use `findOne` with `uniqueId`

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user); // Return the user data
    } catch (err) {
        console.error('Error fetching user details:', err.message);  // Log the error message
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});



// // Example: GET /api/orders/:userId
// router.get('/orders/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     try {
//       const orders = await Order.find({ uniqueId: userId });
//       res.json(orders);
//     } catch (err) {
//       res.status(500).json({ message: "Failed to fetch orders." });
//     }
//   });
  
// Start server

app.post('/orders', async (req, res) => {
    const { uniqueId } = req.body;
  
    try {
      const cartItems = await Cart.find({ uniqueId });
  
      if (!cartItems || cartItems.length === 0) {
        return res.json({ success: false, message: 'Cart is empty!' });
      }
  
      await Order.insertMany(cartItems); // Insert all items into Orders table
      await Cart.deleteMany({ uniqueId }); // Clear cart after placing order
  
      res.json({ success: true, message: 'Order placed successfully!' });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ success: false, message: 'Server error while placing order' });
    }
  });
  
// In Express backend
app.get('/api/orders', async (req, res) => {
    try {
      const orders = await orders.find(); // Replace with user-specific query if needed
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: 'Server error while fetching orders' });
    }
  });
  

// module.exports = router;
 
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
