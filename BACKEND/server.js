// ================================
// IMPORTACIONES
// ================================
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// ================================
// CONFIGURACIÓN DEL SERVIDOR
// ================================
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ================================
// CONEXIÓN A MONGODB ATLAS
// ================================

// Usa la variable del .env
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a la base "seguridad" en MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

// ================================
// DEFINICIÓN DEL MODELO
// ================================
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// ================================
// RUTAS
// ================================

// 🟢 Ruta principal: listar usuarios
app.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json({
      total_usuarios: usuarios.length,
      usuarios
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// 🟢 Agregar nuevo usuario
app.post('/usuario', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const nuevo = new Usuario({ nombre, correo, password });
    await nuevo.save();

    res.json({
      mensaje: '✅ Usuario agregado correctamente',
      usuario: nuevo
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'El correo ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al agregar usuario' });
    }
  }
});

// ================================
// INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
