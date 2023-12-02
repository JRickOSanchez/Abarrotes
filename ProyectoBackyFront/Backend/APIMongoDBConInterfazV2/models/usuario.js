// models/usuario.js
// Módulo para Usuarios
const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema({
  id: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    default: 'usuario',
  },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;