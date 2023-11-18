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
const TransaccionModel = require('../models/transaccioninventario');
const dataPath = './data/';
const filePath = path.join(dataPath, 'productos.json');
const filePath2 = path.join(dataPath, 'proveedores.json');
const filePath3 = path.join(dataPath, 'categorias.json');
const filePath4 = path.join(dataPath, 'compra.json');
const filePath5 = path.join(dataPath, 'venta.json');
const filePath6 = path.join(dataPath, 'transacciones.json');
const filePath7 = path.join(dataPath, 'usuarios.json');

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

    // Realiza la validación manualmente
    if (!nombre || !contacto) {
      return res.status(400).json({ error: 'Los datos del proveedor son inválidos.' });
    }

    const uniqueId = id || generateUniqueId();

    const nuevoProveedor = new Proveedor({
      id: uniqueId,
      nombre: nombre,
      contacto: contacto,
    });

    const proveedorGuardado = await nuevoProveedor.save();

    res.status(201).json(proveedorGuardado);
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