const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const proveedorController = require('../controllers/proveedorController');
const categoriaController = require('../controllers/categoriaController');
const ventaController = require('../controllers/ventaController');
const compraController = require('../controllers/compraController');
const usuarioController = require('../controllers/usuarioController');
const transaccionController = require('../controllers/transaccionController');


// Rutas para productos
router.get('/producto', productoController.getAllProducts);
router.post('/producto', productoController.addProduct);
router.get('/producto/:id', productoController.getProductById);
router.put('/producto/:id', productoController.updateProduct);
router.delete('/producto/:id', productoController.deleteProduct);

// Rutas para proveedores
router.get('/proveedor', proveedorController.getAllProviders);
router.post('/proveedor', proveedorController.addProvider);
router.get('/proveedor/:id', proveedorController.getProviderById);
router.put('/proveedor/:id', proveedorController.updateProvider);
router.delete('/proveedor/:id', proveedorController.deleteProvider);

// Rutas para categorias
router.get('/categoria', categoriaController.getAllCategories);
router.post('/categoria', categoriaController.addCategory);
router.get('/categoria/:id', categoriaController.getCategoryById);
router.put('/categoria/:id', categoriaController.updateCategory);
router.delete('/categoria/:id', categoriaController.deleteCategory);

// Rutas para ventas
router.get('/venta', ventaController.getAllVentas);
router.post('/venta', ventaController.addVenta);
router.get('/venta/:id', ventaController.getVentaById);
router.put('/venta/:id', ventaController.updateVenta);
router.delete('/venta/:id', ventaController.deleteVenta);

// Rutas para compras
router.get('/compra', compraController.getAllCompras);
router.post('/compra', compraController.addCompra);
router.get('/compra/:id', compraController.getCompraById);
router.put('/compra/:id', compraController.updateCompra);
router.delete('/compra/:id', compraController.deleteCompra);

//Entidades dentro de nuestro proyecto pero no estan relacionadas con los casos de uso
//Rutas para usuario
router.get('/usuario', usuarioController.getAllUsuarios);
router.post('/usuario', usuarioController.addUsuario);
router.get('/usuario/:id', usuarioController.getUsuarioById);
router.put('/usuario/:id', usuarioController.updateUsuario);
router.delete('/usuario/:id', usuarioController.deleteUsuario);

module.exports = router;
// Rutas para transacciones
//router.get('/transaccion', transaccionController.getAllTransacciones);
//router.post('/transaccion', transaccionController.addTransaccion);
//router.get('/transaccion/:id', transaccionController.getTransaccionById);
//router.put('/transaccion/:id', transaccionController.updateTransaccion);
//router.delete('/transaccion/:id', transaccionController.deleteTransaccion);

// Rutas para compras
//router.get('/compra', compraController.getAllCompras);
//router.post('/compra', compraController.addCompra);
//router.get('/compra/:id', compraController.getCompraById);
//router.put('/compra/:id', compraController.updateCompra);
//router.delete('/compra/:id', compraController.deleteCompra);
