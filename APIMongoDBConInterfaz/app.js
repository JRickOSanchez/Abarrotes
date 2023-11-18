require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const db = require('./database/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/auth', authRoutes);

// Configuración de Express y middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('MONGODB_URI_DEFAULT:', process.env.MONGODB_URI_DEFAULT);

// Log de las variables de entorno
console.log('MONGODB_URI_DEFAULT:', process.env.MONGODB_URI_DEFAULT);

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');

// Carpeta public para archivos estáticos
app.use(express.static('public'));

// Middleware para procesar datos desde formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de las variables de entorno
dotenv.config({ path: './env/.env' });

// Middleware para trabajar con cookies
app.use(cookieParser());

//MongoDB

const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEFAULT;

if (!mongoURI) {
  console.error('Error: MONGODB_URI o MONGODB_URI_DEFAULT no están definidos en el archivo .env');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
});

db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

module.exports = db;
//MongoDB

// Middleware para analizar JSON
app.use(express.json());

// Middleware de rutas para el abarrotes
const abarrotesRoutes = require('./routes/abarrotes');//Por ahorita esta general porque aqui se estaban haciendo todas las entidades
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const proveedoresRoutes = require('./routes/proveedores');
const transaccioninventarioRoutes = require('./routes/transaccioninventario');
const comprasRoutes = require('./routes/compra');
const usuariosRoutes = require('./routes/usuarios');
const ventasRoutes = require('./routes/venta');
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
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/protegido', protectedRoutes);

// Llamada al router principal
app.use('/', require('./routes/router'));

// Middleware para evitar el almacenamiento en caché
app.use(function (req, res, next) {
  if (!req.user) res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

// Middleware de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});