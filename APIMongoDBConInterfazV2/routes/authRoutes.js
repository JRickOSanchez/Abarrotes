const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.isAuthenticated, authController.renderDashboard);

router.get('/login', (req, res) => {
  res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/index', (req, res) => {
  res.render('index');
});

// Ruta del dashboard que utiliza el middleware de autenticación
router.get('/index', authController.isAuthenticated, (req, res) => {
  // La variable req.user estará disponible si el usuario está autenticado
  console.log('User:', req.user);

  // Renderizar la vista del dashboard y pasar el usuario autenticado
  res.render('dashboard', { user: req.user });
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/dashboard', authController.isAuthenticated);

module.exports = router;