const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.estaAutenticado, (req, res) => {
  res.render('index', { user: req.usuario });
});

router.get('/login', (req, res) => {
  res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', authController.registrar);
router.post('/login', authController.iniciarSesion);
router.get('/logout', authController.logout);

module.exports = router;