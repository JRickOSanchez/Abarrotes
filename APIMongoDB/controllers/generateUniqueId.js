const { v4: uuidv4 } = require('uuid');

const generateUniqueId = () => {
  const uniqueId = uuidv4();
  
  // Formatear el ID según tus requisitos
  const formattedId = uniqueId.replace(/-/g, '');

  console.log('Generated unique ID:', formattedId);
  return formattedId;
};

module.exports = generateUniqueId;