// Importaciones
const Order = require("../models/orders");
const User = require("../models/user");
const CartItem = require("../models/cartItem");
const mongoose = require("mongoose")

// Accion de prueba 
const pruebaOrders = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controller/orders.js"
    });
}

// Obtener todas las ordenes de un usuario
const getUserOrders = (req, res) => {
    try {
        const { userId } = req.params;

        const user = User.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Error al obtener las ordenes del usuario"
            });
        }

        const orders = Order.find({ userId });
        res.json(orders);

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener las ordenes del usuario"
        });
    }
}

// Crear comentario
const createOrder = (req, res) => {
    try {
        const { userId, items, totalPrice } = req.body;

        const user = User.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        for (const item of items) {
            const cartItem = CartItem.findById(item.cartItemId);
            if (!cartItem) {
                return res.status(404).send({
                    status: "error",
                    message: "Elemento del carrito no encontado"
                });
            }
        }
        // Eliminar comentario
        const newOrder = new Order({ userId, items, totalPrice, status: "pending", dateCreated: Date.now() });
        newOrder.save();

        for (const item of items) {
            CartItem.findByIdAndRemove(item.cartItemId);
        }

        res.status(201).json(newOrder);
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al crear la orden"
        });
    }
}
// Exportar acciones
module.exports = {
    pruebaOrders,
    getUserOrders,
    createOrder
}