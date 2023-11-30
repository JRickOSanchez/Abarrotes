const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  nombre: String,
  descripcion: String,
  codigoBarras: String,
  precioCompra: Number,
  precioVenta: Number,
  existencias: Number,
  proveedor: String,
  categoria: String,
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;