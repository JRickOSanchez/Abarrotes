const express = require('express');
const app = express();

// Cargar variables de entorno desde el archivo .env
const dotenv = require('dotenv');
dotenv.config();

// Middleware para analizar JSON
app.use(express.json());

// Middleware de rutas para el abarrotes
const abarrotesRoutes = require('./routes/abarrotes');
app.use('/abarrotes', abarrotesRoutes);

// Middleware de rutas para la autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Middleware de rutas protegidas
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/protegido', protectedRoutes);

// Middleware de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
