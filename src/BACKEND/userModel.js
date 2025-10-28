// backend/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  password: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

// Forzar el nombre de la colección "usuarios"
module.exports = mongoose.model('User', userSchema, 'usuarios');
