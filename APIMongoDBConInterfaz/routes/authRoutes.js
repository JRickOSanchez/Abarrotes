const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
<<<<<<< Updated upstream

router.get('/', authController.estaAutenticado, (req, res) => {
  res.render('index', { user: req.usuario });
=======
const authRoutes = require('../routes/authRoutes');

router.get('/', authController.isAuthenticated, (req, res) => {
  console.log('User:', req.user); // Agrega este log
  res.render('index', { user: req.user });
>>>>>>> Stashed changes
});

router.get('/login', (req, res) => {
  res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
  res.render('register');
});

<<<<<<< Updated upstream
router.post('/register', authController.registrar);
router.post('/login', authController.iniciarSesion);
=======
router.post('/register', authController.register);
router.post('/login', authController.login);
>>>>>>> Stashed changes
router.get('/logout', authController.logout);

module.exports = router;