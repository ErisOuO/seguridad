import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
};

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      await connectDB();
      const usuarios = await Usuario.find().sort({ createdAt: -1 });
      
      res.status(200).json({
        total_usuarios: usuarios.length,
        usuarios: usuarios.map(user => ({
          id: user._id,
          nombre: user.nombre,
          correo: user.correo,
          fecha_registro: user.createdAt
        })),
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}