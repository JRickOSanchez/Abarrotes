const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEFAULT;

if (!mongoURI) {
  console.error('Error: MONGODB_URI o MONGODB_URI_DEFAULT no están definidos en el archivo .env');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
});

db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

module.exports = db;