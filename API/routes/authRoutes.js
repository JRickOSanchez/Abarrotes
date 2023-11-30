const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Cargar la clave secreta desde las variables de entorno
const secretKey = process.env.SECRET_KEY;

// Ruta al archivo JSON con los usuarios
const dataPath = './data/';
const filePath7 = path.join(dataPath, 'usuarios.json');

// Lee los usuarios desde el archivo JSON
const users = JSON.parse(fs.readFileSync(filePath7, 'utf8'));

// Ruta para autenticar y obtener un token JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Configura la duración de 1 minutos en segundos
  const expiresIn = 60; // 60 segundos (1 minuto)

  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn });

  res.json({ token });
  console.log(token);
});

module.exports = router;