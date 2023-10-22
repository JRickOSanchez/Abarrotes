// models/proveedor.js

const path = require('path');
const fs = require('fs');

// Ruta al archivo JSON de proveedores
const proveedorDataPath = path.join(__dirname, '../data/proveedores.json');

class Proveedor {
  constructor(id, nombre, contacto) {
    this.id = id;
    this.nombre = nombre;
    this.contacto = contacto;
  }

  static find() {
    return new Promise((resolve, reject) => {
      const proveedores = require(proveedorDataPath);
      resolve(proveedores);
    });
  }

  static save(proveedor) {
    return new Promise((resolve, reject) => {
      const proveedores = require(proveedorDataPath);
      proveedores.push(proveedor);
      fs.writeFileSync(proveedorDataPath, JSON.stringify(proveedores, null, 2));
      resolve(proveedor);
    });
  }
}

module.exports = Proveedor;