const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dataPath = './data/';
const Categoria = require('../models/categoria');

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

  exports.editCategoryPage = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const category = await Categoria.findById(categoryId);
  
      if (!category) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
  
      res.render('categorias/editarCategoria', { category });
    } catch (error) {
      console.error('Error al cargar la página de edición de categoría:', error);
      res.status(500).send('Error interno del servidor');
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