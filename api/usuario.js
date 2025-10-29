export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Método POST
  if (req.method === "POST") {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Aquí podrías conectar a MongoDB si quieres luego
    return res.status(200).json({
      mensaje: "✅ Usuario recibido correctamente",
      datos: { nombre, correo },
    });
  }

  // Método no permitido
  return res.status(405).json({ error: "Método no permitido" });
}
