// models/compra.js
const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
  id: String,
  proveedor: String,
  fechaCompra: Date,
  productosComprados: [{
    nombre: String,
    cantidad: Number,
    precioUnitario: Number
  }],
});

const CompraModel = mongoose.model('Compra', compraSchema);

module.exports = {
  CompraModel: CompraModel,
};