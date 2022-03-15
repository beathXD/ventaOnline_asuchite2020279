const mongoose = require('mongoose');
const app = require('./app');
const Usuario = require('./src/controller/usuario.controller');
const catprod = require('./src/controller/catprod.controller')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Se ha conectado correctamente la Base de Datos');

        Usuario.RegAdmin;
        catprod.defaultCat;

        app.listen(3000, function () {
            console.log('Servidor EXPRESS correcto');
        });

    }).catch(error => console.log(error));