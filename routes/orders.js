// Dependencias
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controladores
const OrdersController = require("../controllers/orders")



// Rutas públicas
router.get("/prueba-products", OrdersController.pruebaOrders);
router.get('/users/:userId/orders', OrdersController.getUserOrders);
router.post('/orders', OrdersController.createOrder);


module.exports = router;
