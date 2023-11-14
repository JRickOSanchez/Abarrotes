const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Usuario = require('../models/usuario');

const secretKey = process.env.SECRET_KEY || 'tu-secreto-seguro';

// Lógica de autenticación (ejemplo básico, ajusta según tus necesidades)
const authenticateUser = async (username, password) => {
  try {
    const usuario = await Usuario.findOne({ username, password });
    return usuario;
  } catch (error) {
    throw error;
  }
};

// Ruta para manejar el formulario de inicio de sesión protegido
router.post('/login/protected', async (req, res) => {
  // Obtén el usuario y la contraseña del cuerpo de la solicitud
  const { user, pass } = req.body;

  try {
    // Verifica las credenciales del usuario
    const usuario = await authenticateUser(user, pass);

    if (usuario) {
      // Si las credenciales son válidas, genera un token JWT
      const expiresIn = 60;
      const payload = { entityId: usuario._id, entity: usuario.username };
      const token = jwt.sign(payload, secretKey, { expiresIn });

      // Devuelve el token como respuesta
      res.json({ token });
    } else {
      // Si las credenciales no son válidas, devuelve un mensaje de error
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;