const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.2',
    info: {
      title: 'API',
      version: '1.0',
    },
  },
  apis: ['path/to/your/routes/*.js'], // Reemplaza con la ruta real a tus archivos de rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de ejemplo
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

app.get('/name', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});