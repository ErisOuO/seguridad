// backend/db.js
const mongoose = require('mongoose');

// Usa tu base SEGURIDAD
const MONGO_URI = 'mongodb+srv://Ricardo:Ricardo12@cluster0.zuz4m.mongodb.net/SEGURIDAD?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas (SEGURIDAD)');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  }
};

module.exports = connectDB;
