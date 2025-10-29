import { MongoClient } from 'mongodb';

// Tu connection string de MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'seguridad';
const COLLECTION_NAME = 'usuarios';

// Clave para el cifrado simulado
const AES_KEY = 'miclavesegura123';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    console.log('🔗 Conectando a MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado a MongoDB exitosamente');
    
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

// Función para simular cifrado AES-128
function simularCifradoAES(texto) {
  const timestamp = Date.now();
  const textoParaCifrar = `aes128:${texto}:${timestamp}`;
  const cifradoBase64 = Buffer.from(textoParaCifrar).toString('base64');
  return `U2FsdGVkX1${cifradoBase64.substring(0, 50)}`;
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { nombre, correo, password } = req.body;

    // Validar campos
    if (!nombre || !correo || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Todos los campos son requeridos' 
      });
    }

    // 🔐 Simular cifrado AES-128
    const passwordCifrado = simularCifradoAES(password);
    console.log('🔐 Contraseña cifrada:', passwordCifrado);

    // Conectar a MongoDB
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Verificar si el correo ya existe
    const usuarioExistente = await collection.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        error: '❌ El correo electrónico ya está registrado'
      });
    }

    // Crear documento del usuario
    const usuario = {
      nombre,
      correo,
      password_cifrado: passwordCifrado,
      algoritmo: 'AES-128',
      fecha_registro: new Date(),
      activo: true,
      metadata: {
        longitud_original: password.length,
        longitud_cifrado: passwordCifrado.length,
        version: '1.0'
      }
    };

    // 🔥 GUARDAR EN MONGODB
    const resultado = await collection.insertOne(usuario);
    console.log('✅ Usuario guardado en MongoDB:', resultado.insertedId);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: '✅ Usuario registrado con cifrado AES-128 en MongoDB',
      data: {
        id: resultado.insertedId,
        nombre,
        correo,
        password_cifrado: passwordCifrado,
        algoritmo: 'AES-128',
        fecha_registro: usuario.fecha_registro,
        mongo_id: resultado.insertedId
      }
    });

  } catch (error) {
    console.error('💥 Error en el servidor:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: '❌ El correo electrónico ya está registrado'
      });
    }
    
    res.status(500).json({
      success: false,
      error: '❌ Error interno del servidor',
      detalle: error.message
    });
  }
}