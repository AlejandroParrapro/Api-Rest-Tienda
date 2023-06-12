// Importar dependecias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Conexion a bbdd
connection();

// Crear servidor node 
const app = express();
const port = 3900;

// Configurar cors
app.use(cors());

// Convertr los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas
const UserRoutes = require("./routes/user");
const ProductsRoutes = require("./routes/products");
const CartItemRoutes = require("./routes/cartItem");
const OrdersRoutes = require("./routes/orders");
const CommentsRoutes = require("./routes/comments");

app.use("/api/user", UserRoutes);
app.use("/api/products", ProductsRoutes);
app.use("/api/cartItem", CartItemRoutes)
app.use("/api/orders", OrdersRoutes);
app.use("/api/comments", CommentsRoutes);

// Poner servidor a escuchar peticion http
app.listen(port, () => {
    console.log("Servidor node corriendo en el puerto: ", port);
})