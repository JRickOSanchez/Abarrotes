const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

// Registro de usuario
exports.registrar = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.render('register', {
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'Todos los campos son obligatorios.',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const nuevoUsuario = new Usuario({ name, username, password: hashedPassword, rol: 'usuario' });
        await nuevoUsuario.save();

        res.render('register', {
            alert: true,
            alertTitle: 'Registro exitoso',
            alertMessage: '¡Usuario registrado correctamente!',
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'login',
        });
    } catch (error) {
        console.error('Error en la aplicación:', error);
        res.status(500).render('error', { error: 'Error interno del servidor' });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { user, pass } = req.body;

        if (!user || !pass) {
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

        const foundUser = await Usuario.findOne({ username: user });

        if (!foundUser || !(await bcryptjs.compare(pass, foundUser.password))) {
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

// Middleware de autenticación
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            console.log('Decoded JWT:', decoded);

            const foundUser = await Usuario.findById(decoded.id);
            console.log('Found User:', foundUser);

            if (!foundUser) {
                return next();
            }

            req.user = foundUser;
            return next();
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return next();
        }
    } else {
        res.redirect('/login');
    }
};

// Cierre de sesión
exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/');
};