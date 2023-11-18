const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

//Entidades dentro de nuestro proyecto pero no estan relacionadas con los casos de uso
//Rutas para usuario
router.get('/usuario', usuarioController.getAllUsuarios);
router.post('/usuario', usuarioController.addUsuario);
router.get('/usuario/:id', usuarioController.getUsuarioById);
router.put('/usuario/:id', usuarioController.updateUsuario);
router.delete('/usuario/:id', usuarioController.deleteUsuario);

module.exports = router;