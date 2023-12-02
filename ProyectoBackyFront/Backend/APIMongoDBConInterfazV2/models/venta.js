// models/venta.js
const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  id: String,
  cliente: String,
  fechaVenta: Date,
  productosVendidos: [{
    producto: String,
    cantidad: Number,
    precioUnitario: Number
  }],
});

const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;
