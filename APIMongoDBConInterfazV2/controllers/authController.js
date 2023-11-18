const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario'); // Asegúrate de tener el modelo de usuario definido
const verificarJWT = require('../middlewares/verifyJWT');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) {
            return res.status(400).send("Se requieren nombre de usuario y contraseña");
        }

        const oldUser = await Usuario.findOne({ username });

        if (oldUser) {
            return res.status(409).send("El usuario ya existe. Por favor, inicia sesión");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await Usuario.create({
            username,
            password: encryptedPassword,
            rol: "usuario",
        });

        res.status(201).send("Usuario registrado exitosamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor: " + err.message);
    }
};

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

        const foundUser = await Usuario.findOne({ username });

        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
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

        const expiresIn = '1h'; // Token expira después de 1 hora
        const payload = { id: foundUser._id };

        const secretKey = process.env.SECRET_KEY || 'valor_predeterminado_si_no_se_encuentra';
        const token = jwt.sign(payload, secretKey, { expiresIn });

        // Verificar el token recién emitido
        const verifiedJWT = verificarJWT(token, secretKey);

        // Puedes hacer algo con la información verificada si es necesario
        console.log('Información del JWT verificado:', verifiedJWT);

        const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie('jwt', token, cookiesOptions);

    } catch (error) {
        console.error('Error en la aplicación:', error);
        res.status(500).render('error', { error: 'Error interno del servidor' });
    }
};

  exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
            console.log('Decoded JWT:', decoded);

            const foundUser = await Usuario.findById(decoded.id);
            console.log('Found User:', foundUser);

            if (!foundUser) {
                return next();
            }

            req.user = foundUser;
            console.log('Assigned User:', req.user); // Agrega este log

            return next();
        } catch (error) {
            console.log('Error decoding JWT:', error);
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
