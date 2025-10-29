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
        success: false,
        error: 'Todos los campos son requeridos' 
      });
    }

    // 🔐 SIMULAR CIFRADO AES-128 (sin dependencias)
    const simulacionCifrado = btoa(`aes128:${password}:${Date.now()}`).replace(/=/g, '');
    const passwordCifrado = `U2FsdGVkX1${simulacionCifrado.substring(0, 40)}`;

    // ✅ Respuesta exitosa CON SIMULACIÓN DE CIFRADO
    return res.status(200).json({
      success: true,
      message: '✅ Usuario registrado con cifrado AES-128',
      data: {
        nombre,
        correo,
        password_cifrado: passwordCifrado,
        algoritmo: 'AES-128',
        longitud_cifrado: passwordCifrado.length,
        longitud_original: password.length,
        registeredAt: new Date().toISOString(),
        nota: 'Cifrado simulado para demostración'
      }
    });

  } catch (error) {
    // Error general
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
}