// Dependencias
const express = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = express.Router();

// Importar controladores
const ProductsController = require("../controllers/products")



// Rutas públicas
router.get("/prueba-products", ProductsController.pruebaProducts);
router.get("/products", ProductsController.getAllProducts);
router.get("/productsID/:id", check.auth, ProductsController.getProductById);
router.post("/register-products", ProductsController.createProduct);
router.put("/update", check.auth, ProductsController.updateProduct);
router.delete("/delete", ProductsController.deleteProduct);

module.exports = router;
