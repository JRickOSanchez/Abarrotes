const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas para productos
router.get('/producto', productoController.getAllProducts);
router.post('/producto', productoController.addProduct);
router.get('/producto/:id', productoController.getProductById);
router.put('/producto/:id', productoController.updateProduct);
router.delete('/producto/:id', productoController.deleteProduct);

module.exports = router;
