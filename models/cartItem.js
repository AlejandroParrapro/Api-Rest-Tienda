const { Schema, model } = require("mongoose");

const CartItemSchemaSchema = Schema({
    id: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }

});

module.exports = model("CartItem", CartItemSchemaSchema, "cartItems");