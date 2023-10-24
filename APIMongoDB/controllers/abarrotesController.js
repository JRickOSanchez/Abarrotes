const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Producto, addProduct } = require('../models/producto');
const { Categoria, CategoriaClass } = require('../models/categoria');
const Proveedor = require('../models/proveedor');
const ProveedorModel = require('../models/proveedor');
const { CompraModel } = require('../models/compra');
const { VentaModel } = require('../models/venta');
const Usuario = require('../models/usuario');
const TransaccionInventario = require('../models/transaccioninventario');
const generateUniqueId = require('./generateUniqueId');
const dataPath = './data/';
const filePath = path.join(dataPath, 'productos.json');
const filePath2 = path.join(dataPath, 'proveedores.json');
const filePath3 = path.join(dataPath, 'categorias.json');
const filePath4 = path.join(dataPath, 'compra.json');
const filePath5 = path.join(dataPath, 'venta.json');
const filePath6 = path.join(dataPath, 'transacciones.json');
const filePath7 = path.join(dataPath, 'usuarios.json');


const readAllJsonFiles = () => {
  return new Promise((resolve, reject) => {
    // Lee la lista de archivos en el directorio data
    fs.readdir(dataPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      // Filtra los archivos para obtener solo los que tienen extensión .json
      const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

      // Lee cada archivo JSON y lo almacena en un objeto
      const jsonData = {};
      jsonFiles.forEach(file => {
        const filePath = path.join(dataPath, file);

        // Verifica si el filePath es un archivo antes de intentar leerlo
        if (fs.statSync(filePath).isFile()) {
          const fileData = fs.readFileSync(filePath, 'utf-8');
          jsonData[file] = JSON.parse(fileData);
        }
      });

      resolve(jsonData);
    });
  });
};

// Archivo de datos de productos
const productosDataFromFile = fs.readFileSync(filePath, 'utf-8');
const productos = JSON.parse(productosDataFromFile);

// Funciones del controlador para productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Producto.find();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Producto.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al buscar el producto por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    // Obtén los datos del producto desde la solicitud (req.body u otros)
    const { id, nombre, descripcion, codigoBarras, precioCompra, precioVenta, existencias, proveedor, categoria } = req.body;

    // Generar un ID único si no se proporciona uno en la solicitud
    const uniqueId = id || generateUniqueId();

    // Crea una nueva instancia del modelo Producto
    const nuevoProducto = new Producto({
      id: uniqueId,
      nombre: nombre,
      descripcion: descripcion,
      codigoBarras: codigoBarras,
      precioCompra: precioCompra,
      precioVenta: precioVenta,
      existencias: existencias,
      proveedor: proveedor,
      categoria: categoria,
      // Otros campos del producto...
    });

    // Guarda el nuevo producto en la base de datos
    const productoGuardado = await nuevoProducto.save();

    // Envía una respuesta de éxito
    res.json(productoGuardado);
  } catch (error) {
    // Maneja los errores, envía una respuesta de error
    console.error('Error al agregar el producto:', error);
    res.status(500).send('Error al agregar el producto');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id, nombre, descripcion, codigoBarras, precioCompra, precioVenta, existencias, proveedor, categoria } = req.body;

    // Encuentra el producto por el campo 'id' en lugar de '_id'
    const productoActualizado = await Producto.findOneAndUpdate(
      { id: id }, // Busca por el campo 'id'
      {
        nombre: nombre,
        descripcion: descripcion,
        codigoBarras: codigoBarras,
        precioCompra: precioCompra,
        precioVenta: precioVenta,
        existencias: existencias,
        proveedor: proveedor,
        categoria: categoria,
      },
      { new: true } // Devuelve el documento actualizado
    );

    // Envía la respuesta con el producto actualizado
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error al actualizar el producto');
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Producto.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Archivo de datos de proveedores
const proveedoresDataFromFile = fs.readFileSync(filePath2, 'utf-8');
const proveedores = JSON.parse(proveedoresDataFromFile);

// Funciones del controlador para proveedores
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Proveedor.find();
    res.json(providers);
  } catch (error) {
    console.error('Error al obtener todos los proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProviderById = async (req, res) => {
  const providerId = req.params.id;

  try {
    // Busca el proveedor por ID como una cadena
    const provider = await ProveedorModel.find({ _id: providerId });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Error al buscar el proveedor por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.addProvider = async (req, res) => {
  try {
    const { id, nombre, contacto } = req.body;

    const uniqueId = id || generateUniqueId();

    const nuevoProveedor = new Proveedor({
      id: uniqueId,
      nombre: nombre,
      contacto: contacto,
    });

    const proveedorGuardado = await nuevoProveedor.save();

    res.json(proveedorGuardado);
  } catch (error) {
    console.error('Error al agregar el proveedor:', error);
    res.status(500).send('Error al agregar el proveedor');
  }
};

exports.updateProvider = async (req, res) => {
  const providerId = req.params.id;

  try {
    // Encuentra el proveedor por el campo 'id'
    const provider = await Proveedor.find({ id: providerId });

    // Verifica si el proveedor existe
    if (!provider || provider.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Actualiza los datos del proveedor
    if (req.body.nombre) {
      provider[0].nombre = req.body.nombre;
    }

    if (req.body.contacto) {
      provider[0].contacto = req.body.contacto;
    }

    // Guarda los cambios
    await provider[0].save();

    // Devuelve el proveedor actualizado
    res.json(provider[0]);
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteProvider = async (req, res) => {
  const providerId = req.params.id;

  try {
    const deletedProvider = await Proveedor.findByIdAndDelete(providerId);

    if (!deletedProvider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const categoria = await Categoria.findById(categoryId);

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    console.error('Error al buscar la categoría por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.addCategory = async (req, res) => {
  const { nombre } = req.body;

  // Generar un ID único
  const uniqueId = generateUniqueId();

  // Crear una nueva instancia del modelo Categoria
  const nuevaCategoria = new Categoria({
    id: uniqueId,
    nombre,
  });

  try {
    // Guardar la nueva categoría en la base de datos
    const categoriaGuardada = await nuevaCategoria.save();

    // Responder con la nueva categoría añadida
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const { nombre } = req.body;

    // Buscar y actualizar la categoría por el campo 'id'
    const categoriaActualizada = await Categoria.findOneAndUpdate(
      { id: categoryId },
      { nombre },
      { new: true }
    );

    // Responder con la categoría actualizada
    res.json(categoriaActualizada);
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await Categoria.findOneAndDelete({ id: categoryId });

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Archivo de datos de ventas
const ventasDataFromFile = fs.readFileSync(filePath4, 'utf-8');
const ventas = JSON.parse(ventasDataFromFile);

// Leer datos desde el archivo
function getAllData(filePath) {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(fileData);

    if (!Array.isArray(parsedData)) {
      // Intentar manejar como un solo objeto en lugar de un array
      return [parsedData];
    }

    return parsedData;
  } catch (error) {
    console.error('Error al leer el archivo de datos:', error.message);
    return [];
  }
}

// Buscar datos por ID
function findDataById(filePath, id) {
  const data = getAllData(filePath);
  return data.find(item => item.id === id);
}

// Función para agregar datos a un archivo
function addData(filePath, data) {
  try {
    // Leer datos actuales desde el archivo
    const existingData = fs.readFileSync(filePath, 'utf-8');

    // Convertir los datos existentes a un array o asignar un array vacío si no hay datos
    let dataArray = existingData ? JSON.parse(existingData) : [];

    // Si los datos existentes no son un array, crear un array y agregar el objeto existente
    if (!Array.isArray(dataArray)) {
      dataArray = [dataArray];
    }

    // Agregar los nuevos datos al array
    dataArray.push(data);

    // Escribir el array actualizado de nuevo al archivo
    fs.writeFileSync(filePath, JSON.stringify(dataArray, null, 2));
  } catch (error) {
    console.error('Error al agregar datos:', error);
    throw error; // Lanzar el error para manejarlo en el bloque catch del llamador si es necesario
  }
}

// Función para actualizar datos por ID en un archivo
function updateDataById(filePath, id, updatedData) {
  try {
    // Leer datos actuales desde el archivo
    const existingData = fs.readFileSync(filePath, 'utf-8');

    // Convertir los datos existentes a un array o asignar un array vacío si no hay datos
    let dataArray = existingData ? JSON.parse(existingData) : [];

    // Buscar el índice del elemento por su ID
    const dataIndex = dataArray.findIndex(item => item.id === id);

    // Verificar si el elemento existe
    if (dataIndex === -1) {
      throw new Error('Elemento no encontrado');
    }

    // Actualizar los datos del elemento encontrado
    dataArray[dataIndex] = { ...dataArray[dataIndex], ...updatedData };

    // Escribir el array actualizado de nuevo al archivo
    fs.writeFileSync(filePath, JSON.stringify(dataArray, null, 2));
  } catch (error) {
    console.error('Error al actualizar datos por ID:', error);
    throw error;
  }
}

// Función para eliminar datos por ID en un archivo
function deleteDataById(filePath, id) {
  try {
    // Leer datos actuales desde el archivo
    const existingData = fs.readFileSync(filePath, 'utf-8');

    // Convertir los datos existentes a un array o asignar un array vacío si no hay datos
    let dataArray = existingData ? JSON.parse(existingData) : [];

    // Filtrar los elementos para excluir el que tiene el ID proporcionado
    dataArray = dataArray.filter(item => item.id !== id);

    // Escribir el array actualizado de nuevo al archivo
    fs.writeFileSync(filePath, JSON.stringify(dataArray, null, 2));
  } catch (error) {
    console.error('Error al eliminar datos por ID:', error);
    throw error;
  }
}

// Controladores para Ventas
// Función para obtener todas las ventas desde la base de datos de MongoDB
exports.getAllVentas = async (req, res) => {
  try {
    // Usa el modelo VentaModel en lugar de Ventas
    const ventas = await VentaModel.find();
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// Función para obtener una venta por su ID desde la base de datos de MongoDB
exports.getVentaById = async (req, res) => {
  const ventaId = req.params.id;

  try {
    const venta = await VentaModel.findById(ventaId);

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json(venta);
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar una nueva venta a la base de datos de MongoDB
exports.addVenta = async (req, res) => {
  const { cliente, fechaVenta, productosVendidos } = req.body;

  // Validar los datos de la venta
  const requiredProperties = ['cliente', 'fechaVenta', 'productosVendidos'];

  if (!requiredProperties.every(prop => Object.keys(req.body).includes(prop))) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!cliente || !fechaVenta || !productosVendidos) {
    return res.status(400).json({ error: 'Datos incompletos para la venta' });
  }

  // Reemplaza VentaModel.create por new VentaModel
  const newVenta = new VentaModel({
    cliente,
    fechaVenta,
    productosVendidos,
  });

  try {
    const ventaGuardada = await newVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    console.error('Error al agregar venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

};

// Función para actualizar una venta por su ID en la base de datos de MongoDB
exports.updateVenta = async (req, res) => {
  const ventaId = req.params.id;
  const { cliente, fechaVenta, productosVendidos } = req.body;

  // Validar los datos de la venta
  const requiredProperties = ['cliente', 'fechaVenta', 'productosVendidos'];

  if (!requiredProperties.every(prop => Object.keys(req.body).includes(prop))) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!cliente || !fechaVenta || !productosVendidos) {
    return res.status(400).json({ error: 'Datos incompletos para la venta' });
  }

  try {
    const ventaActualizada = await VentaModel.findByIdAndUpdate(
      ventaId,
      { cliente, fechaVenta, productosVendidos },
      { new: true }
    );

    if (!ventaActualizada) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json(ventaActualizada);
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para eliminar una venta por su ID desde la base de datos de MongoDB
exports.deleteVenta = async (req, res) => {
  const ventaId = req.params.id;

  try {
    const ventaEliminada = await VentaModel.findByIdAndDelete(ventaId);

    if (!ventaEliminada) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Funciones del controlador para compras
exports.getAllCompras = async (req, res) => {
  try {
    const compras = await CompraModel.find();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getCompraById = async (req, res) => {
  const compraId = req.params.id;

  try {
    const compra = await CompraModel.findById(compraId);

    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar una nueva compra
exports.addCompra = async (req, res) => {
  const { proveedor, fechaCompra, productosComprados } = req.body;

  if (!proveedor || !fechaCompra || !productosComprados) {
    return res.status(400).json({ error: 'Datos incompletos para la compra' });
  }

  const newCompra = new CompraModel({
    proveedor,
    fechaCompra,
    productosComprados,
  });

  try {
    const compraGuardada = await newCompra.save();
    res.status(201).json(compraGuardada);
  } catch (error) {
    console.error('Error al agregar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateCompra = async (req, res) => {
  const compraId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedCompra = await CompraModel.findByIdAndUpdate(compraId, updatedData, { new: true });
    res.json({ success: true, message: 'Compra actualizada correctamente', compra: updatedCompra });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteCompra = async (req, res) => {
  const compraId = req.params.id;

  try {
    await CompraModel.findByIdAndDelete(compraId);
    res.json({ success: true, message: 'Compra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Archivo de datos de transacciones
const transaccionesDataFromFile = fs.readFileSync(filePath6, 'utf-8');
const transacciones = JSON.parse(transaccionesDataFromFile);

exports.getAllTransacciones = async (req, res) => {
  try {
    res.json(transacciones);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getTransaccionById = (req, res) => {
  const transaccionId = parseInt(req.params.id);

  try {
    // Leer datos actuales de transacciones desde el archivo
    const transaccionesData = fs.readFileSync(filePath6, 'utf-8');
    const transacciones = JSON.parse(transaccionesData);

    // Lógica para buscar la transacción por ID
    const foundTransaccion = transacciones.find(transaccion => transaccion.id === transaccionId.toString());

    if (!foundTransaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.status(200).json(foundTransaccion);
  } catch (error) {
    console.error('Error al leer el archivo de transacciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar una nueva transacción
exports.addTransaccion = (req, res) => {
  const { tipoTransaccion, producto, cantidad, fechaTransaccion } = req.body;

  // Validar los datos de la transacción
  const requiredProperties = ['tipoTransaccion', 'producto', 'cantidad', 'fechaTransaccion'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!tipoTransaccion || !producto || !cantidad || !fechaTransaccion) {
    return res.status(400).json({ error: 'Datos incompletos para la transacción' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const nuevaTransaccion = {
    id: uniqueId,
    tipoTransaccion,
    producto,
    cantidad,
    fechaTransaccion,
  };

  try {
    // Llamada a tu función para guardar la transaccion
    addData(filePath6, nuevaTransaccion);

    // Devolver la transacción agregada
    res.status(201).json(nuevaTransaccion);
    return;
  } catch (error) {
    console.error('Error al agregar la transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateTransaccion = (req, res) => {
  const transaccionId = req.params.id;
  const updatedData = req.body;

  // Buscar el índice de la transacción por ID
  const transaccionIndex = transacciones.findIndex(transaccion => transaccion.id === transaccionId);

  // Verificar si la transacción existe
  if (transaccionIndex === -1) {
    return res.status(404).json({ error: 'Transacción no encontrada' });
  }

  // Validar y actualizar los datos de la transacción
  transacciones[transaccionIndex] = { ...transacciones[transaccionIndex], ...updatedData };

  // Escribir el array actualizado de transacciones de nuevo al archivo
  fs.writeFileSync(filePath6, JSON.stringify(transacciones, null, 2));

  // Devolver la transacción actualizada
  res.json({ success: true, message: 'Transacción actualizada correctamente', transaccion: transacciones[transaccionIndex] });
};

exports.deleteTransaccion = (req, res) => {
  const transaccionId = req.params.id;

  // Buscar el índice de la transacción por ID
  const transaccionIndex = transacciones.findIndex(transaccion => transaccion.id === transaccionId);

  // Verificar si la transacción existe
  if (transaccionIndex === -1) {
    return res.status(404).json({ error: 'Transacción no encontrada' });
  }

  // Lógica para eliminar la transacción del array
  transacciones.splice(transaccionIndex, 1);

  // Escribir el array actualizado de transacciones en el archivo
  fs.writeFileSync(filePath6, JSON.stringify(transacciones, null, 2));

  // Devolver un mensaje de éxito
  res.json({ success: true, message: 'Transacción eliminada correctamente' });
};

// Archivo de datos de usuarios
const usuariosDataFromFile = fs.readFileSync(filePath7, 'utf-8');
const usuarios = JSON.parse(usuariosDataFromFile);

exports.getAllUsuarios = async (req, res) => {
  try {
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getUsuarioById = (req, res) => {
  const usuarioId = parseInt(req.params.id);

  try {
    // Lógica para buscar el usuario por ID en el array cargado
    const foundUsuario = usuarios.find(usuario => usuario.id === usuarioId.toString());

    if (!foundUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(foundUsuario);
  } catch (error) {
    console.error('Error al leer el archivo de usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar un nuevo usuario
exports.addUsuario = (req, res) => {
  const { username, password, rol } = req.body;

  // Validar los datos del usuario
  const requiredProperties = ['username', 'password', 'rol'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!username || !password || !rol) {
    return res.status(400).json({ error: 'Datos incompletos para el usuario' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const nuevoUsuario = {
    id: uniqueId,
    username,
    password,
    rol,
  };

  try {
    //Función para guardar el usuario
    addData(filePath7, nuevoUsuario);

    // Devolver el usuario agregado
    res.status(201).json(nuevoUsuario);
    return;
  } catch (error) {
    console.error('Error al agregar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateUsuario = (req, res) => {
  const usuarioId = req.params.id;
  const updatedData = req.body;

  // Buscar el índice del usuario por ID
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === usuarioId);

  // Verificar si el usuario existe
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Validar y actualizar los datos del usuario
  usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...updatedData };

  // Escribir el array actualizado de usuarios de nuevo al archivo
  fs.writeFileSync(filePath7, JSON.stringify(usuarios, null, 2));

  // Devolver el usuario actualizado
  res.json({ success: true, message: 'Usuario actualizado correctamente', usuario: usuarios[usuarioIndex] });
};

exports.deleteUsuario = (req, res) => {
  const usuarioId = req.params.id;

  // Buscar el índice del usuario por ID
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === usuarioId);

  // Verificar si el usuario existe
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Lógica para eliminar el usuario del array
  usuarios.splice(usuarioIndex, 1);

  // Escribir el array actualizado de usuarios en el archivo
  fs.writeFileSync(filePath7, JSON.stringify(usuarios, null, 2));

  // Devolver un mensaje de éxito
  res.json({ success: true, message: 'Usuario eliminado correctamente' });
};

