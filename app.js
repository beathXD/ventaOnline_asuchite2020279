const express = require('express');
const cors = require('cors');
const app = express();

var usuarioRoutes = require("./src/routes/usuario.routes");
var productoRoutes = require("./src/routes/producto.routes");
var categoriaRoutes = require("./src/routes/categoria.routes");
var facturaRoutes = require("./src/routes/factura.routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', usuarioRoutes, productoRoutes, categoriaRoutes, facturaRoutes);

module.exports = app;