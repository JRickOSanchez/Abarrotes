require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const app = express();
const bcrypt = require('bcrypt');

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
dotenv.config({ path: './env/.env' });

// Middleware para trabajar con cookies
app.use(cookieParser());

// MongoDB
const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEFAULT;

if (!mongoURI) {
  console.error('Error: MONGODB_URI o MONGODB_URI_DEFAULT no están definidos en el archivo .env');
  process.exit(1);
}

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
});

module.exports = db;

// Middleware para analizar JSON
app.use(express.json());

// Middleware de rutas para el abarrotes
const abarrotesRoutes = require('./routes/abarrotes');
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
app.use('/', require('./routes/authRoutes'));

// Middleware para evitar el almacenamiento en caché
app.use(function (req, res, next) {
  if (!req.user) res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await Usuario.findOne({ username });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await Usuario.create({
      username,
      password: encryptedPassword,
      rol: "usuario",
    });

    const secretKey = process.env.SECRET_KEY || 'valor_predeterminado_si_no_se_encuentra';
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

    const verifiedJWT = verificarJWT(token, secretKey);

    console.log('Información del JWT verificado:', verifiedJWT);

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor: " + err.message);
  }
});

// Middleware de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});