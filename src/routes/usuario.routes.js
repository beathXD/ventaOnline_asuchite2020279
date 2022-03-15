const express = require('express');
const controladorUsuario = require('../controller/usuario.controller');
const md_authentication = require('../middleware/autenticacion');

const api = express.Router();

api.post('/registrarAdmin', controladorUsuario.RegAdmin);
api.post('/registrarCliente', controladorUsuario.RegClientes);
api.put('/editarUsuario/:idUsuario', md_authentication.Auth, controladorUsuario.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario', md_authentication.Auth, controladorUsuario.EliminarUsuario);
api.post('/login', controladorUsuario.Login);


module.exports = api;