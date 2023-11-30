const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware para verificar el token en rutas protegidas
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verifica y decodifica el token JWT utilizando la clave secreta
    const secretKey = process.env.SECRET_KEY; // Obtén la clave secreta de las variables de entorno
    const tokenWithoutBearer = token.split(" ")[1]; // Extraer el token sin "Bearer"
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);

    // Puedes acceder a los datos del token, por ejemplo, el ID de usuario
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Ruta protegida que requiere un token JWT válido
router.get('/', verifyToken, (req, res) => {
  // Ejemplo de respuesta con el ID de usuario del token
  res.json({ mensaje: 'Esta es una ruta protegida por JWT', usuario: req.userId });
});

module.exports = router;
