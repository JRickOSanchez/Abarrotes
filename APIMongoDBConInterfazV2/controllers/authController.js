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

    const user = await Usuario.create({
      username,
      password: encryptedPassword,
      rol: "usuario",
    });

    const secretKey = process.env.SECRET_KEY || 'valor_predeterminado_si_no_se_encuentra';
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '60s' });

    // Verificar el token recién emitido
    const verifiedJWT = verificarJWT(token, secretKey);

    // Puedes hacer algo con la información verificada si es necesario
    console.log('Información del JWT verificado:', verifiedJWT);

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor: " + err.message);
  }
};

exports.login = async (req, res) => {
    try {
      const { username, password, token } = req.body;
  
      // Verificar si se proporcionó un token
      if (token) {
        // Si hay un token, verifica el JWT
        const verifiedJWT = verificarJWT(token, 'tu_clave_secreta_aqui');
  
        // Puedes hacer algo con la información verificada si es necesario
        console.log('Información del JWT verificado:', verifiedJWT);
  
        return res.status(200).json({ message: 'Inicio de sesión exitoso con JWT' });
      }
  
      // Si no se proporcionó un token, realizar inicio de sesión con nombre de usuario y contraseña
      if (!(username && password)) {
        return res.status(400).send('Se requieren nombre de usuario y contraseña');
      }
  
      // Buscar al usuario por nombre de usuario en la base de datos
      const user = await Usuario.findOne({ username });
  
      // Si el usuario no existe, responde con un mensaje de error
      if (!user) {
        return res.status(401).send('Credenciales incorrectas');
      }
  
      // Compara la contraseña proporcionada con la almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      // Si las contraseñas no coinciden, responde con un mensaje de error
      if (!passwordMatch) {
        return res.status(401).send('Credenciales incorrectas');
      }
  
      // Devuelve el token del usuario registrado en la respuesta
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).send('Error en el servidor: ' + error.message);
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

exports.renderDashboard = (req, res) => {
    res.render('index', { user: req.user });
  };