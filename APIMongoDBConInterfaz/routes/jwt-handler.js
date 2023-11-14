const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Agrega la importación de cors

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Agrega el middleware de cors

// Ruta para generar JWT
app.post('/generar-jwt', async (req, res) => {
  try {
    // Lógica para generar el JWT (sustituye esto con tu propia lógica)
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
    // Lógica para verificar el JWT (sustituye esto con tu propia lógica)
    const userId = req.body.userId;
    const jwtToken = req.body.jwtToken;
    const isValid = verifyJWT(userId, jwtToken);
    res.json({ isValid });
  } catch (error) {
    console.error('Error al verificar el JWT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

function generateJWT(userId) {
  // Lógica para generar el JWT (puedes usar librerías como jsonwebtoken)
  const jwtToken = '...'; // reemplaza con tu propia lógica
  return jwtToken;
}

function verifyJWT(userId, jwtToken) {
  // Lógica para verificar el JWT (puedes usar librerías como jsonwebtoken)
  const isValid = true; // reemplaza con tu propia lógica
  return isValid;
}

module.exports = app;