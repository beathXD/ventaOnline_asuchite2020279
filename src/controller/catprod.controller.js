const Producto = require("../model/productos.model");
var Categoria = require("../model/categorias.model");

function aggCategorias(req, res) {
    var modeloCategoria = new Categoria();

    if (req.user.rol != 'Administrador') {
        return res.status(500).send({ mensaje: 'No tiene el rol requerido para eliminar este producto' });
    }

    if (req.body.nombre) {
        modeloCategoria.nombre = req.body.nombre;
        modeloCategoria.save((err, guardCat) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!guardCat) return res.status(500).send({ mensaje: 'No se pudo agregar una categoria' });
            return res.status(200).send({ categoria: guardCat });
        })
    } else {
        return res.status(500).send({ mensaje: 'Debe de ingresar los parametros obligatorios' });
    }
}

function editCat(req, res) {
    var Id = req.params.idCategoria;
    var parametros = req.body;

    if (req.user.rol != 'Administrador') {
        return res.status(500).send({ mensaje: 'No tiene el rol requerido para eliminar este producto' });
    }


    Categoria.findByIdAndUpdate(Id, parametros, { new: true }, (err, catEdited) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!catEdited) return res.status(404).send({ mensaje: 'No se pudo editar la categoria' });

        return res.status(200).send({ Categoria: catEdited })
    })

}

function obtCat(req, res) {
    Categoria.find({}, (err, obtCat) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!obtCat) return res.status(500).send({ mensaje: 'No se pudo buscar la categoria' });

        return res.status(200).send({ Categorias: obtCat });
    })
}

function productAgotados(req, res) {

    Producto.find({ cantidad: 0 }).exec(
        (err, productAgotados) => {
            if (err) {
                res.status(500).send('Error en la peticion');
            } else {
                if (!productAgotados) return res.status(500).send({ mensaje: 'No hay productos en existencia' })
                return res.status(200).send({ productAgotados });
            }
        })
}

function elimCat(req, res) {
    var id = req.params.idCategoria

    if (req.user.rol != 'Administrador') {
        return res.status(500).send({ mensaje: 'No tiene el rol requerido para eliminar este producto' });
    }


    Categoria.find({ nombre: { $regex: "Default", $options: "i" } }, (err, defecto) => {
        if (defecto.id !== id) {
            Categoria.findByIdAndDelete({ _id: id }, (err, elim) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!elim) return res.status(500).send({ mensaje: 'No se pudo eliminar uno' });
                {
                    Producto.updateMany({ idCategoria: id }, { idCategoria: defecto.id }, { new: true }, (err, actualizar) => {
                        return res.status(200).send({ mensaje: elim });
                    })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'No puedes eliminar la categoria por defecto' });
        }
    })
}

function stock(req, res) {
    const idP = req.params.idProducto;
    const parametros = req.body;

    Producto.findByIdAndUpdate(idP, { $inc: { cantidad: parametros.cantidad } }, { new: true },
        (err, stock) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!stock) return res.status(500).send({ mensaje: 'No se pudo incrementar la cantidad del producto' });
            return res.status(200).send({
                producto: stock
            })
        })
}

function aggProducto(req, res) {
    var productoModel = new Producto();
    var parametros = req.body;

    if (req.user.rol != 'Administrador') {
        return res.status(500).send({ mensaje: 'No tiene el rol requerido para eliminar este producto' });
    }

    Producto.find({ nombre: parametros.nombre }, (err, encProd) => {
        if (encProd.length > 0) {
            return res.status(500).send({ mensaje: 'Producto en existencia' });
        } else {
            if (parametros.nombre) {
                productoModel.nombre = parametros.nombre;
                productoModel.precio = parametros.precio;
                productoModel.cantidad = parametros.cantidad;

                productoModel.save((err, podGuard) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!podGuard) {
                        res.status(404).send({ mensaje: 'Error al registrar el producto' })
                    }

                    return res.status(200).send({ producto: podGuard });
                })
            } else {
                return res.status(400).send({ mensaje: 'Debe de ingresar parametros obligatorios' });
            }
        }
    })

}

function aggCatProd(req, res) {
    var producto = req.params.idProducto;
    var categorias = req.params.idCategoria;

    if (req.user.rol != 'Administrador') {
        return res.status(500).send({ mensaje: 'No tiene el rol requerido para agragar este producto' });
    }

    Producto.findByIdAndUpdate(producto, { idCategoria: categorias }, { new: true },
        (err, catAdd) => {
            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!catAdd) return res.status(500).send({ mensaje: 'No se pudo agregar la categoria' });

            return res.status(200).send({ product: catAdd });
        })
}

function editProduct(req, res) {
    var idProducto = req.params.idProducto;
    var parametros = req.body;

    if (req.user.rol != 'Administrador') {
        return res.status(500).send({ mensaje: 'No tiene el rol requerido para editar este producto' });
    }


    Producto.findByIdAndUpdate(idProducto, parametros, { new: true }, (err, prodEdited) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!prodEdited) return res.status(404).send({ mensaje: 'No se ha podido editar el prducto' });
        return res.status(200).send({ producto: prodEdited });
    })
}

function obtenerProduct(req, res) {
    var categoriaId = req.params.idCategoria;

    Producto.find({ idCategoria: categoriaId }).exec(
        (err, obtProd) => {
            if (err) {
                res.status(500).send('Error en la peticion');
            } else {
                if (!obtProd) return res.status(500).send({ mensaje: 'No existen productos' })
                return res.status(200).send({ obtProd });
            }
        })
}

function obtenerNombre(req, res) {
    var params = req.body;

    Producto.find({ nombre: params.nombre }).exec(
        (err, obtProd) => {
            if (err) {
                res.status(500).send('Error en la peticion');
            } else {
                if (!obtProd) return res.status(500).send({ mensaje: 'No existen productos' })
                return res.status(200).send({ obtProd });
            }
        })
}

function elimProduct(req, res) {
    var idProducto = req.params.idProducto;

    if (req.user.rol != 'Administrador') {
        return res.status(500).send({ mensaje: 'No tiene el rol requerido para eliminar este producto' });
    }

    Producto.findByIdAndDelete(idProducto, (err, prodDelete) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!prodDelete) return res.status(500).send({ mensaje: 'No se ha podido eliminar el producto' });

        return res.status(200).send({ producto: prodDelete });
    })
}

function defaultCat(req, res) {
    var categoriaModel = Categoria();

    categoriaModel.nombre = 'Por defecto'

    Categoria.find({ nombre: 'Por defecto' }, (err, catDefecto) => {
        if (err) return console.log({ mensaje: 'Error en la peticion' });
        if (catDefecto.length >= 1) {
            return console.log({ mensaje: 'La categoria se ha creado con exito' })
        } else {
            categoriaModel.save((err, guardar) => {
                if (err) return console.log({ mensaje: 'Error en la peticion' });
                if (guardar) {
                    console.log('Categoria guardada con exito');
                } else {
                    console.log({ mensaje: 'No se pudo crear la categoria' });
                }

            })
        }

    })
}

module.exports = {
    aggCategorias,
    editCat,
    obtCat,
    productAgotados,
    elimCat,
    stock,
    aggProducto,
    aggCatProd,
    editProduct,
    obtenerProduct,
    obtenerNombre,
    elimProduct,
    defaultCat
}