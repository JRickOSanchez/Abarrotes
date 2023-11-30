// models/categoria.js
const mongoose = require('mongoose');

// Define el esquema de Mongoose
const categoriaSchema = new mongoose.Schema({
  id: {
    type: String,
    default: function() {
      // Genera un valor único utilizando una combinación de tiempo y un identificador único
      const timestamp = new Date().getTime().toString(16); // parte de tiempo en hexadecimal
      const uniqueId = Math.random().toString(16).substr(2); // identificador único aleatorio
      return timestamp + uniqueId;
    },
    unique: true, // Asegura que cada _id sea único
  },
  nombre: String
});

// Exporta el modelo
module.exports = mongoose.model('Categoria', categoriaSchema);