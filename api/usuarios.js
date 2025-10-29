import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
const AES_KEY = process.env.VITE_AES_KEY || 'miclavesegura123';

console.log('🔧 Configuración MongoDB:', MONGODB_URI ? '✅' : '❌');
console.log('🔧 Clave AES:', AES_KEY ? '✅' : '❌');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('✅ Ya conectado a MongoDB');
    return;
  }
  
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
};

// Esquema de usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password_cifrado: { type: String, required: true }
}, {
  timestamps: true
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      console.log('📨 Recibiendo solicitud POST');
      
      const { nombre, correo, password } = req.body;
      
      if (!nombre || !correo || !password) {
        return res.status(400).json({ 
          error: '❌ Todos los campos son requeridos' 
        });
      }

      // Conectar a MongoDB
      await connectDB();

      // 🔐 CIFRAR LA CONTRASEÑA CON AES-128
      const passwordCifrado = CryptoJS.AES.encrypt(password, AES_KEY).toString();
      console.log('🔐 Contraseña cifrada:', passwordCifrado);

      // Guardar en MongoDB
      const usuario = new Usuario({
        nombre,
        correo,
        password_cifrado: passwordCifrado
      });

      await usuario.save();
      console.log('✅ Usuario guardado en MongoDB');

      res.status(200).json({
        mensaje: '✅ Usuario registrado con cifrado AES-128',
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo
        }
      });

    } catch (error) {
      console.error('💥 Error completo:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({ 
          error: '❌ El correo ya está registrado' 
        });
      }
      
      return res.status(500).json({ 
        error: '❌ Error interno del servidor',
        detalle: error.message 
      });
    }
  } else {
    res.status(405).json({ 
      error: '❌ Método no permitido. Use POST.' 
    });
  }
}