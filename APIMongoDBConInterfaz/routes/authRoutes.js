const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Cargar la clave secreta desde las variables de entorno
const secretKey = process.env.SECRET_KEY;

// Ruta para autenticar y obtener un token JWT
router.post('/login', (req, res) => {
  const { entity, entityId, secret } = req.body;

  // Aquí puedes agregar lógica adicional para autenticar diferentes entidades basándote en entity y entityId

  // Ejemplo: Validar el secreto para una entidad específica
  if (secret !== 'tu-secreto-seguro') {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Configura la duración de 1 minutos en segundos
  const expiresIn = 60; // 60 segundos (1 minuto)

  // Crea un payload personalizado según la entidad
  const payload = { entityId, entity };

  const token = jwt.sign(payload, secretKey, { expiresIn });

  res.json({ token });
  console.log('Token generado:', token);
});

module.exports = router;