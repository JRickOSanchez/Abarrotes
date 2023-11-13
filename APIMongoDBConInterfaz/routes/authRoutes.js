const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.isAuthenticated, (req, res) => {
  console.log('User:', req.user);
  res.render('index', { user: req.user });
});

router.get('/login', (req, res) => {
  res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;