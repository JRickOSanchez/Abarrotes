const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const generateUniqueId = require('./generateUniqueId');
const { Producto, addProduct } = require('../models/producto');
const dataPath = './data/';
const filePath = path.join(dataPath, 'productos.json');

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
    const {
      id,
      nombre,
      descripcion,
      codigoBarras,
      precioCompra,
      precioVenta,
      existencias,
      proveedor,
      categoria,
    } = req.body;

    // Realiza la validación manualmente
    if (!nombre || !descripcion || !codigoBarras || isNaN(precioCompra) || isNaN(precioVenta) || isNaN(existencias) || !proveedor || !categoria) {
      return res.status(400).json({ error: 'Los datos del producto son inválidos.' });
    }

    // Crea una nueva instancia del modelo Producto
    const nuevoProducto = new Producto({
      id: id || generateUniqueId(), // Genera un ID único si no se proporciona uno en la solicitud
      nombre: nombre,
      descripcion: descripcion,
      codigoBarras: codigoBarras,
      precioCompra: precioCompra,
      precioVenta: precioVenta,
      existencias: existencias,
      proveedor: proveedor,
      categoria: categoria,
    });

    // Guarda el nuevo producto en la base de datos
    const productoGuardado = await nuevoProducto.save();

    // Envía una respuesta de éxito
    res.status(201).json(productoGuardado);
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