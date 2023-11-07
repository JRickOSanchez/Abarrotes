const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const secretKey = process.env.SECRET_KEY || 'tu-secreto-seguro'; // Usa una clave predeterminada si no hay una configurada
    const tokenWithoutBearer = token.split(" ")[1]; // Extraer el token sin "Bearer"
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);

    // Puedes acceder a los datos del token, por ejemplo, el ID de usuario
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verifyToken;