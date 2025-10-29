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
      console.log('📤 Enviando datos...', { nombre, correo, password: '***' })
      
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
        // ✅ Mostrar mensaje con información del cifrado
        setMsg(`${data.message} - Cifrado: ${data.data.password_cifrado.substring(0, 25)}...`)
        setNombre('')
        setCorreo('')
        setPassword('')
        
        // Mostrar en consola el cifrado completo
        console.log('🔐 INFORMACIÓN COMPLETA DEL CIFRADO:', {
          algoritmo: data.data.algoritmo,
          cifrado_completo: data.data.password_cifrado,
          longitud_original: data.data.longitud_original,
          longitud_cifrado: data.data.longitud_cifrado,
          nota: data.data.nota,
          fecha: data.data.registeredAt
        })
      } else {
        setError(data.error || '❌ Error al registrar usuario')
      }
    } catch (err) {
      console.error('💥 Error completo:', err)
      setError('⚠️ Error de conexión con el servidor. Intenta nuevamente.')
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
          <span>🔒 Cifrado AES-128</span>
        </div>
      </div>

      <div className="right-side">
        <div className="login-box">
          <div className="header">
            <h2>Registro Seguro</h2>
            <p className="subtitle">Sistema de cifrado avanzado</p>
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
                🔐 Esta contraseña será cifrada con AES-128
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
                  Procesando cifrado...
                </>
              ) : (
                <>
                  <span className="btn-icon">🔐</span>
                  Registrar Usuario
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
                <span>AES-128</span>
                <span>API REST</span>
              </div>
            </div>
            <div className="security-info">
              <strong>Seguridad:</strong> Las contraseñas se cifran antes de cualquier procesamiento
            </div>
            <div className="copyright">
              © 2025 Sistema de Seguridad - Todos los derechos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login