const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { CompraModel } = require('../models/compra');
const dataPath = './data/';
const filePath4 = path.join(dataPath, 'compra.json');


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