const express = require('express');
const router = express.Router();
const abarrotesController = require('../controllers/abarrotesController');

// Rutas para productos
router.get('/producto', abarrotesController.getAllProducts);
router.post('/producto', abarrotesController.addProduct);
router.get('/producto/:id', abarrotesController.getProductById);
router.put('/producto/:id', abarrotesController.updateProduct);
router.delete('/producto/:id', abarrotesController.deleteProduct);

// Rutas para proveedores
router.get('/proveedor', abarrotesController.getAllProviders);
router.post('/proveedor', abarrotesController.addProvider);
router.get('/proveedor/:id', abarrotesController.getProviderById);
router.put('/proveedor/:id', abarrotesController.updateProvider);
router.delete('/proveedor/:id', abarrotesController.deleteProvider);

// Rutas para categorias
router.get('/categoria', abarrotesController.getAllCategories);
router.post('/categoria', abarrotesController.addCategory);
router.get('/categoria/:id', abarrotesController.getCategoryById);
router.put('/categoria/:id', abarrotesController.updateCategory);
router.delete('/categoria/:id', abarrotesController.deleteCategory);

// Rutas para ventas
router.get('/4', abarrotesController.getAllVentas);
router.post('/venta', abarrotesController.addVenta);
router.get('/venta/:id', abarrotesController.getVentaById);
router.put('/venta/:id', abarrotesController.updateVenta);
router.delete('/venta/:id', abarrotesController.deleteVenta);

// Rutas para compras
router.get('/5', abarrotesController.getAllCompras);
router.post('/compra', abarrotesController.addCompra);
router.get('/compra/:id', abarrotesController.getCompraById);
router.put('/compra/:id', abarrotesController.updateCompra);
router.delete('/compra/:id', abarrotesController.deleteCompra);

// Rutas para transacciones
router.get('/6', abarrotesController.getAllTransacciones);
router.post('/transaccion', abarrotesController.addTransaccion);
router.get('/transaccion/:id', abarrotesController.getTransaccionById);
router.put('/transaccion/:id', abarrotesController.updateTransaccion);
router.delete('/transaccion/:id', abarrotesController.deleteTransaccion);

// Rutas para usuarios
router.get('/7', abarrotesController.getAllUsuarios);
router.post('/usuario', abarrotesController.addUsuario);
router.get('/usuario/:id', abarrotesController.getUsuarioById);
router.put('/usuario/:id', abarrotesController.updateUsuario);
router.delete('/usuario/:id', abarrotesController.deleteUsuario);



module.exports = router;