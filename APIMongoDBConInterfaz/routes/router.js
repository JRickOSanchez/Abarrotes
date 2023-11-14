const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

const authController = require('../controllers/authController')

//router para las vistas
router.get('/', (req, res) => {
    res.render('index', { user: req.user });
  });
  
  router.get('/login', (req, res) => {
    res.render('login', { alert: false });
  });
  
  router.get('/register', (req, res) => {
    res.render('register');
  });


//router para los métodos del controller
router.post('/register', authController.registrar)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render('login', {
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'Los campos de usuario y contraseña son obligatorios.',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login',
            });
        }

        const foundUser = await Usuario.findOne({ username, password });

        if (!foundUser) {
            return res.render('login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: 'Nombre de usuario y/o contraseña incorrectos',
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login',
            });
        }

        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA,
        });

        const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie('jwt', token, cookiesOptions);

        res.render('login', {
            alert: true,
            alertTitle: 'Conexión exitosa',
            alertMessage: '¡Inicio de sesión correcto!',
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: '',
        });
    } catch (error) {
        console.error('Error en la aplicación:', error);
        res.status(500).render('error', { error: 'Error interno del servidor' });
    }
};
  
  router.get('/generateToken', (req, res) => {
    try {
      const expiresIn = 60;
      const payload = { entityId: 'someId', entity: 'someEntity' };
  
      const token = jwt.sign(payload, 'tu-secreto-seguro', { expiresIn });
  
      res.json({ token });
      console.log('Token generado:', token);
    } catch (error) {
      console.error('Error al generar el JWT:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

module.exports = router