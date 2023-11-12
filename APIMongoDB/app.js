const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

//MongoDB
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEFAULT;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

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
const transaccioninventarioRoutes = require('./routes/transacciones');
const comprasRoutes = require('./routes/compras');
const usuariosRoutes = require('./routes/usuarios');
const ventasRoutes = require('./routes/ventas');
app.use('/abarrotes', abarrotesRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/transacciones', transaccioninventarioRoutes);
app.use('/compras', comprasRoutes);
app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/ventas', ventasRoutes);



// Middleware de rutas para la autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Middleware de rutas protegidas
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/protegido', protectedRoutes);

// Middleware de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});