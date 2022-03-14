const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductoSchema = Schema({
    nombre: String,
    precio: Number,
    cantidad: Number,
    idCategoria: { type: Schema.Types.ObjectId, ref: 'Categorias' }
});

module.exports = mongoose.model('Productos', ProductoSchema);