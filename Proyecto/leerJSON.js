const fs = require('fs');

// Ruta al archivo JSON
const rutaArchivo = 'D:/Materias/2/Abarrotes/Abarrotes2/Abarrotes/Proyecto/datos.json';

// Lee el archivo JSON
fs.readFile(rutaArchivo, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Parsea el contenido JSON
  const jsonData = JSON.parse(data);

  // Muestra los datos leídos
  console.log(jsonData);

  // Ahora puedes acceder a las propiedades específicas
  const listaDeProductos = jsonData.productos;
  console.log('Lista de productos:', listaDeProductos);

  // O realizar otras operaciones según tus necesidades
});