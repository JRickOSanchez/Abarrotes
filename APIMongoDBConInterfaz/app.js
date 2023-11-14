require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtHandler = require('./routes/jwt-handler'); // Ajusta la ruta según tu estructura de archivos
const authRoutes = require('./routes/authRoutes');
const abarrotesRoutes = require('./routes/abarrotes');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const proveedoresRoutes = require('./routes/proveedores');
const transaccioninventarioRoutes = require('./routes/transaccioninventario');
const comprasRoutes = require('./routes/compra');
const usuariosRoutes = require('./routes/usuarios');
const ventasRoutes = require('./routes/venta');
const generateTokenRoute = require('./routes/generateTokenRoute');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

// Configuración de Express y middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');

// Carpeta public para archivos estáticos
app.use(express.static('public'));

// Middleware para analizar JSON
app.use(express.json());

// Configuración de las variables de entorno
mongoose.connect(process.env.MONGODB_URI_DEFAULT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
  process.exit(1);
});

db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

// Middleware de rutas para el abarrotes
app.use('/abarrotes', abarrotesRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/transacciones', transaccioninventarioRoutes);
app.use('/compras', comprasRoutes);
app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/ventas', ventasRoutes);

// Middleware de rutas para la autenticación
app.use('/auth', authRoutes);

// Middleware de rutas protegidas
app.use('/protegido', protectedRoutes);

// Llamada al router principal
app.use('/', require('./routes/router'));

// Middleware para evitar el almacenamiento en caché
app.use(function (req, res, next) {
  if (!req.user) res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

// Middleware para verificar y decodificar el token
app.use(function (req, res, next) {
  const token = req.header('Authorization');

  if (token) {
    const tokenWithoutBearer = token.split(" ")[1];
    try {
      const secretKey = process.env.SECRET_KEY || 'tu-secreto-seguro';
      const decoded = jwt.verify(tokenWithoutBearer, secretKey);
      req.user = decoded;
    } catch (error) {
      console.error('Error al verificar el JWT:', error);
    }
  }

  next();
});

// Monta el manejador JWT en la aplicación principal
app.use('/jwt', jwtHandler);

// Middleware de rutas para generar un token sin autenticación
app.use('/', generateTokenRoute);

// Middleware de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

module.exports = app;