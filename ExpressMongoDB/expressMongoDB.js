const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

//MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/ProyectoExpress')
const { Schema } = mongoose;
const { Types: { ObjectId } } = mongoose;

mongoose.connection.on('open', _ => {
    console.log("Se ha conectado");
})

// Esquema para Productos
const productoSchema = new Schema({
  nombre: String,
  descripcion: String,
  codigoBarras: String,
  precioCompra: Number,
  precioVenta: Number,
  existencias: Number,
  proveedor: ObjectId,
  categoria: ObjectId
});

// Esquema para Categorías
const categoriaSchema = new Schema({
  nombre: String
});

// Esquema para Proveedores
const proveedorSchema = new Schema({
  nombre: String,
  contacto: {
    telefono: String,
    correoElectronico: String,
    direccion: String
  }
});

// Esquema para Compras
const compraSchema = new Schema({
  proveedor: ObjectId,
  fechaCompra: Date,
  productosComprados: [
    {
      producto: ObjectId,
      cantidad: Number,
      precioCompra: Number,
      total: Number
    }
  ]
});

// Esquema para Ventas
const ventaSchema = new Schema({
  cliente: {
    nombre: String,
    direccion: String,
    telefono: String,
    correoElectronico: String
  },
  fechaVenta: Date,
  productosVendidos: [
    {
      producto: ObjectId,
      cantidad: Number,
      precioVenta: Number,
      total: Number
    }
  ]
});

// Esquema para Usuarios
const usuarioSchema = new Schema({
  nombreUsuario: String,
  contrasena: String,
  rol: String
});

// Esquema para Transacciones de Inventario
const transaccionInventarioSchema = new Schema({
  tipoTransaccion: String,
  producto: ObjectId,
  cantidad: Number,
  fechaTransaccion: Date
});

// Modelos basados en los esquemas
const Producto = mongoose.model('Producto', productoSchema);
const Categoria = mongoose.model('Categoria', categoriaSchema);
const Proveedor = mongoose.model('Proveedor', proveedorSchema);
const Compra = mongoose.model('Compra', compraSchema);
const Venta = mongoose.model('Venta', ventaSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);
const TransaccionInventario = mongoose.model('TransaccionInventario', transaccionInventarioSchema);

module.exports = {
  Producto,
  Categoria,
  Proveedor,
  Compra,
  Venta,
  Usuario,
  TransaccionInventario
};
//MongoDB

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Operaciones CRUD para el modelo Producto
// Registrar un nuevo producto
app.post('/api/productos', async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear un producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id);
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener un producto por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar un producto por ID
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true });
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar un producto por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Borrar un producto por ID
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Producto.findByIdAndDelete(id);
    res.send('Producto eliminado correctamente');
  } catch (error) {
    console.error('Error al borrar un producto por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para leer y mostrar el contenido de un archivo JSON
app.get('/api/leer-archivo-json', async (req, res) => {
  try {
    const rutaArchivo = 'D:/Materias/2/Abarrotes/Abarrotes2/Abarrotes/ExpressMongoDB/Proyecto.json';
    const jsonData = fs.readFileSync(rutaArchivo, 'utf-8');
    const parsedData = JSON.parse(jsonData);

   // Guarda los datos en MongoDB usando Mongoose
try {
  // Convertir los valores a los tipos de datos correctos
  parsedData.productos.forEach(producto => {
    producto.precioCompra = Number(producto.precioCompra) || 0;  // Asigna 0 si no es un número válido
    producto.precioVenta = isNaN(producto.precioVenta) ? 0 : Number(producto.precioVenta);
    producto.existencias = isNaN(producto.existencias) ? 0 : Number(producto.existencias);
    producto.proveedor = mongoose.Types.ObjectId.isValid(producto.proveedor) ? new mongoose.Types.ObjectId(producto.proveedor) : null;
    producto.categoria = mongoose.Types.ObjectId.isValid(producto.categoria) ? new mongoose.Types.ObjectId(producto.categoria) : null;
    // Verificar y crear instancias de ObjectId solo si el valor es válido
    if (/^[0-9a-fA-F]{24}$/.test(producto.proveedor)) {
      producto.proveedor = new mongoose.Types.ObjectId(producto.proveedor);
    }

    if (/^[0-9a-fA-F]{24}$/.test(producto.categoria)) {
      producto.categoria = new mongoose.Types.ObjectId(producto.categoria);
    }
  });

  await Producto.create(parsedData.productos.map(producto => {
    // Excluye el campo _id
    const { _id, ...productoData } = producto;
    return productoData;
  }));
      // Repite el proceso para otros modelos según sea necesario
      console.log('Datos JSON recibidos y guardados en MongoDB:', parsedData);
      res.json(parsedData);
    } catch (error) {
      console.error('Error al crear documentos en MongoDB:', error);
      res.status(500).send('Error interno del servidor');
    }
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para manejar solicitudes GET en la raíz
app.get('/', (req, res) => {
    res.send('¡Hola! Este es el servidor Express.');
  });

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});


