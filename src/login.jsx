import { useState } from 'react'
import './App.css'

function Login() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  // 🔗 URL RELATIVA - Vercel maneja el routing automáticamente
  const API_URL = '/api/usuarios';

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMsg('✅ Usuario registrado correctamente en MongoDB')
        setNombre('')
        setCorreo('')
        setPassword('')
      } else {
        setError(data.error || 'Error al registrar usuario')
      }
    } catch (err) {
      setError('⚠️ Error de conexión con el servidor')
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
          <h2>Registro de usuario</h2>
          <p className="subtitle">Base de datos MongoDB</p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            {error && (
              <div className="alert error">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {msg && (
              <div className="alert success">
                <strong>Éxito:</strong> {msg}
              </div>
            )}

            <button type="submit" className="submit-btn">
              Registrar usuario
            </button>
          </form>

          <div className="footer">
            <p>
              soporte@empresa.com · +52 77 11 89 12 65
              <br />© 2025 Empresa — Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login