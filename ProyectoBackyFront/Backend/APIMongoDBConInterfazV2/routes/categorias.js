const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Rutas para categorias
router.get('/categoria', categoriaController.getAllCategories);
router.post('/tabla/agregar', categoriaController.addCategory);
router.get('/categoria/:id', categoriaController.getCategoryById);
router.put('/categoria/:id', categoriaController.updateCategory);
router.delete('/eliminar/:id', categoriaController.deleteCategory);
router.get('/tablacategorias', categoriaController.renderTablaCategorias);
router.get('/editarCategoria/:id', categoriaController.editCategoryPage);

module.exports = router;