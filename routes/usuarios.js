import express from 'express';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// GET - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json({
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const usuario = new Usuario({ nombre, correo, password });
    await usuario.save();

    res.status(201).json({
      mensaje: '✅ Usuario guardado en BD',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        fecha: usuario.createdAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'El correo ya está registrado' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

export default router;