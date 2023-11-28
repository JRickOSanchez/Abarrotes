const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { VentaModel } = require('../models/venta');
const dataPath = './data/';
const filePath4 = path.join(dataPath, 'compra.json');
const Venta = require('../models/venta');

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

exports.editVentaPage = async (req, res) => {
  try {
    const ventaId = req.params.id;
    const venta = await Venta.findById(ventaId);

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.render('/ventas/actualizarventa', { venta });
  } catch (error) {
    console.error('Error al cargar la página de edición de ventas:', error);
    res.status(500).send('Error interno del servidor');
  }
};

exports.renderTablaVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.render('/ventas/tablaventas', { ventas: ventas });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};