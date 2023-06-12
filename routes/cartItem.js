// Dependencias
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controladores
const CartItemController = require("../controllers/cartItem")

// Rutas públicas
router.get("/prueba-products", CartItemController.pruebaCartItem);
router.get("/users/:userId/cartItems", CartItemController.getCartItems);
router.post("/cartItems", CartItemController.addCartItem);
router.delete("/cartItems/:cartItemId", CartItemController.deleteCartItem);


module.exports = router;
