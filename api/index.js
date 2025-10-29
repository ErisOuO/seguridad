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

  try {
    const usuarios = await Usuario.find();
    res.status(200).json({
      total_usuarios: usuarios.length,
      usuarios,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}
