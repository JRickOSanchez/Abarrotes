const jwt = require('jsonwebtoken');

const verificarJWT = (token, secretKey) => {
  try {
    // Verificar el JWT utilizando la información decodificada
    const verifiedJWT = jwt.verify(token, secretKey);

    // Si no se lanzó una excepción, el JWT es válido
    console.log('El JWT es válido:', verifiedJWT);

    // Puedes acceder a los campos del JWT verificado
    const userId = verifiedJWT.id;
    console.log('User ID:', userId);

    return verifiedJWT;
  } catch (error) {
    // Manejar errores de verificación del JWT
    console.error('Error al verificar el JWT:', error.message);
    throw error; // Puedes manejar el error de otra manera según tus necesidades
  }
};

module.exports = verificarJWT;