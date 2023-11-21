const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Rutas para categorias
router.get('/categoria', categoriaController.getAllCategories);
router.post('/categoria', categoriaController.addCategory);
router.get('/categoria/:id', categoriaController.getCategoryById);
router.put('/categoria/:id', categoriaController.updateCategory);
router.delete('/categoria/:id', categoriaController.deleteCategory);

module.exports = router;