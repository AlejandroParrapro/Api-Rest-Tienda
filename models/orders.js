const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema, "orders");

