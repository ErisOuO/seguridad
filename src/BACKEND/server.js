// backend/server.js
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const connectDB = require('./db');
const User = require('./userModel');

const app = express();
const PORT = 5000;

// Conexión a MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Clave AES-128 (16 bytes) y vector de inicialización (IV)
const AES_KEY = Buffer.from('1234567890abcdef', 'utf8');
const AES_IV = Buffer.from('abcdef9876543210', 'utf8');

// --- Función para cifrar (AES-128-CBC) ---
function encryptAES(text) {
  const cipher = crypto.createCipheriv('aes-128-cbc', AES_KEY, AES_IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// --- Función para descifrar (opcional, solo pruebas) ---
function decryptAES(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-128-cbc', AES_KEY, AES_IV);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// --- Registrar usuario ---
app.post('/register', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const encryptedPassword = encryptAES(password);

    const newUser = new User({ usuario, password: encryptedPassword });
    await newUser.save();

    res.json({ message: 'Usuario registrado correctamente ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// --- Iniciar sesión ---
app.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const encryptedPassword = encryptAES(password);

    const user = await User.findOne({ usuario, password: encryptedPassword });

    if (user) {
      res.json({ message: 'Inicio de sesión exitoso ✅' });
    } else {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos ❌' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
