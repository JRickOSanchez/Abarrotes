const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Ruta para generar JWT
app.post('/generar-jwt', (req, res) => {
  const userId = req.body.userId;
  const jwtToken = generateJWT(userId);
  res.json({ jwtToken });
});

// Ruta para verificar JWT
app.post('/verificar-jwt', (req, res) => {
  const userId = req.body.userId;
  const jwtToken = req.body.jwtToken;
  const isValid = verifyJWT(userId, jwtToken);
  res.json({ isValid });
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