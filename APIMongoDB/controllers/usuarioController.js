const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const generateUniqueId = require('./generateUniqueId');
const dataPath = './data/';
const filePath7 = path.join(dataPath, 'usuarios.json');

// Archivo de datos de usuarios
const usuariosDataFromFile = fs.readFileSync(filePath7, 'utf-8');
const usuarios = JSON.parse(usuariosDataFromFile);

exports.getAllUsuarios = async (req, res) => {
  try {
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getUsuarioById = (req, res) => {
  const usuarioId = parseInt(req.params.id);

  try {
    // Lógica para buscar el usuario por ID en el array cargado
    const foundUsuario = usuarios.find(usuario => usuario.id === usuarioId.toString());

    if (!foundUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(foundUsuario);
  } catch (error) {
    console.error('Error al leer el archivo de usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para agregar un nuevo usuario
exports.addUsuario = (req, res) => {
  const { username, password, rol } = req.body;

  // Validar los datos del usuario
  const requiredProperties = ['username', 'password', 'rol'];

  // Excluir 'id' de la validación
  const bodyProperties = Object.keys(req.body).filter(prop => prop !== 'id');

  if (!requiredProperties.every(prop => bodyProperties.includes(prop)) || bodyProperties.length !== requiredProperties.length) {
    return res.status(400).json({ error: 'Estructura incorrecta en el cuerpo de la solicitud' });
  }

  if (!username || !password || !rol) {
    return res.status(400).json({ error: 'Datos incompletos para el usuario' });
  }

  // Generar un ID único
  const uniqueId = generateUniqueId();

  const nuevoUsuario = {
    id: uniqueId,
    username,
    password,
    rol,
  };

  try {
    //Función para guardar el usuario
    addData(filePath7, nuevoUsuario);

    // Devolver el usuario agregado
    res.status(201).json(nuevoUsuario);
    return;
  } catch (error) {
    console.error('Error al agregar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateUsuario = (req, res) => {
  const usuarioId = req.params.id;
  const updatedData = req.body;

  // Buscar el índice del usuario por ID
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === usuarioId);

  // Verificar si el usuario existe
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Validar y actualizar los datos del usuario
  usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...updatedData };

  // Escribir el array actualizado de usuarios de nuevo al archivo
  fs.writeFileSync(filePath7, JSON.stringify(usuarios, null, 2));

  // Devolver el usuario actualizado
  res.json({ success: true, message: 'Usuario actualizado correctamente', usuario: usuarios[usuarioIndex] });
};

exports.deleteUsuario = (req, res) => {
  const usuarioId = req.params.id;

  // Buscar el índice del usuario por ID
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === usuarioId);

  // Verificar si el usuario existe
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Lógica para eliminar el usuario del array
  usuarios.splice(usuarioIndex, 1);

  // Escribir el array actualizado de usuarios en el archivo
  fs.writeFileSync(filePath7, JSON.stringify(usuarios, null, 2));

  // Devolver un mensaje de éxito
  res.json({ success: true, message: 'Usuario eliminado correctamente' });
};