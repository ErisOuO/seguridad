export default async function handler(req, res) {
  // Configurar CORS primero
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener datos del cuerpo
    const { nombre, correo, password } = req.body;

    // Validar campos
    if (!nombre || !correo || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    // ✅ Respuesta exitosa SIMPLE
    return res.status(200).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        nombre,
        correo,
        registeredAt: new Date().toISOString()
      }
    });

  } catch (error) {
    // Error general
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
}