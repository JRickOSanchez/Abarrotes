// models/categoria.js
const mongoose = require('mongoose');

// Define la clase Categoría
class Categoria {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

// Define el esquema de Mongoose
const categoriaSchema = new mongoose.Schema({
  id: String,
  nombre: String,
});

// Exporta tanto la clase como el modelo
module.exports = {
  Categoria: mongoose.model('Categoria', categoriaSchema),
  CategoriaClass: Categoria,
};