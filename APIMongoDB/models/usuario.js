// models/usuario.js
// Módulo para Usuarios
class Usuario {
    constructor(id, username, password, rol) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.rol = rol;
    }
  }
  
  module.exports = Usuario;