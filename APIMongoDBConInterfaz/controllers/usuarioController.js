const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const generateUniqueId = require('./generateUniqueId');
const Usuario = require('../models/usuario');
const { v4: uuidv4 } = require('uuid');

const dataPath = './data/';
const filePath = path.join(dataPath, 'usuarios.json');

const usuariosDataFromFile = fs.readFileSync(filePath, 'utf-8');
const usuarios = JSON.parse(usuariosDataFromFile);
const secretKey = process.env.SECRET_KEY || 'tu-secreto-seguro';
const expiresIn = 60; // 60 segundos (1 minuto)

const generateToken = (userId) => {
  return jwt.sign({ user: userId }, secretKey, { expiresIn });
};

const addData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getUsuarioById = async (req, res) => {
  const usuarioId = req.params.id;

  try {
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al buscar el usuario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.addUsuario = async (req, res) => {
  try {
    const { username, password, rol } = req.body;

    if (!username || !password || !rol) {
      return res.status(400).json({ error: 'Datos incompletos para el usuario' });
    }

    const uniqueId = generateUniqueId();

    const nuevoUsuario = new Usuario({
      id: uniqueId,
      username,
      password,
      rol,
    });

    // Intenta guardar el usuario
    await nuevoUsuario.save();

    // Si llegamos aquí, el usuario se ha guardado correctamente
    const token = generateToken(uniqueId);

    res.status(201).json({ usuario: nuevoUsuario, token });
  } catch (error) {
    console.error('Error al agregar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const updatedData = req.body;

    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { id: usuarioId },
      { $set: updatedData },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const usuarioEliminado = await Usuario.findByIdAndDelete(usuarioId);

    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.authenticateUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Usuario y contraseña recibidos:', username, password);

    // Verifica si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ username });

    console.log('Usuario encontrado en la base de datos:', usuario);

    if (!usuario) {
      return res.status(401).json({ error: 'Nombre de usuario y/o contraseña incorrectos' });
    }

    // Verifica la contraseña
    const passwordValid = await bcrypt.compare(password, usuario.password);

    console.log('Contraseña válida:', passwordValid);

    if (!passwordValid) {
      return res.status(401).json({ error: 'Nombre de usuario y/o contraseña incorrectos' });
    }

    // Genera el token JWT
    const token = generateToken(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};