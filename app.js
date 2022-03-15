const express = require('express');
const cors = require('cors');
const app = express();

var usuarioRoutes = require("./src/routes/usuario.routes");
var catprodRoutes = require("./src/routes/catprod.routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', usuarioRoutes, catprodRoutes);

module.exports = app;