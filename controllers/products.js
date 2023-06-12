//importaciones
const Product = require("../models/products");


// Accion de prueba 
const pruebaProducts = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controller/products.js"
    });
}

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).send({
            status: "success",
            products
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al recuperar productos"
        });
    }
};

// Obtener producto por su ID
const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (product) {
            return res.status(200).send({
                status: "success",
                product
            });
        } else {
            return res.status(404).send({
                status: "error",
                message: 'Producto no encontrado'
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "success",
            message: 'Error al obtener el producto'
        });
    }
};

// Crear nuevo producto
const createProduct = async (req, res) => {
    const { name, price, description, stock, color, size } = req.body;
    try {
        const product = new Product({
            name,
            price,
            description,
            stock,
            color,
            size
        });

        await product.save();

        return res.status(200).send({
            status: "success",
            message: "Producto creado exitosamente"
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "No se pudo crear el producto con éxito"
        });
    }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, price, description, stock, color, size } = req.body;

    try {
        const product = await product.findByIdAndUpdate(
            productId,
            { name, price, description, stock, color, size },
            { new: true }
        );
        if (product) {
            return res.status(200).send({
                status: "success",
                message: "Producto actualizado con exito"
            })
        } else {
            return res.status(404).send({
                status: "error",
                message: "Verificar bien los datos"
            })
        }
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al actualizar"
        })
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    
    try{
        const product = await Product.findByIdAndDelete(productId);
        if (product) {
        return res.status(200).send({
            status: "success",
            message: "El producto se elimino correctamente"
        });
        } else {
            return res.status(404).send({
                status: "error",
                message: "Producto no encontrado"
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "No se pudo borrar el producto"
        });
    }

};


// Exportar acciones
module.exports = {
    pruebaProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}