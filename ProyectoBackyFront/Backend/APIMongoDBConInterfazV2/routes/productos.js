const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas para productos
router.get('/producto', productoController.getAllProducts);
router.post('/producto', productoController.addProduct);
router.get('/producto/:id', productoController.getProductById);
router.put('/producto/:id', productoController.updateProduct);
router.delete('/producto/:id', productoController.deleteProduct);
router.get('/editar/:id', productoController.editProductPage);
router.post('/editar/:id', productoController.updateProduct);
router.get('/tabla', productoController.renderTabla);

router.get('/', (req, res) => {
  res.redirect('/productos/tabla');
});

router.get('/productos', (req, res)=>{
    res.render('tabla')
})

router.get('/editar', (req, res)=>{
    res.render('editar')
})


module.exports = router;