//Importaciones
const Comment = require("../models/comments");
const User = require('../models/user');
const Product = require('../models/products');

// Accion de prueba 
const pruebaComments = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controller/comments.js"
    });
}

async function getProductComments(req, res) {
    try {
        const { productId } = req.params;

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({
                status: "success",
                message: "Producto no encontrado"
            });
        }

        // Obtener todos los comentarios del producto
        const comments = await Comment.find({ productId });
        res.json(comments);
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al obtener los comentarios del producto"
        });
    }
}

// Agregar un nuevo comentario a un producto
async function addProductComment(req, res) {
    try {
        const { productId, userId, rating, comment } = req.body;

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({
                status: "success",
                message: "Producto no encontrado"
            });
        }

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        // Crear el nuevo comentario
        const newComment = new Comment({ productId, userId, rating, comment, dateCreated: Date.now() });
        await newComment.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al agregar el comentario al producto"
        });
    }
}

//Eliminar comentario
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;

        // Verificar si el comentario existe
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "Comentario no encontrado"
            });
        }

        await comment.remove();
        res.json({ message: "Comentario eliminado correctamente"});
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al eliminar el comentario"
        });
    }
}

// Exportar acciones
module.exports = {
    pruebaComments,
    getProductComments,
    addProductComment,
    deleteComment
}