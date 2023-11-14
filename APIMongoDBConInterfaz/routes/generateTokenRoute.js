const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const expiresIn = 60; // tiempo de expiración del token en segundos
    const payload = { entityId: 'someId', entity: 'someEntity' };

    // Genera un token sin necesidad de autenticación
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    res.json({ token });
    console.log('Token generado:', token);
  } catch (error) {
    console.error('Error al generar el JWT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/generateToken', (req, res) => {
  try {
    // Lógica para generar el token
    const userId = 'someUserId'; // Reemplaza esto con tu lógica

    // Configura la información que deseas incluir en el token
    const payload = {
      userId: userId,
      // Puedes incluir más información aquí si es necesario
    };

    // Configura la clave secreta para firmar el token
    const secretKey = 'tu-secreto-seguro'; // Reemplaza con una clave secreta fuerte

    // Configura las opciones del token (puedes ajustar según tus necesidades)
    const options = {
      expiresIn: '1h', // Tiempo de expiración del token
    };

    // Genera el token
    const jwtToken = jwt.sign(payload, secretKey, options);

    res.json({ jwtToken });
  } catch (error) {
    console.error('Error al generar el JWT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;