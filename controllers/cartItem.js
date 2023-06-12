//Importaciones
const CartItem = require('../models/cartItem');
const User = require('../models/user');
const Product = require('../models/products');

// Accion de prueba 
const pruebaCartItem = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controller/cartItem.js"
    });
}

const getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        const cartItems = await CartItem.find({ userId });
        res.json(cartItems);
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener los elementos del carrito"
        });
    }

}

const addCartItem = async (req, res) => {
    try {
        const { productId, quatity, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        const Product = await Product.findById(productId);
        if (!Product) {
            return res.status(404).send({
                status: "error",
                message: "Producto no encontrado"
            });
        }

        const cartItem = new CartItem({ productId, quatity, userId });
        await cartItem.save();

        return res.status(201).send({
            status: "success",
            cartItem
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al agregar a; elemento al carrito"
        });
    }
}

const deleteCartItem = (req, res) => {
    try {
        const { cartItemId } = req.params;

        const cartItem = CartItem.findById(cartItemId);
        if (!cartItem) {
            return res.status(404).send({
                status: "error",
                message: "Elemneto del carrito no encontrado"
            });
        }

        cartItem.remove();
        return res.status(200).send({
            status: "success",
            message: "Elemneto del carrito eliminado correctamente"
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar el elemnto del carrito"
        });
    }
}

// Exportar acciones
module.exports = {
    pruebaCartItem,
    getCartItems,
    addCartItem,
    deleteCartItem
}