const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Agrega la importación de cors

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const secretKey = process.env.SECRET_KEY || 'defaultSecretKey';

// Ruta para generar JWT
app.post('/generar-jwt', async (req, res) => {
  try {
    // Lógica para generar el JWT
    const userId = req.body.userId;
    const jwtToken = generateJWT(userId);
    res.json({ jwtToken });
  } catch (error) {
    console.error('Error al generar el JWT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para verificar JWT
app.post('/verificar-jwt', async (req, res) => {
  try {
    // Lógica para verificar el JWT
    const userId = req.body.userId;
    const jwtToken = req.body.jwtToken;
    const isValid = verifyJWT(userId, jwtToken);
    res.json({ isValid });
  } catch (error) {
    console.error('Error al verificar el JWT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Función para generar el JWT
function generateJWT(userId) {
  const expiresIn = '1h'; // El token expirará en 1 hora (puedes ajustar esto)
  const payload = { userId };
  const jwtToken = jwt.sign(payload, secretKey, { expiresIn });
  return jwtToken;
}

// Función para verificar el JWT
function verifyJWT(userId, jwtToken) {
  try {
    const decoded = jwt.verify(jwtToken, secretKey);
    // Verifica si el userId del token coincide con el proporcionado
    return decoded.userId === userId;
  } catch (error) {
    // Maneja errores de verificación (puede ser un token inválido o expirado)
    console.error('Error al verificar el JWT:', error.message);
    return false;
  }
}

module.exports = app;