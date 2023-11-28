const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Rutas para proveedores
router.get('/proveedor', proveedorController.getAllProviders);
router.post('/tabla/agregar', proveedorController.addProvider);
router.get('/proveedor/:id', proveedorController.getProviderById);
router.put('/proveedor/:id', proveedorController.updateProvider);
router.delete('/proveedor/:id', proveedorController.deleteProvider);
router.get('/tablaproveedores', proveedorController.renderTablaProveedores);
router.get('/editarProveedor/:id', proveedorController.editProviderPage);

module.exports = router;