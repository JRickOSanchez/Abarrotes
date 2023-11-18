const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.isAuthenticated);

router.get('/login', (req, res) => {
  res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/index', (req, res) => {
  res.render('index');
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/index', authController.isAuthenticated);

module.exports = router;