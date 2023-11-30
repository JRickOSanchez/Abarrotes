const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const dataPath = './data/';
const filePath7 = path.join(dataPath, 'usuarios.json');
const secretKey = 'tu-secreto-seguro';

// Archivo de datos de usuarios
const usuariosDataFromFile = fs.readFileSync(filePath7, 'utf-8');
let usuarios = JSON.parse(usuariosDataFromFile);

const addData = (filePath, data) => {
  // Función para agregar datos al archivo
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const generateToken = (userId) => {
  // Generar el token JWT
  return jwt.sign({ user: userId }, secretKey, { expiresIn: 60 }); // 60 segundos (1 minuto)
};

router.get('/', (req, res) => {
  // Obtén el token directamente desde el encabezado
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verifica y decodifica el token JWT utilizando la clave secreta
    const secretKey = process.env.SECRET_KEY || 'tu-secreto-seguro'; // Usa una clave predeterminada si no hay una configurada
    const tokenWithoutBearer = token.split(" ")[1] || token; // Extraer el token sin "Bearer"
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);

    // Puedes acceder a los datos del token, por ejemplo, el ID de entidad
    req.entityId = decoded.user;
    verifyToken(req, res, () => {
      // Ejemplo de respuesta con el ID de entidad del token
      res.json({ mensaje: 'Esta es una ruta protegida por JWT', entityId: req.entityId });
    });
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    res.status(401).json({ error: 'Token inválido' });
  }
});

router.post('/agregar-usuario', (req, res) => {
  const { username, password, rol } = req.body;

  // Validar los datos del usuario
  const requiredProperties = ['username', 'password', 'rol'];

  // Excluir 'id' de la validación
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
    const token = generateToken(nuevoUsuario.id);

    // Devolver el usuario agregado y el token
    res.status(201).json({ usuario: nuevoUsuario, token });
    return;
  } catch (error) {
    console.error('Error al agregar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;