const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const generateUniqueId = require('./generateUniqueId');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '..', 'data'); // Ajusta '..' según la estructura de tu proyecto
const filePath7 = path.join(dataPath, 'usuarios.json');
const secretKey = process.env.SECRET_KEY || 'tu-secreto-seguro'; // Utiliza variables de entorno para secretos

const expiresIn = 60; // 60 segundos (1 minuto)

// Archivo de datos de usuarios
let usuariosData = [];

exports.addData = (data) => {
 usuariosData.push(data);
};

// Lee el archivo de usuarios si existe
if (fs.existsSync(filePath7)) {
  const usuariosDataFromFile = fs.readFileSync(filePath7, 'utf-8');
  usuarios = JSON.parse(usuariosDataFromFile);
}

const generateToken = (userId) => {
  return jwt.sign({ user: userId }, secretKey, { expiresIn });
};

const addData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.getAllUsuarios = async (req, res) => {
  try {
     res.json(usuariosData);
  } catch (error) {
     console.error('Error al obtener usuarios:', error);
     res.status(500).json({ error: 'Error interno del servidor' });
  }
 };

 exports.getUsuarioById = (req, res) => {
  const usuarioId = parseInt(req.params.id);

  try {
    // Lógica para buscar el usuario por ID en el array cargado
    const foundUsuario = usuarios.find(usuario => usuario.id === usuarioId.toString());

    if (!foundUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(foundUsuario);
  } catch (error) {
    console.error('Error al leer el archivo de usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.addUsuario = (req, res) => {
  const { username, password, rol } = req.body;

  // Validar los datos del usuario
  const requiredProperties = ['username', 'password', 'rol'];
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!username || !password || !rol) {
    return res.status(400).json({ error: 'Datos incompletos para el usuario' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const nuevoUsuario = {
    id: uniqueId,
    username,
    password,
    rol,
  };

  try {
    // Función para guardar el usuario
    usuarios.push(nuevoUsuario);
    addData(filePath7, usuarios);

    // Generar el token JWT
    const token = generateToken(uniqueId);

    // Devolver el usuario agregado y el token
    res.status(201).json({ usuario: nuevoUsuario, token });
    return;
  } catch (error) {
    console.error('Error al agregar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateUsuario = (req, res) => {
  const usuarioId = req.params.id;
  const updatedData = req.body;

  // Buscar el índice del usuario por ID
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === usuarioId);

  // Verificar si el usuario existe
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Validar y actualizar los datos del usuario
  usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...updatedData };

  // Escribir el array actualizado de usuarios de nuevo al archivo
  addData(filePath7, usuarios);

  // Devolver el usuario actualizado
  res.json({ success: true, message: 'Usuario actualizado correctamente', usuario: usuarios[usuarioIndex] });
};

exports.deleteUsuario = (req, res) => {
  const usuarioId = req.params.id;

  // Buscar el índice del usuario por ID
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === usuarioId);

  // Verificar si el usuario existe
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Lógica para eliminar el usuario del array
  usuarios.splice(usuarioIndex, 1);

  // Escribir el array actualizado de usuarios en el archivo
  addData(filePath7, usuarios);

  // Devolver un mensaje de éxito
  res.json({ success: true, message: 'Usuario eliminado correctamente' });
};