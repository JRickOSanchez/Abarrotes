// models/usuario.js
// Módulo para Usuarios
const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;