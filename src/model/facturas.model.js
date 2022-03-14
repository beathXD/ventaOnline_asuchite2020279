const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacturaSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    editable: String,

    ProductoFactura: [{
        idProducto: { type: Schema.Types.ObjectId, ref: 'Productos' },
        cantidad: Number,
        precio: Number,
        totalProducto: Number
    }],
    total: Number
});

module.exports = mongoose.model('facturas', FacturaSchema);