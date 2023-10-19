const express = require('express');
const app = express();

// Middleware para analizar JSON
app.use(express.json());

// Middleware de rutas para el abarrotes
const abarrotesRoutes = require('./routes/abarrotes');
app.use('/abarrotes', abarrotesRoutes);

// Middleware de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
