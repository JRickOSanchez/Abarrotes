module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Verificar si ya se ha enviado una respuesta
  if (res.headersSent) {
      return next(err);
  }

  res.status(500).send('Error en el servidor');
};