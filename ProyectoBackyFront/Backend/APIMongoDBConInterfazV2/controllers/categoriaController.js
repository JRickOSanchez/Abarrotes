const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dataPath = './data/';
const Categoria = require('../models/categoria');
const generateUniqueId = require('./generateUniqueId');

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
    try {
      const { nombre } = req.body;
  
      // Realizar la validación manualmente
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
      }
  
      // Generar un ID único
      const uniqueId = generateUniqueId();
  
      // Crear una nueva instancia del modelo Categoria
      const nuevaCategoria = new Categoria({
        id: uniqueId,
        nombre,
      });
  
      // Guardar la nueva categoría en la base de datos
      const categoriaGuardada = await nuevaCategoria.save();
  
      // Responder con la nueva categoría añadida
      res.status(201).json(categoriaGuardada);
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  exports.editarCategoria = async (req, res) => {
    try {
      const categoriaId = req.params.id;
  
      // Utiliza el campo 'id' en lugar de '_id'
      const categoria = await Categoria.findOne({ id: categoriaId });
  
      if (!categoria) {
        return res.status(404).send('Categoría no encontrada');
      }
  
      res.render('categorias/editarCategoria', { categoria: categoria });
    } catch (error) {
      console.error('Error al cargar la página de edición de la categoría:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  exports.actualizarCategoria = async (req, res) => {
    try {
      const { id, nombre } = req.body;
  
      // Encuentra la categoría por el campo 'id'
      const categoriaActualizada = await Categoria.findOneAndUpdate(
        { id: id },
        {
          nombre: nombre,
          // Otros campos de la categoría si es necesario
        },
        { new: true }
      );
  
      // Verifica si la categoría fue encontrada y actualizada
      if (!categoriaActualizada) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
  
      // Envía la respuesta con la categoría actualizada
      res.redirect('/categorias/actualizar');
    } catch (error) {
      console.error('Error en el controlador de actualización de la categoría:', error);
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

  exports.editCategoryPage = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);

        // Renderizar la vista con la categoría
        res.render('categorias/editarCategoria', { categoria });
    } catch (error) {
        // Manejar el error
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
  
  exports.renderTablaCategorias = async (req, res) => {
    try {
      const categorias = await Categoria.find();
      res.render('categorias/tablacategorias', { categorias: categorias });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };