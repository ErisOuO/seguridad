// backend/server.js
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const cors = require('cors');

const Usuario = require('./models/Usuario');
const EnlaceTemporal = require('./models/EnlaceTemporal');

const app = express();

// CAMBIO 1: CORS para producción
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json());
connectDB();

// === TU ENDPOINT GENERAR-ENLACE (CON NORMALIZACIÓN) ===
app.post('/api/auth/generar-enlace', async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    console.log(`[1] Email recibido: ${email}`);

    const usuario = await Usuario.findOne({ 
      correo: { $regex: `^${email}$`, $options: 'i' } 
    });
    console.log(`[2] Usuario encontrado: ${usuario ? 'SÍ' : 'NO'}`);

    if (usuario) {
      const token = crypto.randomBytes(32).toString('hex');
      await new EnlaceTemporal({ usuarioId: usuario._id, token }).save();

      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // CAMBIO 2: URL del frontend desde .env
      const enlace = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/validar-acceso?token=${token}`;

      await transporter.sendMail({
        from: '"Soporte Seguridad" <20230047@uthh.edu.mx>',
        to: usuario.correo,
        subject: 'Tu enlace de acceso temporal',
        html: `
          <p>Hola ${usuario.nombre},</p>
          <p>Haz clic para iniciar sesión (expira en 15 min):</p>
          <a href="${enlace}" style="padding:10px 15px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">
            Acceder a mi cuenta
          </a>
        `
      });
      console.log(`[5] Correo enviado a: ${usuario.correo}`);
    }

    res.json({ message: 'Si tu correo está registrado, recibirás un enlace.' });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// === TU ENDPOINT VALIDAR-ENLACE ===
app.post('/api/auth/validar-enlace', async (req, res) => {
  try {
    const { token } = req.body;
    const enlace = await EnlaceTemporal.findOne({ token });
    if (!enlace) return res.status(400).json({ message: 'Enlace inválido o expirado.' });

    await EnlaceTemporal.deleteOne({ _id: enlace._id });
    const sessionToken = jwt.sign(
      { usuarioId: enlace.usuarioId },
      process.env.JWT_SECRET || 'CLAVE_SECRETA_PARA_JWT',
      { expiresIn: '1h' }
    );
    res.json({ sessionToken });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// CAMBIO 3: Puerto dinámico
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});