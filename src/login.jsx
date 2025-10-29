import { useState } from 'react'
import './App.css'

function Login() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔗 URL de tu API en Vercel
  const API_URL = 'https://seguridad-git-cifrado-s-196ac5-erick-eduardos-projects-7505bdcd.vercel.app/api/register';

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    setLoading(true)

    try {
      console.log('📤 Enviando datos a MongoDB...', { nombre, correo, password: '***' })
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, correo, password }),
      })

      console.log('📨 Status:', res.status)
      
      const data = await res.json()
      console.log('📨 Respuesta completa:', data)

      if (res.ok && data.success) {
        // ✅ Mostrar mensaje con información de MongoDB REAL
        setMsg(`${data.message} - ID: ${data.data.mongo_id}`)
        setNombre('')
        setCorreo('')
        setPassword('')
        
        // Mostrar en consola la info completa de MongoDB REAL
        console.log('🔥 USUARIO GUARDADO EN MONGODB REAL:', {
          mongo_id: data.data.mongo_id,
          nombre: data.data.nombre,
          correo: data.data.correo,
          base_datos: data.data.base_datos,
          coleccion: data.data.coleccion,
          fecha_registro: data.data.fecha_registro,
          algoritmo: data.data.algoritmo,
          password_cifrado: data.data.password_cifrado
        })
      } else {
        setError(data.error || '❌ Error al registrar usuario')
      }
    } catch (err) {
      console.error('💥 Error completo:', err)
      setError('⚠️ Error de conexión con la base de datos. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="left-side">
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
          alt="logo seguridad"
          className="logo-large"
        />
        <div className="security-badge">
          <span>🔒 MongoDB Real + AES-128</span>
        </div>
      </div>

      <div className="right-side">
        <div className="login-box">
          <div className="header">
            <h2>Registro en Base de Datos</h2>
            <p className="subtitle">Usuarios guardados en MongoDB Atlas en tiempo real</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico *</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Contraseña *</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                disabled={loading}
              />
              <div className="password-info">
                🔐 Esta contraseña será cifrada con AES-128 y guardada en MongoDB Atlas
              </div>
            </div>

            {error && (
              <div className="alert error">
                <div className="alert-icon">❌</div>
                <div className="alert-content">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}
            
            {msg && (
              <div className="alert success">
                <div className="alert-icon">✅</div>
                <div className="alert-content">
                  <strong>Éxito:</strong> {msg}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Conectando a MongoDB...
                </>
              ) : (
                <>
                  <span className="btn-icon">🗄️</span>
                  Guardar en Base de Datos
                </>
              )}
            </button>
          </form>

          <div className="footer">
            <div className="tech-stack">
              <strong>Tecnologías implementadas:</strong>
              <div className="tech-items">
                <span>React</span>
                <span>Vercel</span>
                <span>MongoDB</span>
                <span>AES-128</span>
                <span>Node.js</span>
                <span>API REST</span>
              </div>
            </div>
            <div className="security-info">
              <strong>Base de datos real:</strong> MongoDB Atlas - Los usuarios se guardan en la nube con contraseñas cifradas
            </div>
            <div className="database-info">
              <strong>Colección:</strong> seguridad.usuarios
            </div>
            <div className="copyright">
              © 2025 Sistema con MongoDB Real - Base de datos en la nube
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login