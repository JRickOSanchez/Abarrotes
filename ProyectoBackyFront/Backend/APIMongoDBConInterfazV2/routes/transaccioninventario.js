const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');

//Rutas para transacciones
router.get('/transaccion', transaccionController.getAllTransacciones);
router.post('/transaccion', transaccionController.addTransaccion);
router.get('/transaccion/:id', transaccionController.getTransaccionById);
router.put('/transaccion/:id', transaccionController.updateTransaccion);
router.delete('/transaccion/:id', transaccionController.deleteTransaccion);

module.exports = router;