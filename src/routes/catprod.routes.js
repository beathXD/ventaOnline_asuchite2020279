const express = require('express');
const controladorCatProd = require('../controller/catprod.controller');
const md_authentication = require('../middleware/autenticacion');

const api = express.Router();

api.post('/aggCategorias', md_authentication.Auth, controladorCatProd.aggCategorias);
api.put('/editCat/:idCategoria', md_authentication.Auth, controladorCatProd.editCat);
api.get('/obtCat', controladorCatProd.obtCat);
api.get('/productAgotados', controladorCatProd.productAgotados);
api.delete('/elimCat/:idCategoria', md_authentication.Auth, controladorCatProd.elimCat);
api.put('/stock/:idProducto', controladorCatProd.stock);

/*-----producto-----*/

api.post("/aggProducto", md_authentication.Auth, controladorCatProd.aggProducto);
api.put('/aggCatProd/:idProducto/:idCategoria', md_authentication.Auth, controladorCatProd.aggCatProd);
api.put('/editProduct/:idProducto', md_authentication.Auth, controladorCatProd.editProduct);
api.get('/obtenerProduct/:idCategoria', controladorCatProd.obtenerProduct);
api.get('/obtenerNombre', controladorCatProd.obtenerNombre);
api.delete('/elimProduct/:idProducto', md_authentication.Auth, controladorCatProd.elimProduct);

module.exports = api;