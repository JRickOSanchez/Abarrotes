// models/producto.js

const path = require('path');
const productosDataFromFile = require('../data/productos.json');

// Módulo para Productos
class Producto {
  constructor(id, nombre, descripcion, codigoBarras, precioCompra, precioVenta, existencias, proveedor, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.codigoBarras = codigoBarras;
    this.precioCompra = precioCompra;
    this.precioVenta = precioVenta;
    this.existencias = existencias;
    this.proveedor = proveedor;
    this.categoria = categoria;
  }

  static find() {
    return new Promise((resolve, reject) => {
      resolve(productosDataFromFile);
    });
  }
}

module.exports = Producto;
