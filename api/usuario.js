import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI no está definida');
}

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
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
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
      console.log('📨 Recibiendo datos:', req.body);
      
      const { nombre, correo, password } = req.body;

      if (!nombre || !correo || !password) {
        console.log('❌ Faltan datos requeridos');
        return res.status(400).json({ error: "Faltan datos requeridos" });
      }

      // Conectar a MongoDB
      console.log('🔗 Intentando conectar a BD...');
      await connectDB();

      // Crear y guardar el usuario
      console.log('💾 Guardando usuario en BD...');
      const nuevoUsuario = new Usuario({
        nombre,
        correo,
        password
      });

      await nuevoUsuario.save();
      console.log('✅ Usuario guardado exitosamente:', nuevoUsuario._id);

      return res.status(201).json({
        mensaje: "✅ Usuario guardado en la base de datos",
        datos: { nombre, correo, id: nuevoUsuario._id }
      });

    } catch (error) {
      console.error("❌ Error completo:", error);
      
      if (error.code === 11000) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: "Datos de usuario inválidos" });
      }
      
      return res.status(500).json({ 
        error: "Error interno del servidor",
        detalle: error.message 
      });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}