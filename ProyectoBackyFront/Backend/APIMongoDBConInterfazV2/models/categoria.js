// models/categoria.js
const mongoose = require('mongoose');

// Define el esquema de Mongoose
const categoriaSchema = new mongoose.Schema({
  nombre: String,
});

// Exporta el modelo
module.exports = mongoose.model('Categoria', categoriaSchema);