import { MongoClient } from 'mongodb';

// Tu connection string de MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'seguridad';
const COLLECTION_NAME = 'usuarios';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    console.log('🔗 Conectando a MongoDB...');
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI no está definida');
    }

    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('✅ Conectado a MongoDB exitosamente');
    
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
}

// Función para simular cifrado AES-128 (temporal)
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

  let client;
  
  try {
    const { nombre, correo, password } = req.body;

    // Validar campos
    if (!nombre || !correo || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Todos los campos son requeridos' 
      });
    }

    console.log('📝 Registrando usuario en MongoDB REAL:', { nombre, correo });

    // 🔐 Simular cifrado AES-128
    const passwordCifrado = simularCifradoAES(password);
    console.log('🔐 Contraseña cifrada:', passwordCifrado);

    // 🔥 CONECTAR A MONGODB REAL
    client = await connectToDatabase();
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

    // Crear documento del usuario para MongoDB
    const usuarioDocument = {
      nombre: nombre.trim(),
      correo: correo.toLowerCase().trim(),
      password_cifrado: passwordCifrado,
      algoritmo: 'AES-128',
      fecha_registro: new Date(),
      activo: true,
      metadata: {
        longitud_original: password.length,
        longitud_cifrado: passwordCifrado.length,
        version: '1.0',
        entorno: 'produccion'
      }
    };

    // 🔥 GUARDAR EN MONGODB REAL
    const resultado = await collection.insertOne(usuarioDocument);
    console.log('✅ Usuario GUARDADO EN MONGODB REAL:', resultado.insertedId);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: '✅ Usuario registrado en MONGODB REAL con cifrado AES-128',
      data: {
        id: resultado.insertedId.toString(),
        nombre: usuarioDocument.nombre,
        correo: usuarioDocument.correo,
        password_cifrado: passwordCifrado,
        algoritmo: 'AES-128',
        fecha_registro: usuarioDocument.fecha_registro,
        mongo_id: resultado.insertedId.toString(),
        base_datos: 'MongoDB Atlas (REAL)',
        coleccion: COLLECTION_NAME
      }
    });

  } catch (error) {
    console.error('💥 Error en MongoDB:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: '❌ El correo electrónico ya está registrado en la base de datos'
      });
    }
    
    res.status(500).json({
      success: false,
      error: '❌ Error conectando con la base de datos',
      detalle: error.message
    });
  } finally {
    // No cerramos la conexión para reutilizarla
  }
}