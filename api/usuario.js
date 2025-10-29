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

  // Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Método POST - Registrar usuario
  if (req.method === "POST") {
    try {
      const { nombre, correo, password } = req.body;

      if (!nombre || !correo || !password) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
      }

      // Conectar a MongoDB
      await connectDB();

      // Crear y guardar el usuario
      const nuevoUsuario = new Usuario({
        nombre,
        correo,
        password
      });

      await nuevoUsuario.save();

      return res.status(201).json({
        mensaje: "✅ Usuario guardado en la base de datos",
        datos: { nombre, correo, id: nuevoUsuario._id }
      });

    } catch (error) {
      console.error("Error al guardar usuario:", error);
      
      if (error.code === 11000) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }
      
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Método no permitido
  return res.status(405).json({ error: "Método no permitido" });
}