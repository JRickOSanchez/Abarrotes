const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas para ventas
router.get('/venta', ventaController.getAllVentas);
router.post('/venta', ventaController.addVenta);
router.get('/venta/:id', ventaController.getVentaById);
router.delete('/venta/:id', ventaController.deleteVenta);
router.put('/actualizar/:id', ventaController.updateVenta);
router.get('/tablaventas', ventaController.renderTablaVentas);
router.get('/editar/:id', ventaController.editVentaPage);

module.exports = router;