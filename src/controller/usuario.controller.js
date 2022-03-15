const Usuario = require('../model/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

function RegAdmin(req, res) {
    var usuarioModel = new Usuario();

    Usuario.find({ email: 'Administrador' }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            return console.log({ mensaje: "Ya se ha creado" })
        } else {

            usuarioModel.nombre = 'Administrador';
            usuarioModel.email = 'Administrador';
            usuarioModel.rol = 'Administrador';

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioGuardado) return res.status(500).send({ mensaje: 'No se ha podido registrar' });

                    return res.status(200).send({ usuario: 'Admin se ha creado con exito' });
                });
            });
        }
    })

}

function RegClientes(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

    if (parametros.nombre && parametros.email) {
        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {

            if (usuarioEncontrado.length > 0) {
                return res.status(500).send({ mensaje: "Ya hay un usuario registrado con este correo" })

            } else {
                modeloUsuario.nombre = parametros.nombre;
                modeloUsuario.apellido = parametros.apellido;
                modeloUsuario.email = parametros.email;
                modeloUsuario.password = parametros.password;
                modeloUsuario.rol = 'Empresa';

                bcrypt.hash(parametros.password, null, null, (err, passwordEncripatada) => {
                    modeloUsuario.password = passwordEncripatada;

                    modeloUsuario.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                        if (!usuarioGuardado) return res.status(500).send({ mensaje: 'No se ha podido registrar' });

                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'Debe ingrear los parametros obligatorios' })
    }
}

function EliminarUsuario(req, res) {
    var idUsu = req.params.idUsuario;

    Usuario.findOne({ _id: idUsu, rol: 'Cliente' }, (err, usuarioEncontrado) => {

        if (!usuarioEncontrado) {
            return res.status(500).send({ mensaje: 'No puedes eliminar un administrador!' });
        } else {

            Usuario.findByIdAndDelete(idUsu, (err, usuarioEliminado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!usuarioEliminado) return res.status(500)
                    .send({ mensaje: 'No se ha podido eliminar' });

                return res.status(200).send({ usuario: usuarioEliminado })

            })
        }
    })
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Contraseña incorrecta' })
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'Por favor identificar usuario' })
        }
    })
}

function EditarUsuario(req, res) {
    var parametros = req.body;

    if (req.user.rol !== 'Admin') {
        return res.status(500).send({ mensaje: 'No puedes editar el curso!' });
    }
    delete parametros.password

    Usuario.findByIdAndUpdate(req.params.idUsuario, parametros, { new: true }, (err, usuarioEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEditado) return res.status(500).send({ mensaje: 'No se ha podido editar el usuario' });

        return res.status(200).send({ usuario: usuarioEditado });


    })

}

module.exports = {
    RegAdmin,
    RegClientes,
    EditarUsuario,
    EliminarUsuario,
    Login
}
