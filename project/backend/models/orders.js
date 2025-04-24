const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    uniqueId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true }, // indicates if the order is still active/available
}, {
    timestamps: true // adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('orders', ordersSchema);
