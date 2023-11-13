const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');
const Usuario = require('../models/usuario');

// Registro de usuario
const registrar = async (req, res) => {
  try {
    const name = req.body.name;
    const user = req.body.user;
    const pass = req.body.pass;
    const passHash = await bcryptjs.hash(pass, 8);

    // Crea un nuevo usuario utilizando el modelo
    await Usuario.create({ username: user, password: passHash, rol: 'usuario' });

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

// Inicio de sesión
const iniciarSesion = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;

    // Busca el usuario en la base de datos
    const resultado = await Usuario.findOne({ username: user });

    if (!resultado || !(await bcryptjs.compare(pass, resultado.password))) {
      // Manejar inicio de sesión inválido
    } else {
      // Manejar inicio de sesión exitoso
    }
  } catch (error) {
    console.log(error);
  }
};

// Middleware de autenticación
const estaAutenticado = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificado = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);

      // Busca el usuario en la base de datos
      const usuario = await Usuario.findOne({ _id: decodificado.id });

      if (!usuario) {
        return next();
      }

      req.usuario = usuario;
      return next();
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect('/iniciar-sesion');
  }
};

module.exports = exports;