const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas para productos
router.get('/producto', productoController.getAllProducts);
router.post('/agregar', productoController.addProduct);
router.get('/producto/:id', productoController.getProductById);
router.delete('/eliminar/:id', productoController.deleteProduct);
router.get('/editar/:id', productoController.editarProducto);
router.post('/editar/:id', productoController.actualizarProducto);
router.get('/tabla', productoController.renderTabla);
router.get('/actualizar/:id',productoController.editProductPage);

router.get('/', (req, res) => {
  res.redirect('/productos/tabla');
});

router.get('/productos', (req, res)=>{
  res.render('productos/tabla');
});

module.exports = router;