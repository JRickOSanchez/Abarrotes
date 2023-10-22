const express = require('express');
const fs = require('fs');
const path = require('path');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Proveedor = require('../models/proveedor');
const Compra = require('../models/compra');
const Venta = require('../models/venta');
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

// Funciones del controlador para producto
exports.getAllProducts = async (req, res) => {
  const products = await Producto.find();
  res.json(products);
};

exports.getProductById = (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const productosData = fs.readFileSync(filePath, 'utf-8');
    const productos = JSON.parse(productosData);

    const product = productos.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al buscar el producto por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.addProduct = (req, res) => {
  const {
    nombre,
    descripcion,
    codigoBarras,
    precioCompra,
    precioVenta,
    existencias,
    proveedor,
    categoria,
  } = req.body;

  // Validar los datos del producto
  const requiredProperties = ['nombre', 'codigoBarras', 'precioCompra', 'precioVenta', 'existencias', 'proveedor', 'categoria', 'descripcion'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    console.log('Propiedades faltantes:', requiredProperties.filter(prop => !bodyProperties.includes(prop)));
    console.log('Propiedades adicionales:', bodyProperties.filter(prop => !requiredProperties.includes(prop)));
    return res.status(400).json({ error: 'Estructura incorrecta' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const newProduct = {
    id: uniqueId,
    nombre,
    descripcion,
    codigoBarras,
    precioCompra,
    precioVenta,
    existencias,
    proveedor,
    categoria,
  };

  try {
    const productosData = fs.readFileSync(filePath, 'utf-8');
    console.log('Contenido del archivo antes de agregar:', productosData);

    const productos = JSON.parse(productosData);
    productos.push(newProduct);

    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));

    console.log('Contenido del archivo después de escribir:', fs.readFileSync(filePath, 'utf-8'));

    res.status(201).json(newProduct);
    return;
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateProduct = (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const productosData = fs.readFileSync(filePath, 'utf-8');
    const productos = JSON.parse(productosData);

    // Buscar el índice del producto por ID
    const productIndex = productos.findIndex((p) => p.id === productId);

    // Verificar si el producto existe
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validar y actualizar los datos del producto
    if (req.body.nombre) {
      productos[productIndex].nombre = req.body.nombre;
    }

    if (req.body.descripcion) {
      productos[productIndex].descripcion = req.body.descripcion;
    }

    if (req.body.codigoBarras) {
      productos[productIndex].codigoBarras = req.body.codigoBarras;
    }

    if (req.body.precioCompra) {
      productos[productIndex].precioCompra = req.body.precioCompra;
    }

    if (req.body.precioVenta) {
      productos[productIndex].precioVenta = req.body.precioVenta;
    }

    if (req.body.existencias) {
      productos[productIndex].existencias = req.body.existencias;
    }

    if (req.body.proveedor) {
      productos[productIndex].proveedor = req.body.proveedor;
    }

    if (req.body.categoria) {
      productos[productIndex].categoria = req.body.categoria;
    }

    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));

    // Devolver el producto actualizado
    res.json(productos[productIndex]);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteProduct = (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const productosData = fs.readFileSync(filePath, 'utf-8');
    let productos = JSON.parse(productosData);

    // Verificar si el producto existe
    const productIndex = productos.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar el producto del array
    productos = productos.filter((p) => p.id !== productId);

    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));

    // Devolver un mensaje indicando que el producto ha sido eliminado
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Archivo de datos de proveedores
const proveedoresDataFromFile = fs.readFileSync(filePath2, 'utf-8');
const proveedores = JSON.parse(proveedoresDataFromFile);

exports.getAllProviders = async (req, res) => {
  try {
    const jsonData = await readAllJsonFiles();
    const providers = jsonData['proveedores.json'];

    if (!providers) {
      return res.status(404).json({ error: 'No se encontraron proveedores' });
    }

    res.json(providers);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProviderById = (req, res) => {
  const providerId = parseInt(req.params.id);

  const provider = proveedores.find(provider => provider.id === providerId);

  if (!provider) {
    return res.status(404).json({ error: 'Proveedor no encontrado' });
  }

  res.json(provider);
};

// Funcion para añadir un proveedor
exports.addProvider = async (req, res) => {
  const { nombre, contacto } = req.body;

  // Validar los datos del proveedor
  const requiredProperties = ['nombre', 'contacto'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!nombre || !contacto) {
    return res.status(400).json({ error: 'El nombre y el contacto del proveedor son obligatorios' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const nuevoProveedor = {
    id: uniqueId,
    nombre,
    contacto,
  };

  try {
    // Llama a tu función de guardar el proveedor
    await Proveedor.save(nuevoProveedor);

    // Devolver el proveedor agregado
    res.json(nuevoProveedor);
    return;
  } catch (error) {
    console.error('Error al agregar el proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.updateProvider = async (req, res) => {
  const providerId = req.params.id;

  // Obtener la lista de proveedores
  const providers = await Proveedor.find();

  // Buscar el proveedor por ID
  const provider = providers.find(provider => provider.id === parseInt(providerId));

  // Verificar si el proveedor existe
  if (!provider) {
    return res.status(404).json({ error: 'Proveedor no encontrado' });
  }

  // Validar y actualizar los datos del proveedor
  if (req.body.nombre) {
    provider.nombre = req.body.nombre;
  }

  if (req.body.contacto) {
    provider.contacto = req.body.contacto;
  }

  // Guardar los cambios
  fs.writeFileSync(filePath2, JSON.stringify(providers, null, 2));

  // Devolver el proveedor actualizado
  res.json(provider);
};

exports.deleteProvider = async (req, res) => {
  const providerId = req.params.id;

  // Obtener la lista actual de proveedores
  const proveedores = await Proveedor.find();

  // Buscar el proveedor por ID en la lista
  const providerIndex = proveedores.findIndex(provider => provider.id === parseInt(providerId));

  // Verificar si el proveedor existe
  if (providerIndex === -1) {
    return res.status(404).json({ error: 'Proveedor no encontrado' });
  }

  // Eliminar el proveedor de la lista
  proveedores.splice(providerIndex, 1);

  // Guardar la lista actualizada de proveedores en el archivo
  fs.writeFileSync(filePath2, JSON.stringify(proveedores, null, 2));

  // Devolver un mensaje de éxito
  res.json({ message: 'Proveedor eliminado exitosamente' });
};

// Archivo de datos de categorias
const categoriasDataFromFile = fs.readFileSync(filePath3, 'utf-8');
const categorias = JSON.parse(categoriasDataFromFile);

// Funciones del controlador para categorias
// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categoriasData = fs.readFileSync(filePath3, 'utf-8');
    const categorias = JSON.parse(categoriasData);

    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para encontrar una categoría por ID
function encontrarCategoriaPorId(id, categorias) {
  return categorias.find(categoria => categoria.id === id);
}

  exports.getCategoryById = (req, res) => {
  const categoryId = req.params.id;

  try {
    // Leer datos actuales de categorías desde el archivo
    const categoriasData = fs.readFileSync(filePath3, 'utf-8');
    const categorias = JSON.parse(categoriasData);

    // Lógica para buscar la categoría por ID
    const foundCategory = encontrarCategoriaPorId(categoryId, categorias);

    if (!foundCategory) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(foundCategory);
  } catch (error) {
    console.error('Error al leer el archivo de categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar una nueva categoría
exports.addCategory = (req, res) => {
  const { nombre } = req.body;

  // Validar los datos de la categoría
  const requiredProperties = ['nombre'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const newCategory = {
    id: uniqueId,
    nombre,
  };

  try {
    // Leer datos actuales de categorías desde el archivo
    const categoriasData = fs.readFileSync(filePath3, 'utf-8');
    let categorias = JSON.parse(categoriasData);

    // Verificar si categorías es un array, si no, inicializar como array vacío
    if (!Array.isArray(categorias)) {
      categorias = [];
    }

    // Agregar la nueva categoría al array de categorías
    categorias.push(newCategory);

    // Escribir el array actualizado de categorías de nuevo al archivo
    fs.writeFileSync(filePath3, JSON.stringify(categorias, null, 2));

    // Responder con la nueva categoría añadida
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar una categoría por su ID
exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;

  try {
    const categoriasData = fs.readFileSync(filePath3, 'utf-8');
    const categorias = JSON.parse(categoriasData);

    // Buscar el índice de la categoría por ID
    const categoryIndex = categorias.findIndex((c) => c.id === categoryId);

    // Verificar si la categoría existe
    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Validar y actualizar los datos de la categoría
    if (req.body.nombre !== undefined) {
      categorias[categoryIndex].nombre = req.body.nombre;
    }

    fs.writeFileSync(filePath3, JSON.stringify(categorias, null, 2));

    // Devolver la categoría actualizada y un mensaje
    res.json({ success: true, message: 'Categoría actualizada correctamente', categoria: categorias[categoryIndex] });
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  try {
    // Leer datos actuales de categorías desde el archivo
    const categoriasData = fs.readFileSync(filePath3, 'utf-8');
    const categorias = JSON.parse(categoriasData);

    // Buscar el índice de la categoría por ID
    const categoryIndex = categorias.findIndex((c) => c.id === categoryId);

    // Verificar si la categoría existe
    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Lógica para eliminar la categoría...
    categorias.splice(categoryIndex, 1);

    // Escribir las categorías actualizadas en el archivo
    fs.writeFileSync(filePath3, JSON.stringify(categorias, null, 2));

    // Devolver un mensaje de éxito
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
exports.getAllVentas = (req, res) => {
  try {
    // console.log('Leyendo datos de ventas desde:', filePath5);
    const ventas = getAllData(filePath5);
    // console.log('Ventas obtenidas:', ventas);

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
exports.getVentaById = (req, res) => {
  const ventaId = req.params.id;

  try {
    const ventas = getAllData(filePath5);
    const foundVenta = findDataById(filePath5, ventaId);

    if (!foundVenta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.status(200).json(foundVenta);
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar una nueva venta
exports.addVenta = (req, res) => {
  const { cliente, fechaVenta, productosVendidos } = req.body;

  // Validar los datos de la venta
  const requiredProperties = ['cliente', 'fechaVenta', 'productosVendidos'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!cliente || !fechaVenta || !productosVendidos) {
    return res.status(400).json({ error: 'Datos incompletos para la venta' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const newVenta = {
    id: uniqueId,
    cliente,
    fechaVenta,
    productosVendidos,
  };

  try {
    // Lógica para agregar la nueva venta al archivo o base de datos
    addData(filePath5, newVenta);

    res.status(201).json(newVenta);
  } catch (error) {
    console.error('Error al agregar venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateVenta = (req, res) => {
  const ventaId = req.params.id;
  const updatedData = req.body;

  try {
    updateDataById(filePath5, ventaId, updatedData);
    res.json({ success: true, message: 'Venta actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteVenta = (req, res) => {
  const ventaId = req.params.id;

  try {
    deleteDataById(filePath5, ventaId);
    res.json({ success: true, message: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Archivo de datos de compras
const comprasDataFromFile = fs.readFileSync(filePath5, 'utf-8');
const compras = JSON.parse(comprasDataFromFile);

// Funciones del controlador para compras
exports.getAllCompras = (req, res) => {
  try {
    const compras = getAllData(filePath4);
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getCompraById = (req, res) => {
  const compraId = req.params.id;

  try {
    const compra = findDataById(filePath4, compraId);

    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar una nueva compra
exports.addCompra = (req, res) => {
  const { proveedor, fechaCompra, productosComprados } = req.body;

  // Validar los datos de la compra
  const requiredProperties = ['proveedor', 'fechaCompra', 'productosComprados'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!proveedor || !fechaCompra || !productosComprados) {
    return res.status(400).json({ error: 'Datos incompletos para la compra' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const newCompra = {
    id: uniqueId,
    proveedor,
    fechaCompra,
    productosComprados,
  };

  try {
    // Llamada a tu función para guardar la compra 
    addData(filePath4, newCompra);
  
    // Responder con la nueva compra añadida
    res.status(201).json(newCompra);
    return;
  } catch (error) {
    console.error('Error al agregar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateCompra = (req, res) => {
  const compraId = req.params.id;
  const updatedData = req.body;

  try {
    updateDataById(filePath4, compraId, updatedData);
    res.json({ success: true, message: 'Compra actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteCompra = (req, res) => {
  const compraId = req.params.id;

  try {
    deleteDataById(filePath4, compraId);
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