const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

// Rutas para compras
router.get('/compra', compraController.getAllCompras);
router.post('/compra', compraController.addCompra);
router.get('/compra/:id', compraController.getCompraById);
router.put('/compra/:id', compraController.updateCompra);
router.delete('/compra/:id', compraController.deleteCompra);

module.exports = router;
