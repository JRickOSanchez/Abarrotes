// generateUniqueId.js
const { v4: uuidv4 } = require('uuid');

const generateUniqueId = () => {
  const uniqueId = uuidv4();
  console.log('Generated unique ID:', uniqueId);
  return uniqueId;
};

module.exports = generateUniqueId;