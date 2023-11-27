const express = require('express');
const fs = require('fs');
const path = require('path');

const Proveedor = require('../models/proveedor');
const dataPath = './data/';
const filePath2 = path.join(dataPath, 'proveedores.json');

// Archivo de datos de proveedores
const proveedoresDataFromFile = fs.readFileSync(filePath2, 'utf-8');
const proveedores = JSON.parse(proveedoresDataFromFile);

// Obtener todos los proveedores
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Proveedor.find();
    res.json(providers);
  } catch (error) {
    console.error('Error al obtener todos los proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener un proveedor por ID
exports.getProviderById = async (req, res) => {
  const providerId = req.params.id;

  try {
    const provider = await Proveedor.findById(providerId);

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Error al buscar el proveedor por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Agregar un nuevo proveedor
exports.addProvider = async (req, res) => {
  try {
    const { nombre, contacto } = req.body;

    if (!nombre || !contacto) {
      return res.status(400).json({ error: 'Los datos del proveedor son inválidos.' });
    }

    const nuevoProveedor = new Proveedor({
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

exports.editProviderPage = async (req, res) => {
  try {
    const providerId = req.params.id;
    const provider = await Proveedor.findById(providerId);

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.render('editarProveedor', { provider });
  } catch (error) {
    console.error('Error al cargar la página de edición del proveedor:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Actualizar un proveedor por ID
exports.updateProvider = async (req, res) => {
  const providerId = req.params.id;

  try {
    const provider = await Proveedor.findByIdAndUpdate(
      providerId,
      { $set: req.body },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un proveedor por ID
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


exports.renderTablaProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.render('proveedores/tablaproveedores', { proveedores: proveedores });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};