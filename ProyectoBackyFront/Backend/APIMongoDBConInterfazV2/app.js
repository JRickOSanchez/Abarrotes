const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const router = express.Router();
const productoController = require('./controllers/productoController');
const Producto = require('./models/producto');
const Categoria = require('./models/categoria');
const app = express();

//Configuracion HTML

router.get('/tabla', productoController.renderTabla);

app.post('/productos/editar/:id', async (req, res) => {
  const productId = req.params.id;
  const newData = req.body;

  try {
      // Aquí está la lógica para actualizar el producto en la base de datos
      const editarProducto = await Producto.find({id: productId }, newData, { new: true });
      res.json(editarProducto);
  } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/categorias/editar/:id', async (req, res) => {
  const categoryId = req.params.id;
  const newData = req.body;

  try {
      // Aquí está la lógica para actualizar la categoría en la base de datos
      const editarCategoria = await Categoria.findOneAndUpdate(
        { id: categoryId },
        newData,
        { new: true }
      );

      // Verifica si la categoría fue encontrada y actualizada
      if (!editarCategoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      res.json(editarCategoria);
  } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Configuracion HTML

// Configuración de Express y middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Configurar la carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');

// Carpeta public para archivos estáticos
app.use(express.static('public'));

// Configuración de las variables de entorno
dotenv.config({ path: './env/.env' });

// MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/Abarrotes';

mongoose.connect(mongoURI, {
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

  // Middleware para evitar el almacenamiento en caché
  app.use(function (req, res, next) {
    if (!req.user) res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
  });

  // Middleware de rutas para el abarrotes
  const productosRoutes = require('./routes/productos');
  const categoriasRoutes = require('./routes/categorias');
  const proveedoresRoutes = require('./routes/proveedores');
  const transaccioninventarioRoutes = require('./routes/transaccioninventario');
  const comprasRoutes = require('./routes/compra');
  const usuariosRoutes = require('./routes/usuarios');
  const ventasRoutes = require('./routes/venta');
  app.use('/categorias', categoriasRoutes);
  app.use('/proveedores', proveedoresRoutes);
  app.use('/transacciones', transaccioninventarioRoutes);
  app.use('/compras', comprasRoutes);
  app.use('/productos', productosRoutes);
  app.use('/usuarios', usuariosRoutes);
  app.use('/ventas', ventasRoutes);
  app.use('/', proveedoresRoutes);

  // Middleware de rutas para la autenticación
  const authRoutes = require('./routes/authRoutes');
  app.use('/auth', authRoutes);

  // Middleware de rutas protegidas
  const protectedRoutes = require('./routes/protectedRoutes');
  app.use('/protegido', protectedRoutes);

  // Llamada al router principal
  app.use('/', require('./routes/authRoutes'));

  // Middleware de errores
  const errorHandler = require('./middlewares/errorHandler');
  app.use(errorHandler);

  // Puerto de escucha
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
  });
});