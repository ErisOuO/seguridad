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
});

const Usuario =
  mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { nombre, correo, password } = req.body;

      if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      const nuevo = new Usuario({ nombre, correo, password });
      await nuevo.save();

      res.status(200).json({
        mensaje: '✅ Usuario agregado correctamente',
        usuario: nuevo,
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'El correo ya está registrado' });
      } else {
        res.status(500).json({ error: 'Error al agregar usuario' });
      }
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
