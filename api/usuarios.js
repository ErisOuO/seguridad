import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
};

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      await connectDB();
      
      const { nombre, correo, password } = req.body;
      
      if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      const usuario = new Usuario({ nombre, correo, password });
      await usuario.save();

      return res.status(200).json({
        mensaje: '✅ Usuario registrado en MongoDB',
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo
        }
      });
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'El correo ya existe' });
      }
      return res.status(500).json({ error: 'Error del servidor' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}