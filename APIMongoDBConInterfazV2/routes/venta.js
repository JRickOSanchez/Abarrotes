const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas para ventas
router.get('/venta', ventaController.getAllVentas);
router.post('/venta', ventaController.addVenta);
router.get('/venta/:id', ventaController.getVentaById);
router.put('/venta/:id', ventaController.updateVenta);
router.delete('/venta/:id', ventaController.deleteVenta);

module.exports = router;