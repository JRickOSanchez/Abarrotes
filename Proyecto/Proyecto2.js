const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/Proyecto2')

mongoose.connection.on('open', _ => {
    console.log("Se ha conectado");
})

const Schema = mongoose.Schema;

// Definir el esquema para Producto
const productoSchema = new Schema({
    Nombre: String,
    Descripcion: String,
    CodigoBarras: String,
    PrecioCompra: Number,
    PrecioVenta: Number,
    Existencias: Number,
    Proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    Categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' }
});

const categoriaSchema = new Schema({
    Nombre: String
});

const proveedorSchema = new Schema({
    Nombre: String,
    Contacto: String
});

const compraSchema = new Schema({
    Proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    Fecha: Date,
    ProductosComprados: [{ type: Schema.Types.ObjectId, ref: 'Producto' }]
});

const ventaSchema = new Schema({
    Cliente: String,
    FechaVenta: Date,
    ProductosVendidos: [{ type: Schema.Types.ObjectId, ref: 'Producto' }]
});

const usuarioSchema = new Schema({
    Nombre: String,
    Password: String,
    Rol: String
});

const transaccionSchema = new Schema({
    Tipo: String,
    Producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
    Cantidad: Number,
    Fecha: Date
});

// Crear modelos para cada esquema
const Producto = mongoose.model('Producto', productoSchema);
const Categoria = mongoose.model('Categoria', categoriaSchema);
const Proveedor = mongoose.model('Proveedor', proveedorSchema);
const Compra = mongoose.model('Compra', compraSchema);
const Venta = mongoose.model('Venta', ventaSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Transaccion = mongoose.model('Transaccion', transaccionSchema);

// // Crear Nuevo Usario
// // INSERT INTO Usario (nomnbre, correo, edad) VALUES ('Pedro', 'pedro@ejemplo.com', 20)
// // Pasarle los datos del esquema al modelo que se esta instanciando, en este caso es Usario
// const nuevoUsuario = new Usuario({ nombre: 'Pedro', correo: 'pedro@ejemplo.com', edad: 20 });
// //save va a guardar la informacón dentro de la colección.
// nuevoUsuario.save((err) => {
//   if (err) return console.error(err);
//   console.log('Usuario creado exitosamente');
// });

// // Busca todos los documentos en la colección Usuario
// // SELECT * FROM Usuarios
// Usuario.find({}, (err, usuarios) => {
//     if (err) return console.error(err);
//     console.log('Usuarios:', usuarios);
//   });

// // Busca todos los documentos en la colección Usuario donde nombre sea igual a Carlos
// // // SELECT * FROM Usuarios WHERE Nombre = "Carlos"
// Usuario.find({nombre: 'Carlos'}, (err, usuarios) => {
//     if (err) return console.error(err);
//     console.log('Usuarios:', usuarios);
//   });


// // Busca todos los documentos en la colección Usuario donde nombre sea igual a Carlos, y se trae el primero que encuantra en la colección
// // SELECT * FROM Usuarios WHERE Nombre = "Carlos" limit 1
// Usuario.findOne({nombre: 'Carlos'}, (err, usuarios) => {
//     if (err) return console.error(err);
//     console.log('Usuarios:', usuarios);
//   });

// Actualizar el nombre de 'Carlos' a 'Alberto', primero encuentra el documento donde el nombre sea Carlos y le actualiza el nombre a Alberto
// Usuario.findOneAndUpdate({ nombre: 'Carlos' }, { nombre: 'Alberto' }, { new: true }, (err, usuarioActualizado) => {
//   if (err) return console.error(err);
//   if (usuarioActualizado) {
//     console.log('Usuario actualizado:', usuarioActualizado);
//   } else {
//     console.log('Usuario no encontrado');
//   }
// });

// Actualizar el nombre de 'Carlos' a 'Alberto', primero encuentra el documento donde el nombre sea Carlos y le actualiza el nombre a Alberto
// Usuario.updateOne({ nombre: 'Alberto' }, { edad: 32 }, { new: true }, (err, usuarioActualizado) => {
//   if (err) return console.error(err);
//   if (usuarioActualizado) {
//     console.log('Usuario actualizado:', usuarioActualizado);
//   } else {
//     console.log('Usuario no encontrado');
//   }
// });

// Realiza un update al primer documento que encuantro en este caso con el nombre de Jorge, posterior, actualiza la edad en este caso a 50
  // Usuario.updateOne({ nombre: 'Jorge' }, { $set: { edad: 50 } }, (err, resultado) => {
  //   if (err) return console.error(err);
  //   console.log('Usuario actualizado');
  // });

  //  Realiza una actualización a TODOS los documentos en donde el nombre sea Jorge y actualiza la edad en esos documentos a 20
  // Usuario.updateMany({ nombre: 'Jorge' }, { $set: { edad: 20 } }, (err, resultado) => {
  //   if (err) return console.error(err);
  //   console.log('Usuarios actualizado');
  // });
  
  // Elimina el primer documento que encuentra y lleva por nombre Pedro
  // Usuario.deleteOne({ nombre: 'Pedro' }, (err) => {
  //   if (err) return console.error(err);
  //   console.log('Usuario eliminado');
  // });

  // Eliminar a todos los que lleven por nombre Jorge
  //   Usuario.deleteMany({ nombre: 'Jorge' }, (err) => {
  //   if (err) return console.error(err);
  //   console.log('Usuarios eliminados');
  // });
