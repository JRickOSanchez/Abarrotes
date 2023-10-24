// models/transaccioninventario.js
const mongoose = require('mongoose');

const transaccionInventarioSchema = new mongoose.Schema({
  id: String,
  tipoTransaccion: String,
  producto: String,
  cantidad: Number,
  fechaTransaccion: Date,
});

const TransaccionInventarioModel = mongoose.model('TransaccionInventario', transaccionInventarioSchema);

module.exports = TransaccionInventarioModel;