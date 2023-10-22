// models/compra.js
// Módulo para Compras
class Compra {
    constructor(id, proveedor, fechaCompra, productosComprados) {
      this.id = id;
      this.proveedor = proveedor;
      this.fechaCompra = fechaCompra;
      this.productosComprados = productosComprados;
    }
  }
  
  module.exports = Compra;