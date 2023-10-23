// models/producto.js

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  descripcion: String,
  codigoBarras: String,
  precioCompra: Number,
  precioVenta: Number,
  existencias: Number,
  proveedor: String, 
  categoria: String, 
});

const Producto = mongoose.model('Producto', productoSchema);


const getAllProducts = async () => {
  try {
    const products = await Producto.find();
    return products;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Producto.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

const addProduct = async (newProductData) => {
  try {
    const newProduct = new Producto(newProductData);
    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (productId, updatedProductData) => {
  try {
    const updatedProduct = await Producto.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await Producto.findByIdAndRemove(productId);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

module.exports = Producto;