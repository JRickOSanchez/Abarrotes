const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario'); // Asegúrate de tener el modelo de usuario definido

exports.register = async (req, res) => {
    try {
      const { name, username, password } = req.body; // Cambiado de 'user' a 'username'
      // Asegúrate de que estás utilizando correctamente el modelo Usuario aquí
      const newUser = new Usuario({ username, password, rol: 'tu_rol_predeterminado' });
      await newUser.save();
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render('login', {
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'Ingrese un nombre de usuario y contraseña',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login',
            });
        }

        const foundUser = await Usuario.findOne({ username });

        if (!foundUser || !(await bcryptjs.compare(password, foundUser.password))) {
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
        console.log(error);
    }
};
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            console.log('Decoded JWT:', decoded); // Agrega este log

            const foundUser = await Usuario.findById(decoded.id);
            console.log('Found User:', foundUser); // Agrega este log

            if (!foundUser) {
                return next();
            }

            req.user = foundUser;
            return next();
        } catch (error) {
            console.log('Error decoding JWT:', error); // Agrega este log
            return next();
        }
    } else {
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/');
};