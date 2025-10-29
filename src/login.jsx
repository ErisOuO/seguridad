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
      console.log('📤 Enviando datos...')
      
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
        setMsg(`${data.message} - Contraseña cifrada: ${data.data.password_cifrado.substring(0, 30)}...`)
        setNombre('')
        setCorreo('')
        setPassword('')
        
        // Mostrar en consola el cifrado completo
        console.log('🔐 CONTRASEÑA CIFRADA COMPLETA (AES-128):', data.data.password_cifrado)
        console.log('📊 Información del cifrado:', {
          algoritmo: data.data.algoritmo,
          longitud: data.data.longitud_cifrado,
          fecha: data.data.registeredAt
        })
      } else {
        setError(data.error || '❌ Error al registrar usuario')
      }
    } catch (err) {
      console.error('💥 Error completo:', err)
      setError('⚠️ Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="left-side">
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
          alt="logo"
          className="logo-large"
        />
      </div>

      <div className="right-side">
        <div className="login-box">
          <h2>Registro Seguro AES-128</h2>
          <p className="subtitle">Contraseñas cifradas con algoritmo AES-128</p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nombre completo</label>
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
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Crea una contraseña segura (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert error">
                <strong>❌ Error:</strong> {error}
              </div>
            )}
            
            {msg && (
              <div className="alert success">
                <strong>✅ Éxito:</strong> {msg}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Cifrando y registrando...' : '🔐 Registrar Usuario'}
            </button>
          </form>

          <div className="footer">
            <p>
              <strong>Tecnologías utilizadas:</strong><br/>
              React + Vercel + AES-128 + CryptoJS
              <br/>
              <strong>Seguridad:</strong> Cifrado de contraseñas en el servidor
              <br/>
              © 2025 Sistema de Seguridad Informática
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login