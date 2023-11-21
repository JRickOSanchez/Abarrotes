const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  contacto: String,
});

const ProveedorModel = mongoose.model('Proveedor', proveedorSchema);

module.exports = ProveedorModel;