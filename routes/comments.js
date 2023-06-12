// Dependencias
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controladores
const CommentsController = require("../controllers/comments")



// Rutas públicas
router.get("/prueba-products", CommentsController.pruebaComments);
router.get('/products/:productId/comments', CommentsController.getProductComments);
router.post('/comments', CommentsController.addProductComment);
router.delete('/comments/:commentId', CommentsController.deleteComment);


module.exports = router;
