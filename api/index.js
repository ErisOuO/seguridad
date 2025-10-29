export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ 
    mensaje: '✅ API funcionando',
    rutas: {
      usuarios: '/api/usuarios - POST'
    }
  });
}