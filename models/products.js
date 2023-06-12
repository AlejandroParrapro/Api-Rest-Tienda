const {Schema, model} = require("mongoose");

const ProductsSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
});

module.exports = model("Product", ProductsSchema, "products");