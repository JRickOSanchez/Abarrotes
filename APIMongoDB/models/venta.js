// models/venta.js
// Módulo para Ventas
class Venta {
    constructor(id, cliente, fechaVenta, productosVendidos) {
      this.id = id;
      this.cliente = cliente;
      this.fechaVenta = fechaVenta;
      this.productosVendidos = productosVendidos;
    }
  }
  
  module.exports = Venta;