const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1/Proyecto2');

// Modelos de documento
const Producto = mongoose.model("Producto", {
  IDProd: Number,
  Nombre: String,
  Descripción: String,
  Precio: Number,
  Proveedor: String,
  Categoria: String,
});
const Usuario = mongoose.model("Usuario", {
  IDUsuario: Number,
  Nombre: String,
  Rol: String,
  Contraseña: String,
});
const Transaccion = mongoose.model("Transaccion", {
  IDTransaccion: Number,
  Tipo: String,
  Producto: { type: mongoose.ObjectId, ref: "Producto" },
  Cantidad: Number,
  Fecha: Date,
  Venta: Boolean,
});

// Módulo
module.exports = {
  // Registrar un documento
  registrar(modelo, datos) {
    return modelo.create(datos);
  },

  // Actualizar un documento
  actualizar(modelo, id, datos) {
    return modelo.findByIdAndUpdate(id, datos, { new: true });
  },

  // Borrar un documento
  borrar(modelo, id) {
    return modelo.findByIdAndDelete(id);
  },

  // Listar todos los documentos
  listar(modelo) {
    return modelo.find({});
  },

  // Listar un documento por id
  listarPorId(modelo, id) {
    return modelo.findById(id);
  },
};

// Conectar a la base de datos MongoDB
mongoose
  .connect("mongodb://127.0.0.1/Proyecto", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });