const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const TransaccionModel = require('../models/transaccioninventario');
const dataPath = './data/';
const filePath6 = path.join(dataPath, 'transacciones.json');

// Archivo de datos de transacciones
const transaccionesDataFromFile = fs.readFileSync(filePath6, 'utf-8');
const transacciones = JSON.parse(transaccionesDataFromFile);

exports.getAllTransacciones = async (req, res) => {
  try {
    const transacciones = await TransaccionModel.find();
    res.json(transacciones);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getTransaccionById = async (req, res) => {
  const transaccionId = req.params.id;

  try {
    const transaccion = await TransaccionModel.findById(transaccionId);

    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.status(200).json(transaccion);
  } catch (error) {
    console.error('Error al leer el archivo de transacciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.addTransaccion = async (req, res) => {
  const { tipoTransaccion, producto, cantidad, fechaTransaccion } = req.body;

  if (!tipoTransaccion || !producto || !cantidad || !fechaTransaccion) {
    return res.status(400).json({ error: 'Datos incompletos para la transacción' });
  }

  const nuevaTransaccion = new TransaccionModel({
    tipoTransaccion,
    producto,
    cantidad,
    fechaTransaccion,
  });

  try {
    const transaccionGuardada = await nuevaTransaccion.save();
    res.status(201).json(transaccionGuardada);
  } catch (error) {
    console.error('Error al agregar la transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateTransaccion = async (req, res) => {
  const transaccionId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedTransaccion = await TransaccionModel.findByIdAndUpdate(transaccionId, updatedData, { new: true });
    res.json({ success: true, message: 'Transacción actualizada correctamente', transaccion: updatedTransaccion });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteTransaccion = async (req, res) => {
  const transaccionId = req.params.id;

  try {
    await TransaccionModel.findByIdAndDelete(transaccionId);
    res.json({ success: true, message: 'Transacción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};