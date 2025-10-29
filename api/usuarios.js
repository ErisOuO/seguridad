import CryptoJS from 'crypto-js';

const AES_KEY = process.env.VITE_AES_KEY || 'miclavesegura123';

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
      const { nombre, correo, password } = req.body;
      
      console.log('📨 Datos recibidos:', { nombre, correo, password: '***' });
      
      if (!nombre || !correo || !password) {
        return res.status(400).json({ 
          success: false,
          error: '❌ Todos los campos son requeridos' 
        });
      }

      // 🔐 CIFRAR CON AES-128
      const passwordCifrado = CryptoJS.AES.encrypt(password, AES_KEY).toString();
      console.log('🔐 Contraseña cifrada (AES-128):', passwordCifrado);

      // Simular guardado (sin MongoDB por ahora)
      return res.status(200).json({
        success: true,
        mensaje: '✅ Usuario registrado con cifrado AES-128',
        datos: {
          nombre,
          correo,
          password_cifrado: passwordCifrado,
          longitud_cifrado: passwordCifrado.length,
          algoritmo: 'AES-128'
        }
      });

    } catch (error) {
      console.error('💥 Error:', error);
      return res.status(500).json({ 
        success: false,
        error: '❌ Error interno del servidor',
        detalle: error.message 
      });
    }
  }

  return res.status(405).json({ 
    success: false,
    error: '❌ Método no permitido' 
  });
}