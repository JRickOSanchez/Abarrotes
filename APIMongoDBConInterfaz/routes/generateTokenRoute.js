// generateTokenRoute.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const expiresIn = 60;
    const payload = { entityId: 'someId', entity: 'someEntity' };

    const token = jwt.sign(payload, 'tu-secreto-seguro', { expiresIn });

    res.json({ token });
    console.log('Token generado:', token);
  } catch (error) {
    console.error('Error al generar el JWT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;