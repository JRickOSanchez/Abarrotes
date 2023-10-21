// models/transaccioninventario.js
// Módulo para Transacciones de Inventario
class TransaccionInventario {
    constructor(id, tipoTransaccion, producto, cantidad, fechaTransaccion) {
      this.id = id;
      this.tipoTransaccion = tipoTransaccion;
      this.producto = producto;
      this.cantidad = cantidad;
      this.fechaTransaccion = fechaTransaccion;
    }
  }
  
  module.exports = TransaccionInventario;