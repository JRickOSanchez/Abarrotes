const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Ruta para leer y mostrar el contenido de un archivo JSON
app.get('/api/leer-archivo-json', (req, res) => {
    try {
        // Lee el archivo JSON sincrónicamente (puedes usar fs.readFile para una lectura asíncrona)
        const jsonData = fs.readFileSync('D:/Materias/2/Abarrotes/Abarrotes2/Abarrotes/Express/Proyecto.json', 'utf-8');
        const parsedData = JSON.parse(jsonData);

        // Haz lo que necesites con los datos JSON
        console.log('Datos JSON recibidos:', parsedData);

        // Envía una respuesta
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

