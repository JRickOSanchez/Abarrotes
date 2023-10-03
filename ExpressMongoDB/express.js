const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

//MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/ProyectoExpress')

mongoose.connection.on('open', _ => {
    console.log("Se ha conectado");
})

// Define un esquema para tus datos JSON
const proyectoSchema = new mongoose.Schema({
  // Define la estructura de tu esquema aquí, por ejemplo:
  nombre: String,
  descripcion: String,
  // ... otros campos
});

// Crea un modelo basado en el esquema
const Proyecto = mongoose.model('Proyecto', proyectoSchema);
//MongoDB

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Ruta para leer y mostrar el contenido de un archivo JSON
app.get('/api/leer-archivo-json', async (req, res) => {
  try {
    const jsonData = fs.readFileSync('D:/Materias/2/Abarrotes/Abarrotes2/Abarrotes/Express/Proyecto.json', 'utf-8');
    const parsedData = JSON.parse(jsonData);

    // Guarda los datos en MongoDB usando Mongoose
    await Proyecto.create(parsedData);

    console.log('Datos JSON recibidos y guardados en MongoDB:', parsedData);
    res.json(parsedData);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para manejar solicitudes GET en la raíz
app.get('/', (req, res) => {
    res.send('¡Hola! Este es el servidor Express.');
  });

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

