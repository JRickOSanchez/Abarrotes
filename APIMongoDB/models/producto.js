const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  nombre: String,
  descripcion: String,
  codigoBarras: String,
  precioCompra: Number,
  precioVenta: Number,
  existencias: Number,
  proveedor: String,
  categoria: String,
});

const Producto = mongoose.model('Producto', productoSchema);

const addProduct = async (req, res) => {
  try {
    // Obtén los datos del producto desde la solicitud (req.body u otros)
    const { id, otrosCampos } = req.body;

    // Crea una nueva instancia del modelo Producto
    const nuevoProducto = new Producto({
      id: id, // Asegúrate de proporcionar un valor único para el campo 'id'
      otrosCampos: otrosCampos, // Ajusta según tus campos
    });

    // Guarda el nuevo producto en la base de datos
    const productoGuardado = await nuevoProducto.save();

    // Envía una respuesta de éxito
    res.json(productoGuardado);
  } catch (error) {
    // Maneja los errores, envía una respuesta de error
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
};

module.exports = { Producto, addProduct };