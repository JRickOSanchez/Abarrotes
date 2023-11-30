module.exports = (err, req, res, next) => {

  // Verificar si ya se ha enviado una respuesta
  if (res.headersSent) {
    return next(err);
  }

  // Enviar una respuesta JSON con detalles del error
  res.status(500).json({ error: 'Error interno del servidor', details: err.message });
};