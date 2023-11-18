const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authRoutes = require('../routes/authRoutes');

router.get('/', authController.isAuthenticated, (req, res) => {
  console.log('User:', req.user); // Agrega este log
  res.render('index', { user: req.user });
});

router.get('/login', (req, res) => {
  res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/welcome', authController.isAuthenticated, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;